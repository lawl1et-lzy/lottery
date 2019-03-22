<template>
  <div id="drop-container" class="container bg">
    <router-view/>
    <shopping-cart v-if="selected === 'lottery'"></shopping-cart>
    <mt-tabbar v-model="selected" class="bt i-grey-4 z-in-5">
      <mt-tab-item id="lottery">
        <div class="mb-5"><i class="iconfont icon-apply i-grey-4 f-25"></i></div>
         申领
      </mt-tab-item>
      <mt-tab-item id="rank">
        <div class="mb-5"><i class="iconfont icon-ranking-list i-grey-4 f-25"></i></div>
        排行榜
      </mt-tab-item>
      <mt-tab-item id="order">
        <div class="mb-5"><i class="iconfont icon-indent i-grey-4 f-25"></i></div>
        订单
      </mt-tab-item>
      <mt-tab-item id="device">
        <div class="mb-5"><i class="iconfont icon-equipment i-grey-4 f-25"></i></div>
        设备
      </mt-tab-item>
      <mt-tab-item id="me">
        <div class="mb-5"><i class="iconfont icon-me i-grey-4 f-25"></i></div>
        我的
      </mt-tab-item>
    </mt-tabbar>
  </div>
</template>
<script>
import shoppingCart from './components/shopping-cart.vue'
  export default {
    name: 'shop-operation',
    components: {
      shoppingCart
    },
    computed: {
      selected: {
        get: function () {
          return this.$route.name;
        },
        set: function (v) {
          this.$router.push({name:v});
        }
      }
    },
  }

</script>

<style scoped>
.bg{
  background: #f0f4f6;
}
.z-in-5 {
  z-index: 5;
}
</style>
