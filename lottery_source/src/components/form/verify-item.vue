<template>
  <div>
    <div class="form-lists ">
      <div class="lab">{{item.lab}}：</div>
      <div class="value">
        <input class="input" type="text" v-model="value" @blur="checkValue"
        />
      </div>
      <div class="" v-if="(show || isfocus) && item.verifyFn(value)">
        <svg xmlns="http://www.w3.org/2000/svg" style="height:15px;fill:green" viewBox="0 0 512 512">
          <path d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z"
          />
        </svg>
      </div>
      <div v-if="(show || isfocus) && !item.verifyFn(value)">
        <svg xmlns="http://www.w3.org/2000/svg" style="height:15px;fill:red" viewBox="0 0 384 512">
          <path d="M323.1 441l53.9-53.9c9.4-9.4 9.4-24.5 0-33.9L279.8 256l97.2-97.2c9.4-9.4 9.4-24.5 0-33.9L323.1 71c-9.4-9.4-24.5-9.4-33.9 0L192 168.2 94.8 71c-9.4-9.4-24.5-9.4-33.9 0L7 124.9c-9.4 9.4-9.4 24.5 0 33.9l97.2 97.2L7 353.2c-9.4 9.4-9.4 24.5 0 33.9L60.9 441c9.4 9.4 24.5 9.4 33.9 0l97.2-97.2 97.2 97.2c9.3 9.3 24.5 9.3 33.9 0z"
          />
        </svg>
      </div>
    </div>
    <div class="form-lists ">
      <div class="lab">{{item.varifyLab}}：</div>
      <div class="value">
        <input class="input" type="text" v-model="item.verifyVal" />
      </div>
      <div class="">
        <button :disabled="btnOff" class="msg-btn" :class="{'disabled-btn':btnOff}" @click="getCode">{{btnText}}</button>
      </div>
    </div>
  </div>
</template>

<script>
  import { api } from '../../public/api'
  export default {
    name:"verify-item",
    props: ['item'],
    data: function () {
      return {
        btnText: '点击获取验证码',
        btnOff: true,
        timer: null,
        needTime: 60,
        isfocus: false
      }
    },
    computed: {
      show () {
        let state = (this.item.value ) ? true: false;
        return state
      },
      value: {
        get () {
          this.btnOff = !this.item.verifyFn(this.item.value);
          return this.item.value
        },
        set (v) {
          let trimV = v.trim()
          this.btnOff = !this.item.verifyFn(trimV);
          this.item.value = trimV;
        }
      }
    },
    methods: {
      checkValue () {
        this.isfocus = true;
      },
      // valueChange: function (value) {
      //   this.btnOff = !this.item.verifyFn(this.item.value);
      // },
      getCode: function () {
        if (this.timer) {
          return;
        }
        this.openTimer();
        var _vue = this;
        api.request('mobile/wechat/ajaxSend', {
            mobile: this.value
          })
          .then(res => {
            if (res.success) {} else {
              swal({
                button: '关闭',
                text: `${res.error}`,
                type: 'error'
              });
              _vue.btnText = '重新获取验证码';
              _vue.btnOff = false;
              _vue.closeTimer();
            }
          })
          .catch(function (err) {
            console.log(err);
            swal({
              button: '关闭',
              text: `服务器接异常，请稍后重试`,
            });
            _vue.btnText = '重新获取验证码';
            _vue.btnOff = false;
            _vue.closeTimer();
          })
      },
      openTimer: function () {
        if (this.timer) {
          this.closeTimer();
        }
        this.needTime = 60;
        this.btnText = this.needTime + 's后重新获取';
        var _vue = this;
        this.timer = setInterval(function () {
          _vue.needTime--;
          _vue.btnText = _vue.needTime + 's后重新获取';
          if (_vue.needTime < 0) {
            _vue.btnText = '重新获取验证码';
            _vue.btnOff = false;
            _vue.closeTimer();
          }
        }, 1000)
      },
      closeTimer() {
        clearInterval(this.timer);
        this.timer = null;
      }
    }
  }
</script>
