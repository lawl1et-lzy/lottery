<template>
  <div class="scroll fh re" @scroll="scroll($event)">
    <div class="header re">
      <img src="../../../assets/lottery/banner.png" alt="" width="100%" height="100px">
      <div class="header-text">每次下单固定金额{{total.join('或')}}元</div>
    </div>
    <div class="hot" v-if="hotlist.length">
      <div class="hot-title">
        <span class="">
          <svg version="1.1" id="图层_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
            viewBox="0 0 1024 1024" style=" width: 16px; height: 16px;" xml:space="preserve">
          <linearGradient id="SVGID_1_" gradientUnits="userSpaceOnUse" x1="484.6862" y1="926.2979" x2="593.019" y2="145.7459">
            <stop  offset="0" style="stop-color:#F5AD2B"/>
            <stop  offset="1" style="stop-color:#E73F2C"/>
          </linearGradient>
          <path class="st0" d="M361.8,946.6c39.2,12.6,44.7-1,22.3-35.6c-38.3-59.1-73.1-166.7,3.8-327.5c82.3-174,196.5-243.3,217.1-247
            c16.4-3-112.6,194.3-118.7,297.8c-2.7,46.7,70.4,81.6,114.4,54.4c56.7-35.2,52.5-147.8,51.1-165c-1.7-20.1,107.4,248.8-26.2,396.1
            c-27.7,30.5-24.3,46.3,15.9,37c78.6-18.1,194.1-71,212.4-225.5C871.5,514,672.1,207.9,546.5,80.1c-28.9-29.4-43.1-17-41.7,24.1
            c2.1,61.9-17.2,158.2-118.6,269.7C227.1,548.8,191.4,583,170,727.6C170,804.6,167.7,884.1,361.8,946.6L361.8,946.6z"/>
          </svg>
        </span>
        <span>热销</span>
      </div>
      <div class="d-flex scroll">
        <div class="hot-card" v-for="item in hotlist" :key="item.index">
          <div class="type re">
            <img width="100%" src="../../../assets/lottery/hot-bg1.png" alt="">
            <div class="type-text">
              <div class="f-14"><span class="iconfont icon-symbol f-12"></span> {{Number(item.price_type)}}元票 <span class="iconfont icon-quotes f-12"></span></div>
              <div class="f-16">{{item.title}}</div>
            </div>
          </div>
          <!-- <div class="f-12 text-center"></div> -->
          <div class="f-12 text-center mt-5"><span class="i-red">￥{{item.price}}</span></div>
          <!-- <div class="f-12 i-grey-4">{{item.description}}</div> -->
          <div class="my-10-5 d-flex j-center align-items-center">
            <div class="mr-5" v-if="item.num" @click="minus(item)">
              <i class="iconfont icon-reduction f-25 i-blue-8" aria-hidden="true"></i>
            </div>
            <div class="" v-if="item.num">{{item.num}}</div>
            <div class="ml-5" @click="add(item,$event)">
              <i class="iconfont icon-add2 f-25 i-blue-8" aria-hidden="true"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
    <list :scroll="isScroll"></list>
  </div>
</template>

<script>
import {api} from '../../../public/api'
import { Parabola } from '../../../public/tools/Parabola'
import list from './components/lottery-list'
import { MessageBox } from 'mint-ui';
import { mapState } from 'vuex'
export default {
  name: 'new-lottery',
  components: {
    list
  },
  data: function() {
    return {
      isScroll: false,
    }
  },
  computed: {
    ...mapState({
      isOver: state => state.newLottery.isOver,
      total: state => state.newLottery.total,
      hotlist: state => state.newLottery.hotOrderList,
      order: state => state.newLottery.orderList
    }),
  },
  created() {
    if (!this.order.length) {
      this.$store.dispatch('initLotteryData');
    }
  },
  methods: {
    minus(item) {
      this.$store.dispatch('minus', item);
      },
    add(item,e) {
      this.$store.dispatch('add', item);
      if(this.isOver) {
        return
      }
      console.log(e)
      this.$store.commit('changeOpen', true)
      Parabola.addLine(e,'#listContainer','#shoppingCart',this)
    },
    scroll(e) {
      let limit = this.hotlist.length ? 296 : 105;
      let scrollTop = e.target.scrollTop;
      this.$store.commit('changeScrollState', false)
      if(scrollTop > limit) {
        this.isScroll = true;
      } else {
        this.isScroll = false;
      }
    }
  }
}
</script>

<style scoped>
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
  .hot{
    background: #fff;
    margin-bottom: 10px;
  }
  .hot .hot-title{
    padding-top: 5px;
    padding-left: 10px;
    padding-right: 10px;
    padding-bottom: 0px;
  }
  .hot .hot-card{
    margin: 5px 0;
    padding: 5PX;
    box-shadow: 0px 1px 1px rgba(0,0,0,0.08);
  }
  .hot .type{
    width: 130px;
  }
  .my-10-5{
    margin-top: 9px;
    margin-bottom: 5px;
  }
  .hot .type-text{
    position: absolute;
    width: 100%;
    color: #fff;
    text-align: center;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
  }
</style>
<style type="text/css">
  .st0{fill:url(#SVGID_1_);}
</style>