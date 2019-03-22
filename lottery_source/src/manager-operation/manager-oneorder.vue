<template>
  <div class="fh content">
    <div class="store-info d-flex re">
      <div v-if="state == '2'" class="delivered">
        <img src="../assets/complete.png" width="60" height="60" alt="complete"/>
      </div>
      <div class="img self-center">
        <img src="../assets/manager-oneOrder.png" alt="">
      </div>
      <div class="info self-center ml-10">
        <div class="f-14">{{orderInfo.view_name}}</div>
        <div class="f-13 mt-10"><span>{{orderInfo.name}}</span><span class="ml-10">{{orderInfo.phone}}</span></div>
        <div class="address f-13 mt-10">{{orderInfo.area}}{{orderInfo.city}}{{orderInfo.address}}</div>
      </div>
    </div>
    <div class="order-info f-13">
      <div class="num">订单号：{{orderInfo.trade_no}}</div>
      <div class="total-money mt-10">订单金额：<span class="i-red">￥{{orderInfo.total_money}}</span></div>
      <div class="time mt-10">下单时间：{{orderInfo.create_date}}</div>
    </div>
    <div class="goods f-12">
      <div class="good-info" v-for="(item, index) in orderInfo.detail" :key="index">{{item.title}} * {{item.ticket_num}}</div>
    </div>
    <div class="text-right mt-10">
       <button @click="goSend" class="btn btn-self btn-confirm btn-pad"> {{stateMap[state]}}</button>
    </div>
  </div>
</template>

<script>
import {api} from '../public/api'
import { MessageBox } from 'mint-ui'
export default {
  name:'one-order',
  data() {
    return {
      trade_no: '',
      area_id: '',
      orderInfo: {},
      state:'',
      stateMap:{
        '0':'去配送',
        '1':'待确认',
        '2':'去查看'
      }
    }
  },
  created() {
    this.trade_no = this.$route.query.trade_no
    this.area_id = this.$route.query.area_id
    this.getOrder()
  },
  methods: {
    getOrder() {
      if(this.trade_no && this.area_id) {
        api.request('mobile/order/getOrderDetail',{trade_no: this.trade_no, area_id:this.area_id})
        .then(data => {
          if(data.code==0 && data.msg=='success'){
             this.orderInfo = data.data
             this.state = data.data.order_status+''
          }else{
            MessageBox.alert('订单数据获取失败', '提示')
          }
        })
        .catch(err => {
          MessageBox.alert('服务器错误，请重试', '提示')
          console.log(err)
        })
      }else{
        MessageBox.alert('缺少参数', '提示')
      }
    },
    goSend() {
      this.$router.push({path: '/manager-order',query:{state: this.state}})
      // this.$router.push({path: '/manager-order',query:{state: 1}})
    }
  }
}
</script>

<style scoped>
  .delivered{
    position: absolute;
    top: -5px;
    right: -5px;
    -webkit-transform: rotate(30deg);
    transform: rotate(30deg);
  }
  .content {
    padding: 15px;
    background-color: #ffffff;
    color: #555;
  }
  .store-info {
    padding: 15px 0;
    border-bottom: 1px solid #eeeeee;
  }
  .store-info .img{
    width: 55px;
    flex-shrink: 0;
  }
  .store-info .img img{
    width: 100%;
  }
  .order-info {
    padding: 15px 0;
  }
  .goods .good-info{
    color: #747474;
    width: 32%;
    display: inline-block;
    margin-top: 10px;
  }
  
  .goods .good-info:nth-child(3n-2){
    text-align: left;
  }
  .goods .good-info:nth-child(3n-1){
    text-align: center;
  }
  .goods .good-info:nth-child(3n){
    text-align: right;
  }
  .btn-pad{
    padding: 3px 25px;
    box-sizing: content-box;
    min-width: 60px;
  }
</style>
