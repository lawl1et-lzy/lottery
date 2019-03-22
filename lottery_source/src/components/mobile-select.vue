<template>
  <div></div>
</template>
<script>
import MobileSelect from 'mobile-select';
import {SelectInit} from '../public/tools/select-init.1'
export default {
  name: 'mo-select',
  props: ['list', 'target','codeId', 'extraId', 'rules','open'],
  data: function () {
    return {
      selectObj: null,
      selected: null,
    }
  },
  computed: {
    
  },
  watch: {
    open: function(n, o) {
      if(n) {
        this.selectObj.show()
      }
    },
    list: function(n, o) {
      if (n[0].childs) {
        this.selectObj.updateWheels(n);
      } else {
        this.selectObj.updateWheel(0,n);
      }
      this.selectObj.locatePosition(0,0)
    },
    codeId: function (n, o) {
      if (n!==o) {
        this.initDataFn(n, this.extraId)
      }
    },
  },
  methods: {
    initDataFn: function (code, extraId) {
      let initData = new SelectInit(code, extraId);
      initData.startCount(this.list, this.rules);
      for (var i = 0; i < initData.areaIndex.length; i++) {
        this.selectObj.locatePosition(i, initData.areaIndex[i]);
      }
      let value = initData.value.join(' ');
      let id = (initData.data[initData.data.length-1]) ? initData.data[initData.data.length-1].id : ''
      this.$emit('selectInit',{id, value});
    }
  },
  mounted: function () {
    var _vue = this;
    this.selectObj = new MobileSelect({
      trigger: '#' + this.target,
      title: '请选择',
      wheels: [{
        data: this.list
      }],
      position: [0],
      callback: function (indexArr, data) {
        _vue.selected = data;
        _vue.isInit = false
        _vue.$emit('selectChange', _vue.selected);
      }
    });
    this.$emit('SELECT', this.selectObj)
  },
    destroyed: function() {
    let selectEles = document.querySelectorAll('.mobileSelect');
    let body = document.querySelector('body');
    for (let item of selectEles ) {
      body.removeChild(item);
    }
  },
}
</script>

<style scoped>

</style>
