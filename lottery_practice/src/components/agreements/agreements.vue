<template>
<div class="container" style="padding:20px;overflow: auto; background:#fff">
    <guangxi v-if="id === '7'"></guangxi>
     <hunan v-if="id === '14'"></hunan>
     <shanghai v-if="id === '25'" />
    <div class="py-40" slot="btn">
      <button class="sub-btn" @click="closeAgreement">阅读完毕</button>
    </div>
  </div>
</template>

<script>
import guangxi from './guangxi'
import hunan from './hunan'
import shanghai from './shanghai'
export default {
  name: 'agreements',
  data () {
    return {
      id: ''
    }
  },
  components: {
    guangxi,
    hunan,
    shanghai
  },
  methods: {
    // 阅读完毕
    closeAgreement () {
      this.$router.go(-1)
    },
    // 获取链接参数
    fetchRouteQuery () {
      const route = this.$route
      this.id = route.query.id
    }
  },
  mounted () {
    window.addEventListener('popstate', (e) => {
      e.preventDefault()
    })
  },
  activated () {
    this.fetchRouteQuery()
  }
}
</script>
