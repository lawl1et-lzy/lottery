<template>
<div>
  <div class="form-lists">
    <!-- 验证表单用 -->
    <input type="hidden" v-validate="{required: true}" name="agreeCheck" v-model="options.value">
    <div class="lab">{{options.lab}}：</div>
    <div v-for="(value, key) in options.children" :key="key">
      <check-box :lab="value.name" :text="value.text" :disabled="value.disabled" v-model="value.checked" @input="handleModel"/>
    </div>
  </div>
</div>
</template>

<script>
import checkBox from './components/check-box'
export default {
  name: 'check-list',
  components: {
    checkBox
  },
  props: {
    value: {
      type: Object,
      dafault: {}
    }
  },
  data () {
    return {
      options: {} // 深拷贝 props value 对象
    }
  },
  watch: {
    value: {
      handler (n, o) {
        if (n instanceof Object) {
          // 深拷贝一份 props 到当前组件
          this.options = JSON.parse(JSON.stringify(n))
          // 更新当前 data 的 children 对象
          this.handleChildren()
        }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    // 更新 options 中的 children
    handleChildren () {
      for (let type of Object.keys(this.options.children)) {
        if (this.options.value === type) {
          this.options.children[type].checked = true
        }
      }
    },
    // 处理
    handleModel (v) {
      let arr = []
      for (let type of Object.keys(this.options.children)) {
        if (this.options.children[type].checked) {
          arr.push(type)
        }
      }
      this.options.value = arr.join(',')
      this.$emit('input', this.options)
    }
  }
}
</script>

<style scoped>
</style>
