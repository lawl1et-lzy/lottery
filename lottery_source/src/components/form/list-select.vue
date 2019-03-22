<template>
  <div class="form-lists" @click="selectObj.show()">
    <div class="lab">
      {{item.lab}}：
    </div>
    <div v-show="!isEmpty" class="value selec-box" :id="item.id" >
        {{item.value}}
      <!-- <p>{{item.value}}</p> -->
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
      :list="list" :target="item.id"
      :codeId="item.codeId"
      :extraId="item.extraId"
      :rules="item.rules" 
      @SELECT="getSelectObj"
      @selectChange="selectChange($event)" 
      @selectInit="selectInit($event)"/>
  </div>
</template>

<script>
  import MoSelect from '../mobile-select'
  export default {
    name:'list-select',
    props: ['item'],
    data: function () {
      return {
        selectObj:{},
        isEmpty: false
      }
    },
    created(){
      // console.log(this.item);
    },
    components: {
      MoSelect,
    },
    computed: {
      list () {
        this.item.value = ''
        this.item.valueId = ''
        if (this.$el) {
          this.$el.querySelector('.selec-box').innerHTML = ''
        }
        if(!this.item.list.length) {
          this.isEmpty = true
          let templateArr = {id: '', value: ''}
          let tempArr = [];
          switch (this.item.Wheels) {
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
          return this.item.list.slice()
        }
      }
    },
    watch: {

    },
    methods: {
      getSelectObj (e) {
        this.selectObj = e
      },
      selectChange (e) {
        let valueArr = []
        this.item.valueId = e[e.length-1].id;
        for (let item of e) {
          valueArr.push(item.value)
        }
        this.item.value = valueArr.join(' ')
        this.$emit('selected', e)
      },
      selectInit(e) {
        this.item.value = e.value;
        this.item.valueId = e.id;
        this.$el.querySelector('.selec-box').innerHTML = `${this.item.value}`
      }
    },
  }
</script>
<style scoped>
  .text-grey{
    color: rgba(0,0,0,0.5)
  }
</style>

