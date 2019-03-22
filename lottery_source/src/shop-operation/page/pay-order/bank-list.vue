<template>
  <div class="p-10-20 container scroll pb-90">
    <div class="bank-card text-white" 
      v-for="item in bankList" 
        :key="item.index" 
        :class="[{ active: item.active }, item.class]"
        @click="selectBank(item)">
      <div class="model"></div>
      <div class="text-box">
        <img class="text" :src="item.logo" alt="">
      </div>
      <div class="d-flex justify-content-between align-items-center">
        <div class="d-flex align-items-center">
          <div class="bank-logo">
            <img :src="item.logo" alt="">
          </div>
          <div class="bank-name">{{item.bank_name}}</div>
        </div>
        <div class="bank-img">
          <img width="40" height="30" src="../../../assets/bank-img.png" alt="">
        </div>
      </div>
      <div class="d-flex j-around mt-30">
        <div class="line-height">****</div>
        <div class="line-height">****</div>
        <div class="line-height">****</div>
        <div>{{item.account_no | afterSelice}}</div>
      </div>
    </div>
    <div class="add-bank" @click="addBank">
      <span><i class="iconfont icon-add1"></i></span> <span> 添加银行卡</span>
    </div>
    <div class="footer-btn" v-if="!isNoBtn">
      <button class="sub-btn full-bnt" >确认付款</button>
    </div>
  </div>
</template>

<script>
import {api} from '../../../public/api'
export default {
  name: 'bank-list',
  data: function() {
    return {
      bankList: [],
      banKMap: {
        "工商银行" : 'CMBC',
        "中国银行": 'BC',
        "中国交通银行": 'CIB',
        "中国建设银行": 'CCB',
        "中国邮政" : 'PSBC'
      },
      isNoBtn: false
    }
  },
  created () {
    this.getBankList()
    if(this.$route.query.noBtn){
      this.isNoBtn = true
    }
  },
  filters: {
    afterSelice (v) {
      return v.slice(-4)
    }
  },
  methods: {
    getBankList () {
      api.request('mobile/unionpay/get_doprotocol_list')
        .then(res => {
          if (res.code == 0) {
            let result = res.data
            for (let item of result) {
              if (this.banKMap[item.bank_name]){
                 item['class'] = this.banKMap[item.bank_name]
              } else {
                item['class'] = "CMBC"
              }
              item.active = false
            }
            this.bankList = result
          }
        })
    },
    getBankType(url,type) {
        let reg = new RegExp("(^|&)" + type + "=([^&]*)(&|$)");
        var r = url.split('?')[1].match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    },
    addBank () {
      this.$router.push({path: 'add-bank', query: this.$route.query})
    },
    selectBank (item){
      for(let bankItem of this.bankList) {
        bankItem.active = false
      }
      item.active = true
    }
  }
}
</script>
<style scoped>
  .bank-card{
    height: 100px;
    padding: 20px;
    margin-top: 15px;
    position: relative;
  }
  .CMBC{
    background-image: linear-gradient(125deg,#f68069 ,#e77035 );
  }
  /*中国银行*/
  .BC{
    background-image: linear-gradient(125deg,#f6c969 ,#e7a635 );
  }
  /* 交通 */
  .CIB {
    background-image: linear-gradient(125deg,#69ddf6 ,#35bbe7 );
  }
  /* 建行 */
  .CCB {
    background-image: linear-gradient(125deg,#69abf6, #3589e7 );
  }
  /* 邮政 */
  .PSBC {
    background-image: linear-gradient(125deg,#38e364,  #06b734 );
  }
  .bank-logo{
    width: 30px;
    height: 30px;
    background: #fff;
    border-radius: 50%;
    margin-right: 10px;
    overflow: hidden;
    position: relative;
  }
  .bank-logo>img{
    height: 38px;
    width: 133px;
    position: absolute;
    top: -4px;
    left: 0px;
  }
  .add-bank{
    margin-top: 20px;
    padding: 20px 0;
    border-bottom: 1px solid rgba(0,0,0,0.2);
  }
  .text-white{
    color: #fff;
  }
  .line-height{
    line-height: 28px;
  }
  .mt-30{
    margin-top: 30px;
  }
  .p-10-20{
    padding: 10px 20px;
  }
  .pb-90{
    padding-bottom:90px; 
  }
  .footer-btn {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
  }
  .full-bnt{
    width: 100%;
    margin: 0;
    border-radius: 0; 
  }
  .text-box{
    position: absolute;
    right: 40px;
    top: -1px;
    width: 130px;
    height: 130px;
    opacity: 0.9;
    overflow: hidden;
    border-radius: 50%;
  }
  .text{
    height:217px;
    position: absolute;
    left:-23px;
    top: -46px;
    opacity: 0.05;
  }
  .active {
    transform: scale(0.95)
  }
  .active>.model{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.4);
    z-index: 9;
  }
</style>

