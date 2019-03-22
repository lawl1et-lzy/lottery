<template>
  <div class="container bg p-10-20">
    <div class="title gray-6">{{bankName}}</div>
    <div class="input-box d-flex align-items-center j-between">
      <input type="text" v-model="verify_code" @input="inputChange">
      <div class="gray-6">{{time}}s</div>
    </div>
    <div class="info text-right">
      <span class="gray-4">没有收到验证码？</span>
      <span class="blue-4" @click="reVerify">重新获取</span>
    </div>
    <div>
      <button :disabled="btnDisabled || isSubmitimg" class="sub-btn full-btn" @click="addBank">确认添加</button>
    </div>
  </div>
</template>

<script>
import {api} from '../../../public/api'
export default {
  name: 'varify-page',
  data: function() {
    return {
      verify_code: '',
      btnDisabled: true,
      isSubmitimg: false,
      time: 20,
      timer: null
    }
  },
  computed: {
    bankInfo () {
      return this.$store.state.bank.info
    },
    bankName () {
      return this.$store.state.bank.name
    }
  },
  created () {
    if (!this.bankInfo.id){
      this.$router.push({path:'/add-bank', query:this.$route.query})
    } 
    this.openTimer()
  },
  methods: {
    openTimer () {
      this.timer = setInterval(() => {
        this.time --
        if (this.time <= 0) {
          this.coloseTimer()
        }
      },1000)
    },
    coloseTimer () {
      if (this.timer) {
        clearInterval(this.timer)
        this.timer = null
      }
    },
    reVerify () {
      if (this.timer) {
        return
      }
      this.time = 20
      api.request('mobile/unionpay/send_code',this.bankInfo)
      .then(res => {
        if (res.code == 0) {
          this.openTimer()
        }
      })
    },
    inputChange () {
      this.btnDisabled = (this.verify_code.length === 6) ? false : true
    },
    addBank () {
      this.isSubmitimg = true
      let reqData = {
        verify_code: this.verify_code,
        ...this.bankInfo
      }
      api.request('mobile/unionpay/do_protocol',reqData)
      .then(res => {
        if (res.code == 0) {
          this.$store.commit('clearBnakInfo')
          this.$router.push({path:'/bank-list', query:this.$route.query})
        } else {
           this.isSubmitimg = false
        }
      })
      .catch(err => {
        console.log(err)
      })
    }
  }
}
</script>

<style scoped>
  .bg{
    background: #f0f4f6
  }
  .title{
    padding: 15px 0;
    color: rgba(0,0,0,0.6);
  }
  .gray-6{
    color: rgba(0,0,0,0.6);
  }
  .gray-4{
    color: rgba(0,0,0,0.4);
  }
  .blue-4{
    color: #729DF7;
  }
  .input-box{
    height: 50px;
    padding: 0 15px;
    background: #fff;
  }
  .input-box > input {
    width: 100%;
    border: 0;
    outline: none;
  }
  .info{
    font-size: 12px;
    margin: 15px;
  }
  .text-right{
    text-align: right;
  }
  .p-10-20{
    padding: 10px 20px;
  }
  .full-btn{
    width: 100% !important;
    margin: 0 !important;
  }
</style>