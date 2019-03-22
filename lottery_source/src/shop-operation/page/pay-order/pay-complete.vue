<template>
  <div v-if="state === '0'" class="text-center fh">
    <div class="mt-40">
      <img src="../../../assets/pay-success.png" alt="">
    </div>
    <div>支付成功</div>
    <div>
      <button class="sub-btn mt-40" @click="complete">完成</button>
    </div>
  </div>
  <div v-else class="text-center fh">
    <div class="mt-40">
      <img src="../../../assets/pay-fail.png" alt="">
    </div>
    <div>支付失败</div>
    <div class="errinfo">{{resultMap[state]}}</div>
    <div>
      <button class="sub-btn mt-40" @click="rePay">重新支付</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'pay-compelte',
  data: function() {
    return {
      state: '',
      id: "",
      area_id: '',
      resultMap: {
        "1": '订单更新失败，请联系管理员查看',
        "2": '交易失败',
        "3": '数据校验失败'
      },
    }
  },
  created () {
    this.id = this.$route.query.id
    this.area_id = this.$route.query.area_id
    this.state = this.$route.query.state
  },
  methods: {
    complete () {
      this.$router.push({path: '/lottery-order'})
    },
    rePay () {
      this.$router.push({path: '/pay-order', query: {id: this.id, area_id: this.area_id}})
    }
  }
}
</script>

<style scoped>
  .mt-40{
    margin-top: 40px;
  }
  .errinfo{
    font-size: 12px;
    color: rgba(0,0,0,0.5);
    margin-top: 15px;
  }
</style>