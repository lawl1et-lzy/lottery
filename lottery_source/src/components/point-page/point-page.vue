<template>
  <div class="container no-scroll bg">
    <div class="point-header">
      <div class="text-center point-all f-14">
        <div class="mb-5"><span class="point-name">总公益分</span></div>
        <div class="d-flex j-center align-items-center"><span class="f-23">{{pointData.total || 0}}</span></div>
      </div>
      <div class="d-flex j-around f-14 today-info text-center">
        <div>
          <div class="mb-5"><span class="point-name">今日获得</span></div>
          <div class="d-flex j-center align-items-center"><span v-if="pointData.dayTotal">+</span><span> {{pointData.dayTotal ||0}}</span></div>
        </div>
        <div class="border"></div>
        <div>
          <div class="mb-5"><span class="point-name">今日支出</span></div>
          <div class="d-flex j-center align-items-center"><span ><span v-if="pointData.expend">-</span> {{pointData.expend || 0}}</span></div>
        </div>
      </div>
    </div>
    <mt-navbar v-model="selected" class="bb mt-10">
      <mt-tab-item id="0" class=""><i class="iconfont icon-toobtain mr-8"></i>获取记录</mt-tab-item>
      <mt-tab-item id="3" class=""><i class="iconfont icon-exchange mr-8"></i>兑换记录</mt-tab-item>
    </mt-navbar>
    <div class="container scroll pb-222 bg-w">
      <point-list :list="list" :needLoad="needLoad" :isLoading="isLoading" :active="active" @loadMore="loadMore"></point-list>
    </div>
  </div>
</template>

<script>
import pointList from "./point-list";
import { api } from "../../public/api";
export default {
  name: "point-page",
  components: {
    pointList
  },
  data: function() {
    return {
      active: "",
      params: {
        pageIndex: 1,
      },
      needLoad: true,
      isLoading: false,
      list: [],
      pointData: {}
    };
  },
  created() {
    this.selected = "0";
    this.getPointData();
  },
  computed: {
    selected: {
      get() {
        return this.active;
      },
      set(v) {
        if (this.active === v || this.isLoading) {
          return;
        }
        this.active = v;
        this.params.pageIndex = 1;
        this.list = [];
        this.needLoad = true;
        this.getpointList(v);
      }
    }
  },
  methods: {
    loadMore() {
       this.params.pageIndex += 1;
      //  this.needLoad = false;
       this.getpointList(this.active);
    },

    getPointData() {
      api
        .request("mobile/wechat/getCreditsByManager")
        .then(res => {
          if (res.status.succeed == 1) {
            this.pointData = res.data;
          } else {
            swal({
              button: "关闭",
              text: "积分获取失败" + res.status.error_desc
            });
          }
        })
        .catch(err => {
          console.log(err);
          swal({ button: "关闭", text: "服务器错误，请稍后重试" });
        });
    },
    getpointList(type) {
      let data = { type: type };
      this.isLoading = true;
      data = Object.assign(data, this.params);
      api
        .request("mobile/wechat/get_credits_detail", data)
        .then(res => {
          if (res.status.succeed == 1) {
            if(res.data.list) {
              // res.data.length = 44;
              this.list = [...this.list,...res.data.list];
              this.needLoad = this.list.length >= res.data.length ? false : true;
            } else {
              this.list = [...this.list];
              this.needLoad = false;
            }
          } else {
            swal({
              button: "关闭",
              text: "积分列表获取失败" + res.status.error_desc
            });
          }
        })
        .catch(err => {
          console.log(err);
          swal({ button: "关闭", text: "服务器错误，请稍后重试" });
        })
        .then(() => {
          this.isLoading = false;
        });
    }
  }
};
</script>

<style scoped>
.point-header {
  color: #fff;
  height: 155px;
  padding: 0 15px;
  background: url(../../assets/point-bg.png) no-repeat center center;
  background-size: 100% 100%;
}
.point-all {
  padding-top: 20px;
  padding-bottom: 15px;
}
.point-name {
  padding: 1px 15px;
}
.today-info > div{
  width: 50%;
}
.today-info .border{
  width: 1px;
  height: 30px;
  background-color: #eeeeee;
  margin-top: 7px;
}
.bg {
  background: #f0f4f6;
}
.bg-w {
  background: #fff;
}
.pb-222 {
  padding-bottom: 222px;
}
</style>