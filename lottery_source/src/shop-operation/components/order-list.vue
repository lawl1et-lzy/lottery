<template>
<div>
  <div>
    <div v-for="(item, i) in list" :key="i" class="item-box">
      <div class="order-info bb">
        <div class="img">
          <img v-if="type =='unpayed'" src="../../assets/lottery-order/unpayed.png" width="60" height="60" alt="">
          <img v-if="type =='payed'" src="../../assets/lottery-order/payed.png" width="60" height="60" alt="">
          <img v-if="type =='finish'" src="../../assets/lottery-order/finish.png" width="60" height="60" alt="">
        </div>
        <div class="info">
          <div>订单金额：<span>￥{{item.money}}</span> </div>
          <div v-if="type =='finish'">获得公益分：
            <!-- <i class="iconfont icon-integral2 text-yellow f-14"></i>  -->
            {{item.credits}}</div>
          <div>实际应付：<span class="text-red">￥{{item.relmoney}}</span></div>
          <div v-if="item.rebate != '0.00'">返佣金额：<span class="text-red">￥{{item.rebate}}</span></div>
        </div>
        <div  class="button">
          <div v-if="type =='payed'">
            <div v-if="item.delivery == 1">
              <i class="iconfont icon-delivery"></i> 
              <span> 等待配送</span>
            </div>
          </div>

        </div>
      </div>
      <div class="order-detail">
        <div v-if="item.note">备注：{{item.note}}</div>
        <div class="mt-5">订单号：{{item.trade_no}}</div>
        <div class="mt-5">下单时间：{{item.create_date}}</div>
        <div class="mt-5" v-if="item.pay_type">支付方式：{{item.pay_type}}</div>
        <div class="mt-5" v-if="item.update_date && !item.confirmer">订单完成：{{item.update_date}}</div>
      </div>
      <div class="order-list">
        <div class="mb-5" v-for="lottery in item.detail" :key="lottery.index">{{lottery.title}} * {{lottery.ticket_num}}</div>
      </div>
      <div v-if="type=='payed' && item.delivery == 2" class="btn-group">
        <div v-if="item.feng_id"><button class="btn btn-self btn-cancel btn-pad"> 查看物流</button></div>
        <div style="width:108px" v-else></div>
        <button @click="confirmOrder(item)" class="btn  btn-confirm btn-self"><i class="iconfont icon-querenshouhuo f-12"></i> 确认收货</button>
      </div>
      <div v-if="type=='unpayed'" class="btn-group">
        <div><button @click="cancelOrder(item)" class="btn btn-self btn-cancel btn-pad"> 取消订单</button></div>
        <div><button @click="confirmOrder(item)" class="btn btn-self btn-confirm btn-pad"><i class="iconfont icon-querenshouhuo f-12"></i> 去支付</button></div>
      </div>
      <div class="f-12 confirm-text" v-if="type=='finish' && item.confirmer">
        <span><i class="iconfont icon-goods i-color"></i></span>
        <span class="text-333 ml-5">确认收货：</span>
        <span class="text-333">{{item.confirmer}}</span>
        <span v-if="item.update_date" class="ml-5">{{item.update_date}}</span>
      </div>
    </div>
    <!-- <div class="py-10">
      <div class="load" v-if="!loading">
        <mt-spinner :type="3" color="rgba(0,0,0,0.6)" :size="20"></mt-spinner>
        <span class="pl-5">正在加载...</span>
      </div>
      <div v-else class="f-12 text-center i-grey-6">
          —— 全部显示完毕 ——
      </div>
    </div> -->
  </div>
  <div v-if="isLoading" class="custom-loading">
    <div class="loading-item"></div>
    <div class="loading-text">正在加载...</div>
  </div>
  <div v-if="!isLoading && isEmpty" class="empty-box">
    <img src="../../assets/empty.png" alt="">
    <div class="f-14 text-center i-grey-6">暂无订单</div>
  </div>
</div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
const { mapState, mapActions, mapMutations, mapGetters } = createNamespacedHelpers('order')
export default {
  name: 'order-list',
  props: ['type', 'list'],
  data: function() {
    return {
    }
  },
  computed:{
    ...mapState({
      isLoading: state => state.isLoading
    }),
    ...mapGetters([
      'isEmpty',
    ]),

    loading () {
      return !this.needLoad
    },
  },
  methods: {
    confirmOrder(item) {
      this.$emit('confirm',item);
    },
    cancelOrder(item) {
      this.$emit('cancel', item)
    }
  }
}
</script>

<style scoped>
  .item-box{
    background: #fff;
    margin: 15px 0;
    font-size: 14px;
    color: #8e8e8e;
  }
  .order-info{
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px;
  }
  .order-info .img {
    margin-right: 15px; 
  }
  .order-info .info {
    flex-grow: 1; 
  }
  .order-info .info div{
    text-align: left;
    margin: 5px 0;
    color: #333;
  }
  .order-info .button {
    margin-right:30px; 
  }
  .text-red{
    color: #ff6666;
  }
  .order-detail{
    padding: 15px;
    font-size: 12px;
  }
  .order-list{
    display: flex;
    flex-wrap:wrap;
    padding:0 15px; 
  }
  .order-list div{
    text-align: left;
    font-size: 12px;
    width: 33.33%;
    color: rgba(0,0,0,0.5);
  }
  .text-yellow{
    color: #f5c808;
  }
  .load{
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 12px;
    color: rgba(0,0,0,0.6);
  }
  .btn-group{
    display: flex;
    justify-content: space-around;
    padding: 15px;
  }
  .btn-group .btn-pad{
    padding: 3px 25px;
  }
.confirm-text{
  padding: 15px;
  margin-top: 10px;
  border-top: 1px solid rgba(0,0,0,0.1);
}
.i-color{
 color: #24D0A4
}

.text-333{
  color: #333
}

</style>