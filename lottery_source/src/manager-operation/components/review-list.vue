<template>
  <div class="pb-10">
    <div class="review-page">
      <div class="review-item" v-for="(item, i) in list" :key="i" @click="itemClicked(item)">
        <div class="review-item-content" >
          <div v-if="item.name">申请人&nbsp;:&nbsp;{{item.name}}</div>
          <div>联系方式&nbsp;:&nbsp;{{item.phone}}</div>
          <div>地址&nbsp;:&nbsp;<span v-if="item.city">{{item.city}}</span><span v-if="item.address">{{ item.address}}</span></div>
          <div v-if="type=='refuse'">拒绝理由&nbsp;:&nbsp;{{item.reason}}</div>
        </div>
        <div class="review-item-footer">
          <div>申请提交&nbsp;:&nbsp;{{item.create_date}}</div>
          <div v-if=" type =='done' && item.audit_time">审核通过&nbsp;:&nbsp;{{item.audit_time}}</div>
          <div v-if=" type =='refuse' && item.audit_time">审核拒绝&nbsp;:&nbsp;{{item.audit_time}}</div>
        </div>
      </div>
    </div>
    <div v-if="isLoading" class="custom-loading">
      <div class="loading-item"></div>
      <div class="loading-text">正在加载...</div>
    </div>
    <div v-if="!isLoading && isEmpty" class="review-empty">
      <div>
        <img src="../../assets/review-empty.png" alt="">
      </div>
      <div>列表为空</div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['list','type'],
  name: 'review-list',
  data: function() {	
    return {}
  },
  computed: {
    isEmpty() {
      return this.$store.getters.isEmpty
    },
    isLoading() {
      return this.$store.state.check.isLoading
    }
  },
  methods: {
    itemClicked(item) {
      this.$emit('selectedItem',item)
    }
  }
}
</script>

<style scoped>
   .review-page {
    margin-top: 15px;
    font-size: 14px;
    color: rgba(0, 0, 0, 0.7);
  }
  .review-item {
    padding: 10px;
    background: #fff;
    margin-bottom: 10px;
  }
  .review-item-content {
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    padding-bottom: 5px;
  }
  .review-item-content > div {
    padding: 5px 0;
  }
  .review-item-footer {
    padding-top: 5px;
    text-align: right;
    color: rgba(0, 0, 0, 0.5);
  }
  .review-item-footer > div {
    padding: 5px 0;
  }
  .review-empty{
    text-align: center;
    color: rgba(0,0,0,0.65);
    padding: 40px 0;
  }
  .pb-10{
    padding-bottom: 10px;
  }
</style>