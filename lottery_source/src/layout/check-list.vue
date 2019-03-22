<template>
<div>
  <div class="form-lists">
    <div  class="lab">{{item.lab}}：</div>
    <div  v-for="item in list" :key="item.index" >
      <check-box :lab="item.name" :text="item.text" :disabled="item.disabled" v-model="item.checked" @input="checkedLottery(item)"/>
    </div>
  </div>
</div>
</template>

<script>
import checkBox from '../components/check-box'
export default {
  name: 'check-list',
  components: {
    checkBox
  },
  props: ['item'],
  data: function () {
    return {
      map: {
        '2': {
          name: "电脑型",
          checked: false,
          disabled: true,
          text:'电脑型公益彩暂未开放',
          type: '2'
        },
        '1': {
          name: "即开型",
          checked: false,
          disabled: false,
          type: '1'
        }
      },
    }
  },
  computed: {
    lottery () {
      if (this.item.lottery.length === 1) {
        this.item.value = this.item.lottery[0]
      }
      return this.item.lottery
    },
    radio () {
      return this.item.radio
    },
    list () {
      let arr = []
      for (let type of this.item.lottery) {
        if(this.map[type]) {
          if (this.item.value.includes(type)) {
            this.map[type].checked = true
          }
          arr.push(this.map[type])
        }
      }
      return arr
    }
  },
  created () {

  },
  methods: {
    checkedLottery (item) {
      if (this.radio) {
        this.list.map(i => i.checked = false)
        item.checked = true
      }
      let value =[]
      for (let item of this.list) {
        if (item.checked) {
          value.push(item.type);
        }
      }
      this.item.value = value.join(',')
    }
  }
}
</script>

<style scoped>

</style>
