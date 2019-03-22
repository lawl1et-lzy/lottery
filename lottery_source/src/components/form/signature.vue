<template>
  <div class="form-lists" @click="sign">
    <div class="lab">
      签名：
    </div>
    <div v-if="item.signatureUrl" class="value">
      <img :src="item.signatureUrl" alt="" height="46">
    </div>
    <div v-else class="value text-darkblue">
      请点击此处签名
    </div>
    <!-- signaturePad -->
    <signature-pad 
      v-if="showSignature" 
      :signatureUrl="item.signatureUrl" 
      @callback="handleSignBack" 
      @closeSignMask="closeSignMask">
    </signature-pad>
  </div>
</template>

<script>
import SignaturePad from '../signaturePad'
import {Toast} from 'mint-ui'
export default {
  name: 'Signature',
  props: {
    // signatureUrl: { type: [String], default: '' },
    item: { type: [Object], default: {} }
  },
  data() {
    return {
      showSignature: false
    }
  },
  components: {
    SignaturePad
  },
  methods: {
    sign() {
      this.showSignature = true
    },
    // 签名返回值
    handleSignBack(imgURL) {
      if(imgURL){
        this.$emit('signCallback', imgURL)
        this.showSignature = false
      }
    },
    // 关闭签名遮罩
    closeSignMask() {
      this.showSignature = false
    }
  }
}
</script>

<style scoped>
.text-darkblue{
  color: #3047af;
}
</style>