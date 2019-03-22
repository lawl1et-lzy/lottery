<template>
  <vue-scroll
    :listenScroll="true"
    :click="true"
    @scrollObj="handleLotteryScrollObj"
    @scroll="handleLotteryScroll"
    >
    <!-- lotteryPage -->
    <div id="lotteryPage" class="re">
      <!-- header -->
      <div class="header re" ref="header">
        <img src="../../../assets/lottery/banner.png" alt="" width="100%" height="100px">
        <div class="header-text">每次下单固定金额{{total.join('或')}}元</div>
      </div>

      <!-- hot list -->
      <hot-list @hot-list-height="handleHotListHeight"></hot-list>

      <!-- goods -->
      <list :lotteryScrollObj="lotteryScrollObj" @navScrollObj="handleNavScrollObj" @goodsScrollObj="handleGoodsScrollObj"></list>
    </div>
  </vue-scroll>
</template>

<script>
import list from './components/lottery-list.n'
import VueScroll from '@/components/scroll/vue-scroll'
import HotList from './components/Hot-List'
import { mapState } from 'vuex'
export default {
  name: 'new-lottery',
  components: {
    list,
    VueScroll,
    HotList
  },
  data () {
    return {
      lotteryScrollObj: '', // lottery bscroll 实例化对象
      navScrollObj: '',  //  nav bscroll 实例化对象
      goodsScrollObj: '', // goods bscroll 实例化对象
      headAndHotHeight: '', // hear 和 hot list 的高度
      hotListHeight: 0, // 热销组件的高度
    }
  },
  computed: {
    ...mapState({
      total: state => state.newLottery.total,
      order: state => state.newLottery.orderList
    }),
  },
  watch: {
    hotListHeight(n, o){
      this.$nextTick(() => {
        this.calHotAndHeadHeight()
      })
    },
  },
  methods: {
    // lottery 的 bscroll 实例化对象
    handleLotteryScrollObj(obj) {
      this.lotteryScrollObj = obj
    },
    // list 组件 nav bscroll 实例化对象
    handleNavScrollObj(obj) {
      this.navScrollObj = obj
      this.navScrollObj.disable()
    },
    // list 组件 goods bscroll 实例化对象
    handleGoodsScrollObj(obj) {
      this.goodsScrollObj = obj
      this.goodsScrollObj.disable()
    },
    // 处理 lottery 滚动监听
    handleLotteryScroll(pos) {
      if(Math.abs(Math.round(pos.y)) >= this.headAndHotHeight){
        this.navScrollObj.refresh()
        this.goodsScrollObj.refresh()
        this.navScrollObj.enable()
        this.goodsScrollObj.enable()
      } else {
        this.navScrollObj.disable()
        this.goodsScrollObj.disable()
      }
    },
    // 处理 热销 列表的高度
    handleHotListHeight(v) {
      this.hotListHeight = v
    },
    // 计算 顶部 和 热销 的高度
    calHotAndHeadHeight() {
      let headeHeight = this.$refs.header.getBoundingClientRect().height || 0
      this.headAndHotHeight = Number(headeHeight) + Number(this.hotListHeight)
    },
  },
  created() {
    if (!this.order.length) {
      this.$store.dispatch('initLotteryData');
    }
  },
}
</script>

<style scoped lang="scss">
  .hide{
    display: none !important;
    transition: display 3s;
  }
  .header {
    display: block;
    height: 110px;
    width: 100%;
  }
  .header .header-text{
    position: absolute;
    top: 57px;
    left: 29px;
    color: rgba(0,0,0,0.6);
    font-size: 13px;
  }
</style>