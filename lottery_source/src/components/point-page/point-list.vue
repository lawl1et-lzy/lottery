<template>
  <diV>
    <div  v-if="list.length"
      v-infinite-scroll="isloadMore"
      infinite-scroll-disabled="loading"
      infinite-scroll-immediate-check="false"
      infinite-scroll-distance="10">
      <div v-for="item in list" :key="item.index" class="bg-white">
        <div v-if="item.type == 1" class="re">
          <div>
            <div class="list-item-title f-14"><i class="iconfont icon-toobtain f-15 i-ffb224"></i> 订单公益分</div>
            <div class="list-item d-flex justify-content-between align-items-center f-12">
              <div class="info">
                <div class="i-grey-6 d-flex align-items-center"><span>订单号：</span> <span>{{item.trade_no}}</span></div>
                <div class="i-grey-6 d-flex align-items-center"><span>时间：</span><span>{{item.update_date}}</span> </div>
              </div>
            </div>
          </div>
          <div class="i-grey-4 ab point-num"><span class="f-18 i-ffb224">{{item.credits}}</span></div>
        </div>
        <div v-if="item.type == 2" class="re">
          <div>
            <div class="list-item-title f-14"><i class="iconfont icon-toobtain f-15 i-ff6925"></i> 客户经理公益分</div>
            <div class="list-item d-flex justify-content-between align-items-center f-12">
              <div class="info">
                <div class="i-grey-6 d-flex align-items-center"><span>店主姓名：</span> <span>{{item.name}}</span> </div>
                <div class="i-grey-6 d-flex align-items-center"><span>店铺地址：</span><span>{{item.address}}</span> </div>
                <div class="i-grey-6 d-flex align-items-center"><span>时间：</span><span>{{item.update_date}}</span> </div>
              </div>
            </div>
          </div>
          <div class="i-grey-4 ab point-num"><span class="f-18 i-00d299">{{item.credits}}</span></div>
        </div>
        <div v-if="item.type == 3" class="re">
          <div>
            <div class="list-item-title f-14"><i class="iconfont icon-exchange f-15 i-00d299 mr-5"></i><span>订单号：</span> <span>{{item.trade_no}}</span></div>
            <div class="list-item d-flex justify-content-between align-items-center f-12">
              <div class="info">
                <div class="i-grey-6 d-flex align-items-center"><span>兑换：</span><span>{{item.product_title}} x{{item.num}}</span></div>
                <div class="i-grey-6 d-flex align-items-center"><span>时间：</span><span>{{item.update_date}}</span></div>
              </div>
            </div>
          </div>
          <div class="i-grey-4 ab point-num"><span class="f-18 i-red">-{{item.credits}}</span></div>
        </div>
        <div v-if="item.type >= 4" class="re">
          <div class="list-item-title f-14"><i class="iconfont icon-toobtain f-15 i-green"></i> {{item.type_name}}</div>
            <div class="list-item d-flex justify-content-between align-items-center f-12">
            <div class="info">
              <div class="i-grey-6 d-flex align-items-center"><span>姓名：</span> <span>{{item.name}}</span> </div>
              <div class="i-grey-6 d-flex align-items-center"><span>时间：</span><span>{{item.update_date}}</span> </div>
            </div>
          </div>
          <div class="i-grey-4 ab point-num"><span class="f-18 i-ffb224">{{item.credits}}</span></div>
        </div>
      </div>
      <div class="py-10" v-if="!isLoading && loading">
        <div class="f-12 text-center i-grey-6">
            —— 全部显示完毕 ——
        </div>
      </div>
    </div>
    <div v-if="isLoading" class="custom-loading mt-20">
      <div class="loading-item"></div>
      <div class="loading-text">正在加载...</div>
    </div>
    <div v-if="!isLoading && loading && !list.length">
      <div class="empty-box">
        <div v-if="active=='0'" class="f-14 text-center i-grey-4">
          <img src="../../assets/point-empty1.png" alt="暂无信息" width="119" height="103">
          <div>暂无信息</div>
        </div>
        <div v-if="active=='3'" class="f-14 text-center i-grey-4">
          <img src="../../assets/point-empty2.png" alt="暂无信息" width="119" height="111">
          <div>暂无信息</div>
        </div>
      </div>
    </div>
  </diV>
</template>

<script>
export default {
  name: "point-list",
  props: ["list", "needLoad", "isLoading","active"],
  data: function() {
    return {};
  },
  computed: {
    loading() {
      return !this.needLoad;
    }
  },
  methods: {
    isloadMore() {
      this.$emit("loadMore");
    }
  }
};
</script>

<style scoped>
.list-item {
  padding: 0px 4%;
}
.list-item-title {
  padding: 5px 4%;
  color: #575757;
}
.bg-white {
  padding: 10px 0;
  background: #fff;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}
.load {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.6);
}
.info{
  margin-left: 20px;
}
.info > div{
  margin-top: 3px;
}
.point-num {
  right: 13px;
  top: 50%;
  transform: translateY(-50%);
}
</style>