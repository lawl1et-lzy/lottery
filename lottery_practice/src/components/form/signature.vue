<template>
  <div class="form-lists" @click="sign">
    <!-- 验证表单用 -->
    <input type="hidden" v-validate="{required: true}" name="signature" v-model="options.signatureUrl">
    <div class="lab">
      签名：
    </div>
    <div v-if="options.signatureUrl" class="value">
      <img :src="options.signatureUrl" alt="" height="46">
    </div>
    <div v-else class="value text-darkblue">
      请点击此处签名
    </div>
    <!-- signaturePad -->
    <signature-pad
      v-if="showSignature"
      :signatureUrl="options.signatureUrl"
      @callback="handleSignBack"
      @closeSignMask="closeSignMask">
    </signature-pad>
  </div>
</template>

<script>
import SignaturePad from './components/signaturePad'
export default {
  name: 'Signature',
  props: {
    value: {type: Object}
  },
  data () {
    return {
      showSignature: false,
      options: {}
    }
  },
  watch: {
    value: {
      handler (n, o) {
        this.options = JSON.parse(JSON.stringify(n))
      },
      immediate: true,
      deep: true
    }
  },
  components: {
    SignaturePad
  },
  methods: {
    // 签名返回值
    handleSignBack (imgURL) {
      if (imgURL) {
        this.options.signatureUrl = imgURL
        this.$emit('input', this.options)
        this.showSignature = false
      }
    },
    // 点击显示
    sign () {
      this.showSignature = true
    },
    // 关闭签名遮罩
    closeSignMask () {
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
