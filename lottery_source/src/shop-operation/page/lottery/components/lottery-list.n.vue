<template>
  <div class="lottery-list d-flex box pb-60 re" ref="lotteryList">
    <!-- nav -->
    <vue-scroll
      :listenScroll="true"
      :probeType="1"
      :bounce="{bottom: true}"
      @scrollObj="handleNavScrollObj"
      @scroll="handleNavScroll">
      <div class="list-nav fh" ref="listNav">
        <!-- item -->
        <div class="nav-item re" v-for="(nav, i) in navList" :key="i" :class="{active: i === currentIndex}" @click="handleNavClick(i, $event)">
          {{nav.type | NumberToChinese}}元票
          <div v-if="nav.num" class="nav-num">{{nav.num}}</div>
        </div>
      </div>
    </vue-scroll>
    <!-- goods list -->
    <vue-scroll 
      :listenScroll="true"
      :bounce="{bottom: true}"
      :tag="true"
      @scrollObj="hangleGoodsScrollObj"
      @scroll="handleGoodsScroll"
      style="flex: 1">
      <div class="list-content" id="listContainer" ref="scrollElem">
        <!-- item -->
        <div v-for="(key) in lotteryType" :Key="key" class="goods-list goods-list-hook">
          <div class="lottery-title">{{key | NumberToChinese }}元票</div>
          <div v-for="item in order" class="item-box" :key="item.index" v-if="item.type === key">
            <div>
              <div class="item-title mb-3">{{item.title}}</div>
              <div class="item-des mb-3">{{item.description}}</div>
              <div class="item-price mb-3">￥{{item.price}}</div>
            </div>
            <div v-if="!Number(item.inventory)">
              <img src="../../../../assets/sold-out.png" width="100%" alt="lottery litle">
            </div>
            <div v-else class="re d-flex align-items-center" @click.stop>
              <div class="mr-5" v-if="item.num" @click="minus(item)">
                <i class="iconfont icon-reduction f-25 i-blue-8" aria-hidden="true"></i>
              </div>
              <div class="" v-if="item.num">{{item.num}}</div>
              <div class="ml-5" @click="add(item,$event)">
                <i class="iconfont icon-add2 f-25 i-blue-8" aria-hidden="true"></i>
              </div>
              <div v-if="item.num && Number(item.inventory) < 99" class="ab inventory">库存 {{item.inventory}} </div>
            </div>
          </div>
        </div>
      </div>
      <div class="lottery-title fd">{{currentType | NumberToChinese }}元票</div>
    </vue-scroll>
  </div>
</template>

<script>
import { mapGetters, mapState, mapMutations,mapActions} from 'vuex'
import {api} from '@/public/api'
import { Parabola } from '@/public/tools/Parabola'
import VueScroll from '@/components/scroll/vue-scroll'
export default {
  props:['lotteryScrollObj'],
  name: 'lottery-list',
  components:{
    VueScroll
  },
  data() {
    return {
      navScrollObj: '', // nav scroll 实例化对象
      goodsScrollObj: '', // goods scroll 实例化对象
      scrollY: 0,  // 监听 goods 的滚动距离
      listHeight: [], // goods 每一项距离顶部的高度
      currentType: '', // goods 固定在顶部的导航条 
    }
  },
  computed: {
    // goods 列表 监听 this.scrollY ，判断滚动到哪个区域区间
    currentIndex: {
      get() {
        for(let i = 0; i < this.listHeight.length; i++){
          let preHeight = this.listHeight[i] 
          let aftHeight = this.listHeight[i + 1]
          if(!aftHeight || (this.scrollY >= preHeight && this.scrollY < aftHeight)){
            this.currentType = this.lotteryType[i] || 0
            return i
          }
        }
        return 0
      },
      set (index) {
        this.scrollY = this.listHeight[index]
      }
    },
    ...mapState({
      isOver: state => state.newLottery.isOver,
      lotteryType: state => state.newLottery.type,
      navList: state => state.newLottery.navList,
      order: state => state.newLottery.orderList
    })
  },
  watch: {
    order: {
      handler (n, o) {
        this.$nextTick(() => {
          if(n && n.length > 0){
            this.calculateHeight()
          }
        })
      },
      immediate: true
    }
  },
  methods: {
    // nav 点击事件
    handleNavClick(index, event) {
      // better-scroll 可以监听到此事件，浏览器原生不能监听到  防止pc端出现两次点击
      if (!event._constructed) {
          return;
      }
      // 获取产品的li Dom节点列表
      let goodsList = this.$refs.scrollElem.getElementsByClassName('goods-list-hook')
      if(goodsList){
        let el = goodsList[index]
        this.goodsScrollObj.scrollToElement(el, 300)
      }

      this.currentIndex = index
    },
    // 处理 导航 scroll 事件
    handleNavScroll (pos) {
      if (Math.abs(pos.y) === 0) {
        this.lotteryScrollObj.enable()
      }
      if (Math.abs(pos.y) > 0) {
        this.lotteryScrollObj.disable()
      }
    },
    // 处理 列表 scroll 事件
    handleGoodsScroll (pos) {
      this.scrollY = Math.abs(Math.round(pos.y))
      if (Math.abs(pos.y) === 0) {
        this.lotteryScrollObj.enable()
      }
      if (Math.abs(pos.y) > 0) {
        this.lotteryScrollObj.disable()
      }
    },
    // nav bscroll 对象
    handleNavScrollObj (val) {
      this.navScrollObj = val
      this.$emit('navScrollObj', val)
    },
    // goods bscroll 对象
    hangleGoodsScrollObj (val) {
      this.goodsScrollObj = val
      this.$emit('goodsScrollObj', val)
    },
    ...mapMutations([
      'changeOpen',
      'changeNav',
      'changeScrollState'
    ]),
    ...mapActions({
      minusNum: 'minus',
      addNum: "add",
    }),
    minus(item) {
      this.minusNum(item)
    },
    add(item,e) {
      window.addEventListener('tap', function() {
        console.log('tag')
      }, false);
      this.addNum(item)
      if(this.isOver) {
        return
      }
      this.changeOpen(true)
      Parabola.addLine(e,'#drop-container','#shoppingCart',this)
    },
    // 计算 goods 列表每一个 list 距离父级 div 的高度
    calculateHeight() {
      let goodsList = this.$refs.scrollElem.getElementsByClassName('goods-list-hook')
      // 第一个的高度为0
      let height = 0
      this.listHeight.push(height)
      if(goodsList.length > 0){
        for(let i = 0; i < goodsList.length; i++) {
          let item = goodsList[i];
          height += item.clientHeight;
          this.listHeight.push(height)
        }
      }
      // 计算 页面可视区域的宽度 赋值给 lotteryList
      this.$refs.lotteryList.style.height = (document.getElementsByTagName('body')[0].getBoundingClientRect().height || 0) + 'px'
    },
  },
  filters: {
    NumberToChinese(v) {
      var chnNumChar = ["零","一","二","三","四","五","六","七","八","九"];
      var chnUnitSection = ["","万","亿","万亿","亿亿"];
      var chnUnitChar = ["","十","百","千"];
      var section = Number(v)
      var strIns = '', chnStr = '';
      var unitPos = 0;
      var zero = true;
      if(section === 0) {
        return '零'
      }
      while(section > 0){
          var v = section % 10;
          if(v === 0){
              if(!zero){
                  zero = true;
                  chnStr = chnNumChar[v] + chnStr;
              }
          }else{
              zero = false;
              strIns = chnNumChar[v];
              strIns += chnUnitChar[unitPos];
              chnStr = strIns + chnStr;
          }
          unitPos++;
          section = Math.floor(section / 10);
      }
      return chnStr;
    }
  },
}
</script>

<style scoped>
  .nav-num{
    position: absolute;
    top: 3px;
    right: 3px;
    min-width: 14px;
    min-height: 14px;
    font-size: 12px;
    color: #fff;
    background: red;
    border-radius: 60px;
    text-align: center;
    line-height: 14px;
  }
  .lottery-title,.lottery-title-ph{
    font-size: 12px;
    padding: 10px 15px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    background: #fff;
  }
  .lottery-title-ph{
    height: 16px;
  }
  .Hidden{
    display: none;
  }
  .fd{
    position: absolute;
    width: 80%;
    top:0;
    z-index: 2;
    transition: all 1s
  }
  .lottery-list{
    background: #fff;
  }
  .list-nav{
    background: #edf3f0;
  }
  .list-nav .nav-item{
    padding: 10px 15px;
    font-size: 12px;
  }
  .active{
    background: #fff;
    /* transition: all 0.5s */
  }
  .pb-60{
    padding-bottom: 60px;
  }
  .list-content{
    flex-grow: 1;
  }
  .item-box {
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    padding-top: 7px;
    padding-left: 15px;
    padding-right: 15px;
    padding-bottom: 4px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .item-title {
    font-size: 14px;
    color: rgba(0, 0, 0, 0.75);
  }

  .item-des {
    font-size: 12px;
    color: rgba(0, 0, 0, 0.5);
  }

  .item-price {
    font-size: 14px;
    color: red;
  }

  .mb-3 {
    margin-bottom: 3px;
  }

  .i-red {
    color: red;
  }

  .i-grey {
    color: rgba(0, 0, 0, 0.3);
  }

  .inventory {
    width: 80px;
    text-align: right;
    top: 25px;
    right: 5px;
    font-size: 12px;
    color: rgba(0, 0, 0, 0.5);
  }
  .empty-text{
    text-align: center;
    margin-top: 50%;
    color: #aaa;
  }
</style>