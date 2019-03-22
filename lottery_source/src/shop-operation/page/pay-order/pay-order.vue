<template>
  <div class="fh bg scroll">
    <div class="info-box">
      <div class="text-center f-15">支付剩余时间
        <span>{{time | timeFormat}}</span>
      </div>
      <div class="text-center f-13 mt-15">实际支付</div>
      <div class="text-center f-25 mt-5">￥{{relmoney}}</div>
      <div class="b-y mt-15">
        <div class="d-flex j-between">
           <div class="s-2">订单金额</div>
          <div class="">￥{{totalMoney}}</div>
        </div>
        <div class="d-flex j-between">
          <div class="s-2">佣金抵扣</div>
          <div class="text-red">-￥{{backMoney}}</div>
        </div>
      </div>
      <div class="d-flex f-wrap f-13 mt-15 px-20">
        <div class="text-center f-item mt-5" v-for="item in detail" :key="item.index">{{item.title}}*{{item.ticket_num}}</div>
      </div>
    </div>
    <div class="select-box mt-15">
      <div class="f-14 mb-15">支付方式</div>
      <div v-if="bankPayUrl" class="d-flex j-between a-center h-80 b-b" :class="{'b-b':wechatPayUrl}">
        <div class="d-flex a-center">
          <div class="icon-box mr-15">
            <img width="35" height="35" src="../../../assets/bank.jpg" alt="">
          </div>
          <div>
            <div class="d-flex align-items-center">
              <div>
                银联卡支付
              </div>
              <div>
                <div class="f-12 i-red  text-style">
                  ★ 推荐使用
                </div>
              </div>
            </div>
            <div class="f-13 mt-5">银联在线支付，安全支付的保障</div>
          </div>
        </div>
        <div class="radio mr-15" :class="{active: !isWechat}" @click="select('b')">
          <div></div>
        </div>
      </div>
      <div class="d-flex j-between a-center h-80">
        <div class="d-flex a-center">
          <div class="icon-box mr-15">
            <img width="35" height="35" src="../../../assets/winxin.jpg" alt="">
          </div>
          <div>
            <div>微信支付</div>
            <div class="f-13 mt-5">使用微信客户端支付</div>
          </div>
        </div>
        <div class="radio mr-15" :class="{active: isWechat}" @click="select('w')">
          <div></div>
        </div>
      </div>
    </div>
    <div class="btn-box">
      <button :disabled="isSubmiting" class="sub-btn" @click="goPay">确认支付</button>
    </div>
  </div>
</template>

<script>
  import {
    api
  } from '../../../public/api'
  export default {
    name: 'pay-order',
    data: function () {
      return {
        id: '',
        area_id: '',
        relmoney: '0',
        backMoney: '0',
        totalMoney: '0',
        isWechat: false,
        wechatPayUrl: '',
        bankPayUrl: '',
        detail: [],
        isSubmiting: false,
        bankBindState: '0',
        time: 1800,
        timer: null
      }
    },
    created() {
      this.id = this.$route.query.id
      this.area_id = this.$route.query.area_id
      this.sid = this.$store.state.session.sid || localStorage.getItem('sid')
      this.coloseTimer()
      this.openTimer()
      if (this.id && this.area_id) {
        this.getorderInfo()
      }
    },
    methods: {
      openTimer() {
        this.timer = setInterval(() => {
          this.time--
            if (this.time <= 0) {
              this.isSubmiting = true
              this.coloseTimer()
            }
        }, 1000)
      },
      coloseTimer() {
        if (this.timer) {
          clearInterval(this.timer)
          this.timer = null
        }
      },
      getorderInfo() {
        api.request('mobile/MultiPay/getPayInterface', {
            id: this.id,
            area_id: this.area_id
          })
          .then(res => {
            if (res.status.error_code == 202) {
              alert(res.status.error_desc)
              this.$router.push({
                path: '/lottery-order'
              })
            }
            this.relmoney = res.data.relmoney;
            this.totalMoney = res.data.total_money
            this.backMoney = Number(res.data.total_money) - Number(this.relmoney)
            this.backMoney = this.backMoney.toFixed(2)
            this.detail = res.data.detail
            this.wechatPayUrl = res.data.wx_pay_url
            this.bankPayUrl = res.data.union_pay_url
          })
          .catch(err => {
            console.log(err)
          })
      },
      select(type) {
        if (type === 'w') {
          this.isWechat = true;
        } else {
          this.isWechat = false;
        }
      },
      goPay() {
        if (this.isWechat) {
          window.location.assign(this.wechatPayUrl)
        } else {
          window.location.assign(`${this.bankPayUrl}&sid=${this.sid}`)
          // this.$router.push({path: '/bank-list', query: {id: this.id, area_id: this.area_id}})
        }
      }
    },
    filters: {
      timeFormat(val) {
        let h = parseInt(val / 60)
        if (h < 10) {
          h = '0' + h
        }
        let m = val % 60
        if (m < 10) {
          m = '0' + m
        }
        return `${h}:${m}`
      }
    }
  }

</script>

<style scoped>
  .bg {
    background: #f0f4f6
  }

  .info-box {
    background: #fff;
    padding: 15px 15%;
  }
  .text-style{
    margin-left: 10px;
    border: 1px solid red;
    padding: 2px 8px;
  }
  .select-box {
    background: #fff;
    padding: 15px 10px;
  }

  .btn-box {
    margin-top: 80px;
    margin-bottom: 40px;
  }

  .f-13,
  .f-15 {
    color: rgba(0, 0, 0, 0.5)
  }

  .f-15 {
    font-size: 15px;
  }

  .f-13 {
    font-size: 13px;
  }

  .f-25 {
    font-size: 25px;
    font-weight: 550;
    color: rgba(0, 0, 0, 0.75);
  }

  .f-14 {
    font-size: 14px;
  }

  .text-center {
    text-align: center;
  }

  .text-red {
    color: red;
  }

  .s-2 {
    letter-spacing: 2px;
  }

  .mt-5 {
    margin-top: 5px;
  }

  .mt-15 {
    margin-top: 15px;
  }

  .mr-15 {
    margin-right: 15px;
  }

  .mb-15 {
    margin-bottom: 15px;
  }

  .px-20 {
    padding: 0 20px;
  }

  .h-80 {
    height: 80px;
    ;
  }

  .b-y {
    border-top: 1px solid #C2DFFF;
    border-bottom: 1px solid #C2DFFF;
    padding: 10px;
  }

  .b-b {
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  }

  .d-flex {
    display: flex;
  }

  .f-wrap {
    flex-wrap: wrap
  }

  .a-center {
    align-items: center;
  }

  .j-between {
    justify-content: space-between;
  }

  .j-around {
    justify-content: space-around;
  }

  .f-item {
    width: 50%;
  }

  .icon-box {
    width: 35px;
    height: 35px;
  }

  .radio {
    width: 17px;
    height: 17px;
    border: 1px solid rgba(0, 0, 0, 0.5);
    border-radius: 50%
  }

  .active {
    border: 1px solid #006D55 !important;
  }

  .active>div {
    position: relative;
    top: 4px;
    left: 4px;
    width: 9px;
    height: 9px;
    border-radius: 50%;
    background: #006D55;
  }

</style>
