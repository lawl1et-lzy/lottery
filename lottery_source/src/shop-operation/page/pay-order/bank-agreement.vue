<template>
  <div class="h-100">
    <iframe :src="bankSrc" frameborder="0"></iframe>
  </div>
  <!-- <div class="h-100">
    <iframe src="http://yan.eeseetech.cn/www/shanghai-agreement.html" frameborder="0"></iframe>
  </div> -->
</template>

<script>
// const bankSrc = require('../../../../static/bank-agreement.html')
export default {
  name: 'bank-agreement',
  data: function() {
    return {
      bankSrc: process.env.NODE_ENV === 'development' ? '/static/bank-agreement.html' : '/resources/shopmanager/static/bank-agreement.html'
    }
  },
  methods: {}
}
</script>

<style scoped>
  .h-100{
    height: 100%;
  }
  iframe{
    height: 100%;
    width: 100%
  }
</style>