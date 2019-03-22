<template>
  <div>
    <div class="d-flex align-items-center j-between list" v-for="item in questionList" :key="item.id" @click=answer(item.id)>
      <div>{{item.name}}</div>
      <div><i class="iconfont icon-right"></i> </div>
    </div>
  </div>
</template>

<script>
export default {
  name:'question',
  data: function () {
    return {
      questionList:[
        {
          id:'0',
          name:'客户经理'
        },
        {
          id:'1',
          name:'新零售店主'
        },
        {
          id:'2',
          name:'彩票代销证'
        },
        {
          id:'3',
          name:'彩票问题'
        },
        {
          id:'4',
          name:'扫码兑奖'
        },
        {
          id:'5',
          name:'其他问题'
        },
      ]
    }
  },
  created(){},
  methods:{
    answer(id) {
      this.$router.push({path:'/answer',query:{id}})
    }
  }
}
</script>
<style scoped>
  .list{
    padding: 15px;
    border-bottom: 1px solid rgba(0,0,0,0.1);
    color: rgba(0,0,0,0.6);
    font-size: 14px;
    font-weight: 600;
  }
</style>

