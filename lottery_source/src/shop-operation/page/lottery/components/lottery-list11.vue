<template>
  <div class="lottery-list d-flex box fh no-scroll">
    <div class="list-nav fh">
      <div class="nav-item re" v-for="(nav, i) in navList" :key="i" :class="{active: i==navIndex || nav.active}" @click="navSelected(nav,i)">
        {{nav.type | NumberToChinese}}元票
        <div v-if="nav.num" class="nav-num">{{nav.num}}</div>
      </div>
    </div>
    <vue-scroll class="wrapper list-content fh" style="backgroud:#fff"
      :data="order"
      :probeType="3"
      :click="true"
      :listenScroll="true"
      @scroll="listScroll"
      ref="scrollList"
      >
      <div class="content"  id="listContainer">
        <div v-for="(key,i) in lotteryType" :Key="key">
          <div class="lottery-title" :class="{fd:i == navIndex}">{{key | NumberToChinese }}元票</div>
          <div class="lottery-title-ph" :class="{Hidden: i != navIndex}"></div>
          <div v-for="item in order" class="item-box" :key="item.index" v-if="item.type == key">
            <div>
              <div class="item-title mb-3">{{item.title}}</div>
              <div class="item-des mb-3">{{item.description}}</div>
              <div class="item-price mb-3">￥{{item.price}}</div>
            </div>
            <div v-if="!Number(item.inventory)">
              <img src="../../../../assets/sold-out.png" width="100%" alt="lottery litle">
            </div>
            <div v-else class="re d-flex align-items-center">
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
        <div :style="{height: scrollState ? '400px': '0px'}"></div>
      </div>
    </vue-scroll>
  </div>
</template>

<script>
import { mapGetters, mapState, mapMutations,mapActions} from 'vuex'
import {api} from '../../../../public/api'
import { Parabola } from '../../../../public/tools/Parabola'
import vueScroll from '../../../../components/scroll/vue-scroll'
export default {
  props:[''],
  name: 'lottery-list',
  components:{
    vueScroll
  },
  data: function() {
    return {
      listMap: {},
      navIndex: -1,
      currentIndex: -1,
      scrollEle:null,
      scrollArr: [],
      oldScrollTop: 0,
      reTop: 0,
      ele:null,
      scrolledTop:0,
    }
  },
  mounted () {
    setTimeout(() => {
      this.$refs.scrollList.disable()
    },1000)
  },
  computed: {
    ...mapState({
      isOver: state => state.newLottery.isOver,
      lotteryType: state => state.newLottery.type,
      navList: state => state.newLottery.navList,
      order: state => state.newLottery.orderList,
      height: state =>state.newLottery.scrollContentHeight,
      scrollState: state=> state.newLottery.scrollState
    })
  },
  watch:{
    scrollState:function(val) {
      if(val) {
        this.$refs.scrollList.disable()
      } else {
        this.$refs.scrollList.enable()
      }
    }
  },
  methods: {
    ...mapMutations([
      'changeOpen',
      'changeNav',
      'changeScrollState',
      'changeChildScrollState'
    ]),
    ...mapActions({
      minusNum: 'minus',
      addNum: "add",
    }),
    minus(item) {
      this.minusNum(item)
    },
    add(item,e) {
      this.addNum(item)
      if(this.isOver) {
        return
      }
      this.changeOpen(true)
      Parabola.addLine(e,'#listContainer','#shoppingCart',this)
    },
    listScroll(e) {
      let scrollResult = this.isScrollTop()
      // console.log(scrollResult)
      // if(scrollResult.isTop) {
      //    this.$refs.scrollList.disable()
      //    this.changeChildScrollState(false)
      // } else {
      //   this.$refs.scrollList.enable()
      //   this.changeChildScrollState(true)
      // }
      if(scrollResult.isEnd) {
        // this.$refs.scrollList.disable()
        this.changeChildScrollState(false)
      }
    },
    isScrollTop(){
      let topNum = this.$refs.scrollList.scroll.movingDirectionY
      let scrollY = Math.abs(this.$refs.scrollList.scroll.y)
      let maxTop = Math.abs(this.$refs.scrollList.scroll.maxScrollY)
      let height = maxTop -scrollY
      let isTop = topNum > 0? true : false
      let isEnd = height < maxTop ? false : true
      return {isTop, isEnd}
    },
    navSelected(nav,i){
      this.ele = document.querySelectorAll('.lottery-title')[i];
      this.$refs.scrollList.enable()
      this.$refs.scrollList.scrollToElement(this.ele,200)
      this.changeNav(nav)
      this.changeChildScrollState(true)
    }
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
  }
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
    background: #fff;
  }
  .item-box {
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    padding: 7px 15px 4px;
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