<template>
  <div style="height: 92%">
    <div class="re d-flex flex-column fh">
      <div class="self-rank d-flex f-14">
        <div class="avatar-img self-center">
          <img :src="self.avatar_url" alt="avatar">
        </div>
        <div class="ml-10 self-center">
          <div class="mb-5">{{self.name}}</div>
          <div class="d-flex">
            <div class="pr-10">
              <i class="iconfont icon-sales f-14"></i>
              <span>销量：<span class="f-13 col-74">{{self.total || 0}}</span></span>
            </div>
            <div class="pl-10 bor-l">
              <i class="iconfont icon-ranking f-14"></i>
              <span>名次：<span class="f-13">{{self.rank || '未上榜'}}</span></span>
            </div>
          </div>
        </div>
      </div>
      <div class="rank-list scroll box" v-if="list.length">
        <div class='rank-list-item d-flex justify-content-between align-items-center' v-for="(item, index) in list" :key="index" :class="{'self-bg': index==self.rank-1}">
        <div class='d-flex justify-content-end align-items-center'>
          <div class="avatar-img d-flex">
            <span class="ranking self-center">{{ index==self.rank-1? '我' : index+1}}</span>
            <div class="img re"><img class='item-img img-thumbnail re' :src="item.avatar_url"></div>
          </div>
          <div class="item-content f-14">
            <div class="item-title">{{item.name}}</div>
          </div>
        </div>
        <div class="item-info f-14 col-74">{{item.total}}</div>
      </div>
      </div>
      <div v-if="!list.length && !isLoading" class="re">
        <div class="empty-box">
          <img src="../../assets/empty-rank.png" alt="">
          <div class="f-14 text-center i-grey-6">暂无排行榜信息</div>
        </div>
      </div>
    </div>
    <div class="custom-loading mt-20 loading" v-if="isLoading">
      <div class="loading-item"></div>
      <div class="loading-text">正在加载...</div>
    </div>
  </div>

</template>

<script>
export default {
  name: "rank-list",
  props: ["list","self","isLoading"],
  data: function() {
    return {};
  },
  methods: {}
};
</script>

<style scoped>
.col-74 {
  color: #747474;
}
.bor-l {
  border-left: 2px solid #e3f0f0;
}
.self-rank {
  height: 9%;
  padding: 20px 15px;
  background-color: #fff;
  margin: 0 14px;
  color: #555555;
  border-radius: 5px;
  box-shadow: 0px 0px 5px 2px rgba(22, 166, 134, 0.1);
}
.self-rank .avatar-img{
  width: 50px;
  height: 50px;
}
.self-rank .avatar-img img{
  width: 100%;
  border-radius: 50%;
}
.self-rank i{
  color: #16a686;
}
.rank-list {
  flex-grow: 1;
  margin-top: 15px;
  color: #555555;
  height: 91%;
  padding-bottom: 70px;
}
.rank-list .ranking {
  display: inline-block;
  width: 20px;
  text-align: center;
}
.rank-list .rank-list-item {
  margin: 0 14px;
  padding: 15px;
  background: #fff;
  border-bottom: 1px solid #f0f0f0;
}
.rank-list .rank-list-item:nth-child(1) {
  border-radius: 5px;
}

.rank-list-item .item-img {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  padding: 0 10px;
}
.rank-list-item .img::before {
  content: "";
  position: absolute;
  top: -5px;
  left: 9px;
  z-index: 1;
  width: 33px;
  height: 25px;
}
.rank-list-item:nth-child(1) .avatar-img{
  color: #FFB203;
}
.rank-list-item:nth-child(2) .avatar-img {
  color: #B5B5B5;
}
.rank-list-item:nth-child(3) .avatar-img {
  color: #D16213;
}
.rank-list-item:nth-child(-n+3) .avatar-img {
  font-weight: 700;
  font-style: italic;
}
.rank-list-item:nth-child(1) .img::before {
  background: url(../../assets/rank/crown-1.png) no-repeat;
  background-size: 100%;
}
.rank-list-item:nth-child(2) .img::before {
  background: url(../../assets/rank/crown-2.png) no-repeat;
  background-size: 100%;
}
.rank-list-item:nth-child(3) .img::before {
  background: url(../../assets/rank/crown-3.png) no-repeat;
  background-size: 100%;
}

.rank-list-item .item-content {
  color: #555555;
}
.self-bg {
  background-color: #eafffa!important;
}
.self-bg .ranking{
  font-style: normal!important;
}
</style>