<template>
  <div class="check-box">
    <!-- 验证表单用 -->
    <input type="hidden" v-validate="{required: true, checkbox: true}" name="agreeCheck" v-model="options.value">
    <check-box :lab="options.lab" v-model="options.value" :size="options.size" @input="handleClick"/>
    <span style="color: #2A6853; margin-left: -15px;" @click="openAgreement">《卷烟零售户公益彩代销协议》</span>
  </div>
</template>

<script>
import checkBox from './components/check-box'
export default {
  name: 'agree-check',
  props: {
    value: {type: Object}
  },
  data () {
    return {
      options: {}
    }
  },
  components: {
    checkBox
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
  methods: {
    // 打开协议
    openAgreement () {
      this.$router.push({
        path: '/cooperateAgreement',
        query: {
          id: this.provinceId
        }
      })
    },
    handleClick () {
      this.$emit('input', this.options)
    }
  }

}
</script>

<style scoped>

</style>
