<template>
  <div id="shoppingCart" class="shopping-cart">
    <div class="cart-btn d-flex" @click="isToggle">
      <div :class="[{empty: !cartList.length}, 'shopping-cart-img']">
        <div class="img" :class="{'shopping-cart-scale':!isOpen}">
          <img src="../../assets/lottery/shopping-cart.png" alt="shopping cart" v-show="!cartList.length">
          <div v-show="cartList.length">
            <img src="../../assets/lottery/shopping-cart1.png" alt="shopping cart" v-show="!isOpen">
            <img src="../../assets/lottery/shopping-cart2.png" alt="shopping cart" v-show="isOpen">
          </div>
        </div>
        <div class="dot" v-show="cartList.length">{{totalNum}}</div>
      </div>
      <div class="total-price f-14" v-show="cartList.length">￥{{money}}</div>
    </div>
    <transition v-on:before-enter='beforeEnter' v-on:enter='enter' v-on:before-leave="beforeLeave" v-on:after-enter="afterEnter" v-on:after-leave="afterLeave">
      <div class='cart-info' @click.self="isToggle" v-show="isShow">
        <div class="shopping-list" :style="{height:height+'px'}">
          <div class="empty-cart d-flex justify-content-end">
            <div class="empty-btn f-14" @click="empytCart">
              <i class="iconfont icon-empty"></i>
              <span>清空购物车</span>
            </div>
          </div>
          <div class="order-info scroll f-14">
            <div class="d-flex cart-list j-between" v-for="item in cartList" :key="item.id">
              <div class="shoping-name"><div>{{item.title}}</div></div>
              <div class="shopping-btn">
                <span class="shopping-name">￥{{item.price}}</span>
                <i class="iconfont icon-reduction" @click="subtract(item)"></i>
                <span class="total">{{item.num}}</span>
                <i class="iconfont icon-add2" @click="add(item)"></i>
              </div>
            </div>
          </div>
          <div class="pay f-14">
            <div class="pay-img d-flex" @click="isToggle">
              <img src="../../assets/lottery/shopping-cart4.png" alt="shopping cart">
              <span>￥{{money}}</span>
            </div>
            <div class="go-pay ab" @click="showOrder">去下单</div>
            <div class="dot dot-copy">{{totalNum}}</div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { MessageBox } from "mint-ui";
import { mapState } from "vuex";
import { mapGetters } from "vuex";
import { api } from "../../public/api";
import swal from "sweetalert";
import { mapMutations } from "vuex";
export default {
  name: "shopping-cart",
  data() {
    return {
      isShow: false,
      flag: true
    };
  },
  created() {
    // this.$store.commit('count')
  },
  mounted() {
    document.getElementsByClassName(
      "order-info"
    )[0].style.maxHeight = `${document.body.clientHeight * 0.7 - 79}px`;
  },
  computed: {
    height() {
      let currentHight = 79 + this.cartList.length * 67;
      let maxHeight = document.body.clientHeight * 0.7;
      if (currentHight > maxHeight) {
        return maxHeight;
      } else {
        return currentHight;
      }
    },
    cartList() {
      return this.$store.state.newLottery.orderList.filter(el => el.num !== 0);
    },
    ...mapState({
      isOpen: state => state.newLottery.isOpen,
      total: state => state.newLottery.total
    }),
    ...mapGetters(["money", "totalNum"])
  },
  methods: {
    ...mapMutations("order", ["initdata"]),
    isToggle() {
      if (this.flag && this.cartList.length) {
        this.flag = false;
        this.isShow = !this.isShow;
      }
    },
    beforeEnter(el) {
      el.firstElementChild.style.height = "0px";
      el.style.opacity = "0";
    },
    enter(el, done) {
      setTimeout(() => {
        el.firstElementChild.style.height = `${this.height}px`;
        el.style.opacity = "1";
        done();
      }, 100);
    },
    afterEnter: function(el) {
      setTimeout(() => {
        this.flag = true;
      }, 300);
    },
    beforeLeave: function(el, done) {
      setTimeout(() => {
        el.firstElementChild.style.height = "0px";
        el.style.opacity = "0";
      }, 100);
    },
    afterLeave: function(el) {
      setTimeout(() => {
        this.flag = true;
      }, 300);
    },
    subtract(item, index) {
      this.$store.dispatch("minus", item);
      if (!this.cartList.length) {
        this.isShow = false;
      }
    },
    add(item) {
      this.$store.dispatch("add", item);
    },
    empytCart() {
      MessageBox.confirm("", {
        title: "提示",
        message: "确定清空购物车?",
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(action => {
          if (action === "confirm") {
            this.$store.commit("resetOrderList");
            this.isShow = false;
          }
        })
        .catch(err => {});
    },
    showOrder() {
      if (!this.total.some(el => Number(el) === this.money)) {
        MessageBox.alert(`请重新选择商品,使订单刚好${this.total.join("或")}元`);
        return;
      }
      let buyArr = [];
      this.cartList.forEach(el => {
        buyArr.push({
          id: el.id,
          num: el.num,
          name: el.title
        });
      });
      MessageBox.confirm("", {
        title: "提示",
        message: "确定支付此订单?",
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(action => {
          if (action === "confirm") {
            this.initdata();
            this.submitOrder(buyArr);
          }
        })
        .catch(err => {});
    },
    submitOrder(data) {
      data = JSON.stringify(data);
      this.$store.dispatch("initLotteryData");
      api
        .request("mobile/wechat/apply_welfare_ticket", { data: data })
        .then(res => {
          if (res.status.succeed == 1) {
            if (res.data.pay_status != 0) {
              this.$router.push({
                path: "pay-order",
                query: { id: res.data.order_id, area_id: res.data.area_id }
              });
              // window.location.assign(res.data.pay_url)
            } else {
              this.$router.push({ name: "order" });
            }
          } else {
            MessageBox.alert(`订单信息提交失败,${res.status.error_desc}`);
          }
        })
        .catch(err => {
          console.log(err);
          MessageBox.alert("服务器错误，请稍后重试");
        });
    }
  }
};
</script>

<style scoped>
.shopping-cart {
  position: fixed;
  bottom: 70px;
  left: 13px;
  z-index: 10;
}
.cart-btn .total-price {
  position: absolute;
  line-height: 35px;
  color: #fff;
  background-color: #545454;
  border-radius: 0 28px 28px 0;
  top: 50%;
  left: 65px;
  min-width: 67px;
  text-align: center;
  transform: translateY(-50%);
}
.cart-btn .shopping-cart-img {
  position: relative;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #f5f5f5;
  border: 5px solid #fff;
  z-index: 1;
}
.shopping-cart-img .img {
  width: 100%;
  position: absolute;
  left: -4px;
  bottom: -4px;
}
.shopping-cart-img .img img {
  width: 100%;
}
.shopping-cart-scale {
  animation: cartScale 0.4s;
}
@keyframes cartScale {
  0% {
    transform: scale(1);
  }
  25% {
    transform: scale(1.1);
  }
  75% {
    transform: scale(0.9);
  }
  100% {
    transform: scale(1);
  }
}
.cart-info {
  width: 100%;
  position: fixed;
  left: 0;
  bottom: 0;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  transition: all 0.3s linear;
  z-index: 999;
}
.shopping-list {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  background-color: #fff;
  transition: all 0.3s linear;
  z-index: 999;
}
.shopping-list .pay {
  bottom: 0;
  left: 0;
  height: 50px;
}
i {
  color: #16a686;
}
.pay {
  position: fixed;
  width: 100%;
}
.pay-img {
  margin-right: 105px;
  background-color: #4d4d4d;
  height: 100%;
  line-height: 50px;
  color: #fff;
}
.pay-img img {
  height: 100%;
  padding: 0 10px;
  margin-top: -3px;
}
.go-pay {
  color: #fff;
  background-color: #16a686;
  right: 0;
  bottom: 0;
  font-size: 15px;
  height: 100%;
  width: 105px;
  text-align: center;
  line-height: 50px;
}
.empty-cart {
  color: #737373;
  background-color: #f3f3f3;
}
.empty-btn {
  padding: 5px 10px;
}
.cart-list {
  color: #555555;
  padding: 20px 10px;
  border-bottom: 1px solid #eee;
}
.shopping-btn > .shopping-name {
  padding: 0 15px;
  vertical-align: 3px;
}
.shopping-btn > .total {
  display: inline-block;
  vertical-align: 3px;
  width: 35px;
  text-align: center;
}
.shopping-btn > i {
  font-size: 24px;
}
.dot {
  position: absolute;
  width: 18px;
  height: 18px;
  background-color: red;
  color: #fff;
  border-radius: 50%;
  top: -3px;
  left: 32px;
  font-size: 12px;
  text-align: center;
  line-height: 16px;
}
.dot-copy {
  top: -10px;
  left: 48px;
}
</style>
