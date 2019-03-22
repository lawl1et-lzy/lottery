<template>
  <div class="point-box">
    <point-page></point-page>
  </div>
</template>

<script>
import PointPage from '../../components/point-page/point-page';
export default {
  name: 'manager-point',
  components: {
    PointPage
  },
  data: function() {
    return {}
  },
  methods: {
    getOrder() {
      
    }
  }
}
</script>

<style scoped>
  .point-box{
    height: 100%;
    padding-bottom: 60px;
    box-sizing: border-box;
    overflow: hidden;
  }
</style>