<template>
  <div>
     <slot ref=""></slot>
     <div @click="emitResult">
        <slot name="btn"></slot>
     </div>
  </div>
</template>

<script>
import swal from 'sweetalert';
export default {
  name: 'vue-form',
  props: [],
  data: function() {
    return {
      result: {},
    }
  },
  created() {
    this.$emit('FORM', this)
  },
  methods: {
    emitResult () {
      if (this.checkValue()) {
       this.$emit('submit', this.result)
      }
    },
    checkValue () {
      this.result = {}
      for (let child of this.$children) {
        let item = child.item || {}
        // 后台表单配置，只有show = true的时候，这一项才显示
        if(item.show){
          switch (item.type) {
            case 'address':
              if(!item.extraId){
                swal({
                  button: '关闭',
                  text: `${item.lab}选择错误`
                })
                return false
              }
              this.result[item.key] = {
                id: item.codeId,
              }
              break
            case 'select': 
              if (!item.noCheck && !item.value) {
                swal({
                  button: '关闭',
                  text: `${item.lab}选择错误`
                })
                return false
              }
              this.result[item.key] = {
                id: item.valueId,
                value: item.value
              }
              break
            case 'verify':
              if (item.verifyFn && (!item.verifyFn(item.value) || item.verifyVal.length != 6)) {
                swal({
                  button: '关闭',
                  text: `${item.lab}或者验证码填写错误`
                })
                return false
              }
              this.result[item.key] = {
                value: item.value,
                verifyVal: item.verifyVal
              }
              break
            case 'checkbox':
              if (item.lottery.length >1 && !item.value) {
                swal({
                  button: '关闭',
                  text: `请选择${item.lab}`
                })
                return false
              }
              this.result[item.key] = item.value
              break
            case 'signature':
              if(!item.signatureUrl){
                swal({
                  button: '关闭',
                  text: `您还未${item.lab}`
                })
                return false
              }
              break
            case 'agreeCheck':
              if(!item.value){
                swal({
                  button: '关闭',
                  text: `请阅读并同意《卷烟零售户公益彩代销协议》`
                })
                return false
              }
              break
            default:
              if (item.verifyFn && !item.verifyFn(item.value)) {
                swal({
                  button: '关闭',
                  text: `${item.lab}填写错误`
                })
                return false
              }
              // 签名不需要提交数据
              if(item.key !== 'signature'){
                this.result[item.key] = item.value
              }
              break
          }
        }
      }
      return true
    },
    setResult() {
      for (let child of this.$children) {
        let item = child.item || {}
        switch (item.type) {
          case 'select' : 
             this.result[item.key] = {
              id: item.valueId,
              value: item.value
            }
            break
          case 'verify':
            this.result[item.key] = {
              value: item.value,
              verifyVal: item.verifyVal
            }
            break
          default :
            this.result[item.key] = item.value
        }
      }
    }
  }
}
</script>

<style scoped>

</style>