<template>
  <div>
    <div v-for="item in list" :key="item.index" class="route-item d-flex justify-content-between align-items-center" @click="navTo(item)">
      <div>{{item.title}}</div>
      <div><i class="iconfont icon-right f-14"></i></div>
    </div>
  </div>
</template>

<script>
import {api} from '../../public/api';
export default {
  name: 'me',
  data: function() {
    return {
      list:[
        {
          title:'我的资料',
          route:'/managerinfo',
          outSide: false,
        },
        {
          title:'公益分商城',
          outSide: true,
        },
      ]
    }
  },
  methods: {
    navTo(item) {
      if(!item.outSide){
        this.$router.push({path: item.route})
      } else {
        api.navigateWithSid('mobile/wechat/credits_shop');
      }
    }
  }
}
</script>

<style scoped>
.route-item{
  padding: 15px 10px;
  border-bottom: 1px solid rgba(0,0,0,0.1);
  background: #fff;
}
</style>