<template>
  <div class="form-lists" @click="selectObj.show()">
    <!-- 验证表单用 -->
    <input type="hidden" v-validate="{required: true}" name="manager" v-model="options.value">
    <div class="lab">
      {{options.lab}}：
    </div>
    <div v-show="!isEmpty" class="value selec-box" :id="options.id" >
        {{options.value}}
    </div>
    <div v-if="isEmpty" class="value text-grey">
      没有选项
    </div>
    <div class="">
      <svg style="height:15px;fill:#000000a5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 512">
        <path d="M224.3 273l-136 136c-9.4 9.4-24.6 9.4-33.9 0l-22.6-22.6c-9.4-9.4-9.4-24.6 0-33.9l96.4-96.4-96.4-96.4c-9.4-9.4-9.4-24.6 0-33.9L54.3 103c9.4-9.4 24.6-9.4 33.9 0l136 136c9.5 9.4 9.5 24.6.1 34z"
        />
      </svg>
    </div>
    <mo-select
      :list="list"
      :codeId="options.codeId"
      :target="options.id"
      @selectObj="getSelectObj"
      @selectChange="selectChange"
      @selectInit="selectInit"/>
  </div>
</template>

<script>
/* eslint-disable */
import MoSelect from './components/mobile-select'
export default {
  name: 'list-select',
  props: {
    value: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data () {
    return {
      options: {}, // 深拷贝 props 数据
      selectObj: {}, // mobile select 组件 实例化对象
      isEmpty: false // 判断是否有值
    }
  },
  watch:{
    value: {
      handler(n, o){
        if(n instanceof Object){
          this.options = JSON.parse(JSON.stringify(n))
        }
      },
      immediate:true,
      deep: true
    }
  },
  components: {
    MoSelect
  },
  computed: {
    list () {
      if (!this.options.list.length) {
        this.isEmpty = true
        let templateArr = {id: '', value: ''}
        let tempArr = []
        switch (this.options.Wheels) {
          case 1:
            tempArr = [templateArr]
            break
          case 2:
            tempArr = [{...templateArr, childs: [templateArr]}]
            break
          case 3:
            tempArr = [{...templateArr, childs: [{...templateArr, childs: [templateArr]}]}]
            break
          case 4:
            tempArr = [{...templateArr, childs: [{...templateArr, childs: [{...templateArr, childs: [templateArr]}]}]}]
            break
        }
        return tempArr
      } else {
        this.isEmpty = false
        return this.options.list
      }
    }
  },
  methods: {
    getSelectObj (event) {
      this.selectObj = event
    },
    selectChange (data) {
      this.options.valueId = data[0].id
      this.options.value = data[0].value
      this.$emit('input', this.options)
    },
    selectInit (data) {
      this.options.value = data
      this.$emit('input', this.options)
    }
  }
}
</script>
<style scoped>
  .text-grey{
    color: rgba(0,0,0,0.5)
  }
</style>
