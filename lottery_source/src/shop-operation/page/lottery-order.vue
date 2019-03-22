<template>
  <div class="container no-scroll">
    <mt-navbar v-model="selected" class="bb">
      <mt-tab-item id="unpayed">待支付</mt-tab-item>
      <mt-tab-item id="payed">待收货</mt-tab-item>
      <mt-tab-item id="finish" >已完成</mt-tab-item>
    </mt-navbar>
       <mt-tab-container class="container scroll pb-110" 
      v-model="selected" 
      :swipeable="false"
      v-infinite-scroll="loadMore"
      infinite-scroll-disabled="noMore"
      infinite-scroll-distance="10">
      <mt-tab-container-item id="unpayed">
         <order-list :type="'unpayed'" :list="unpayed" @cancel="cancel($event)" @confirm="confirm($event)"></order-list>
      </mt-tab-container-item>
      <mt-tab-container-item id="payed" >
         <order-list :type="'payed'" :list="payed" @confirm="confirm($event)"></order-list>
      </mt-tab-container-item>
      <mt-tab-container-item id="finish">
         <order-list :type="'finish'" :list="finish" ></order-list>
      </mt-tab-container-item>
    </mt-tab-container>
  </div>
</template>

<script>
import orderList from "../components/order-list";
import { api } from "../../public/api";
import { createNamespacedHelpers } from "vuex";
import { MessageBox } from 'mint-ui'
const {
  mapState,
  mapActions,
  mapMutations,
  mapGetters
} = createNamespacedHelpers("order");
export default {
  name: "lottery-order",
  components: {
    orderList
  },
  data: function() {
    return {};
  },
  created() {
    if (!this[this.selected].length) {
      this.updateData();
    }
  },
  computed: {
    ...mapState({
      unpayed: state => state.unpayed.list,
      payed: state => state.payed.list,
      finish: state => state.finish.list,
      isLoading: state => state.isLoading
    }),
    ...mapGetters(["isEmpty", "noMore"]),
    area_id() {
      return this.$store.state.session.areaId;
    },
    selected: {
      get() {
        return this.$store.state.order.currentPage;
      },
      set(v) {
        if (this.$store.state.order.currentPage == v || this.isLoading) {
          return;
        }
        this.changeActive(v);
        this.updateData();
      }
    }
  },
  methods: {
    ...mapActions(["updateData", "loadMore"]),

    ...mapMutations(["changeActive", "initdata"]),
    loadMore() {
      this.loadMore();
    },
    confirm(e) {
      if (e.delivery == 0) {
        this.$router.push({
          path: "/pay-order",
          query: { id: e.id, area_id: this.area_id }
        });
        this.initdata();
        // window.location.assign(e.pay_url)
      } else {
        MessageBox.confirm("", {
          title: "提示",
          message: "是否确认收货?",
          confirmButtonText: "确定",
          cancelButtonText: "取消"
        })
          .then(action => {
            if (action === "confirm") {
              api
                .request("mobile/wechat/get_order_update", { id: e.id })
                .then(res => {
                  if (res.status.succeed == 1) {
                    this.initdata();
                    this.selected = "finish";
                    //  this.changeActive(finish);
                  } else {
                    swal({
                      button: "关闭",
                      text: `订单确认失败,${res.status.error_desc}`
                    });
                  }
                })
                .catch(err => {
                  console.log(err);
                  swal({ button: "关闭", text: "服务器错误，请稍后重试" });
                });
            }
          })
          .catch(err => {});
      }
    },
    cancel(e) {
      let id = e.id;
      swal({
        buttons: ["取消", "确定"],
        text: "确认取消订单吗，取消后不可恢复！"
      }).then(e => {
        if (e) {
          this.cancelApi(id);
        }
      });
    },
    cancelApi(e) {
      api
        .request("mobile/wechat/delete_order", { id: e })
        .then(res => {
          if (res.code == 0) {
            swal({ button: "关闭", text: "删除成功" }).then(() => {
              this.initdata();
              this.updateData();
            });
          } else {
            swal({ button: "关闭", text: res.msg });
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>



