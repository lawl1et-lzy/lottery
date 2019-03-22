<template>
  <div class="container no-scroll">
    <mt-navbar v-model="selected" class="bb rank-tab f-14" style="height: 8%">
      <div class="bg-img ab">
        <img src="../../assets/rank/rank-bg.jpg" alt="" :class="{'empty': isLoading}">
      </div>
      <mt-tab-item id="week" class="mx-50 week re"><span class="re">周销售榜</span></mt-tab-item>
      <mt-tab-item id="all" class="mx-50 all re"><span class="re">总销售榜</span></mt-tab-item>
    </mt-navbar>
    <div v-if="isLoading" class="custom-loading mt-20">
      <div class="loading-item"></div>
      <div class="loading-text">正在加载...</div>
    </div>
    <rank-list :list="list" :self="self" :isLoading="isLoading" v-else></rank-list>
  </div>
</template>
<script>
import rankList from '../components/rank-list';
import { api } from "../../public/api";
export default {
  name: "rank",
  components:{
    rankList
  },
  data: function() {
    return {
      active: "",
      list: [],
      self: {},
      isLoading: false
    };
  },
  created() {
    this.selected = "week";
  },
  computed: {
    selected: {
      get() {
        return this.active;
      },
      set(v) {
        if (this.active == v) {
          return;
        }
        if(this.isLoading) {
          return
        }
        this.active = v;
        this.list = [];
        this.self = {};
        this.getRankList(v);
      }
    }
  },
  methods: {
    getRankList(type){
      if(this.isLoading) {
        return
      }
      this.isLoading = true;
      api.request('mobile/wechat/api_salesRanking',{type:type})
      .then(res => {
         if (res.status.succeed == 1 && res.data) {
           if (Array.isArray(res.data.rank_list)) {
             this.list = res.data.rank_list;
           } else {
             this.list = [];
           }
           if(res.data.self_rank) {
             this.self = res.data.self_rank
           }else {
             this.self = {}
           }
         } else {
           this.list = [];
            swal({
              button: "关闭",
              text: "获取列表失败，" + res.status.error_desc
            });
         }
      })
      .catch(err => {
        console.log(err)
        swal({button:'关闭',text:'服务器错误，请稍后重试'})
      })
      .then(() => this.isLoading = false);
    }
  }
};
</script>

<style scoped>
  .rank-tab .bg-img img{
    width: 100%;
  }
  .rank-tab .bg-img{
    width: 100%;
  }
  .week, .all {
    color: #fff!important;
    background-color: transparent!important;
  }
  .mint-navbar .mint-tab-item.is-selected {
    border-bottom: none!important;
  }
  .mint-navbar .mint-tab-item.is-selected span {
    cursor: pointer;
  }
  .mint-navbar .mint-tab-item.is-selected span::after{
    content: '';
    position: absolute;
    left: 0;
    top: 24px;
    width: 100%;
    height: 3px;
    background-color: #fff;
    border-radius: 15px;
  }
  .empty {
    height: 55px;
  }
</style>
