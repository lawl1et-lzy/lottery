<template>
  <div></div>
</template>
<script>
import MobileSelect from 'mobile-select'
export default {
  name: 'mo-select',
  props: ['list', 'codeId', 'target'],
  data () {
    return {
      selectObj: '',
      selected: ''
    }
  },
  watch: {
    list (n, o) {
      if (n) {
        this.selectObj.updateWheel(0, n)
      }
    },
    codeId (n, o) {
      if (n) {
        for (let i = 0; i < this.list.length; i++) {
          if (n === this.list[i].id) {
            this.selectObj.locatePosition(0, i)
            this.$emit('selectInit', this.list[i].value)
            return
          }
        }
      }
    }
  },
  methods: {
  },
  mounted () {
    let _vue = this
    this.selectObj = new MobileSelect({
      trigger: '#' + this.target,
      title: '请选择',
      wheels: [{
        data: [{id: '', value: ''}]
      }],
      position: [0],
      callback (indexArr, data) {
        _vue.selected = data
        _vue.$emit('selectChange', _vue.selected)
      }
    })
    this.$emit('selectObj', this.selectObj)
  }
}
</script>

<style scoped>

</style>
