<template>
  <div class="d-flex align-items-center mr-15" :class="{small: size ==='small', disabled: disabled}" @click="handleClick">
    <div class="s-box" :class="{ckecked: selected}">√</div>
    <div class="s-text">{{lab}}</div>
  </div>
</template>

<script>
import swal from 'sweetalert'
export default {
  name: 'check-box',
  props: {
    lab: {type: String, default: ''},
    text: {type: String, default: ''},
    size: {type: String, default: ''},
    disabled: {type: Boolean, default: false},
    value: {type: Boolean, default: false}
  },
  data () {
    return {
      options: ''
    }
  },
  computed: {
    selected: {
      get () {
        return (this.value ? this.value : false)
      },
      set (v) {
        this.$emit('input', v)
      }
    }
  },
  methods: {
    // 处理点击事件
    handleClick () {
      if (this.disabled) {
        swal({
          button: '关闭',
          text: this.text
        })
        return
      }
      this.selected = !this.selected
    }
  },
  mounted () {
    // 拷贝一份 props 数据给当前组件
    this.options = this.value
  }
}
</script>

<style scoped>
.s-box{
  width: 15px;
  height: 15px;
  line-height: 15px;
  text-align: center;
  border: 1px solid rgba(0,0,0,0.2);
  color: #fff;
  background: #fff;
  margin-right: 5px;
}
.ckecked{
    background: #26A2FF !important;
}
.s-text{
  font-size: 14px;
}
.small >.s-box{
  width: 12px !important;
  height: 12px !important;
  line-height: 12px !important;
}
.small > .s-text{
  font-size: 10px !important;
}
.disabled{
  color: rgba(0,0,0,0.6);
}
</style>
