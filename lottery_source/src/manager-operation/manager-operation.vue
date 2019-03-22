<template>
  <div class="container bg">
    <router-view/>
    <mt-tabbar v-model="selected" class="bt i-grey-4">
      <mt-tab-item id="point">
        <div class="mb-5"><i class="iconfont icon-integral1 i-grey-4 f-25"></i></div>
         公益分
      </mt-tab-item>
      <mt-tab-item id="managerOrder" v-if="orderShow">
        <div class="mb-5"><i class="iconfont icon-indent1 i-grey-4 f-25"></i></div>
         订单
      </mt-tab-item>
      <mt-tab-item id="review" class="re">
        <div class="mb-5"><i class="iconfont icon-stamp i-grey-4 f-25"></i></div>
        <div v-if="badge" class="badge">{{badgeText}}</div>
        审核
      </mt-tab-item>
      <mt-tab-item :id="myRouteName">
        <div class="mb-5"><i class="iconfont icon-me i-grey-4 f-25"></i></div>
        我的
      </mt-tab-item>
    </mt-tabbar>
  </div>
</template>

<script>
import {api} from '../public/api'
export default {
  name: "manager-operation",
  data: function() {
    return {
      myRouteName: 'managerinfo',
      badge: 0,
      orderShow: false
    };
  },
  created () {
    if(this.areaId == '14') {
      this.myRouteName = 'myManager'
    }
    this.getBadge()
    this.getConfig()
  },
  computed: {
    badgeText () {
      let text = this.badge;
      if(this.badge > 99) {
        text = '99+'
      }
      return text
    },
    areaId () {
      let id = this.$store.state.session.areaId || localStorage.getItem('areaId')
      return id
    },
    selected: {
      get: function() {
        return this.$route.name;
      },
      set: function(v) {
        this.$router.push({ name: v});
      }
    }
  },
  methods: {
    getConfig () {
      api.request('mobile/order/checkShow')
        .then(res => {
          if(res && res.data) {
            this.orderShow = res.data.order
          }
        })
    },
    getBadge () {
      api.request('mobile/msgtip/get_noaudit_num', {type: 'manager'})
      .then(res => {
         if (res && res.data) {
          this.badge = Number(res.data.num);
        }
      })
      .catch(err => {
        console.log(err)
      })
    }
  }
};
</script>

<style scoped>
  .bg{
    background: #f0f4f6;
  }
  .badge{
    position: absolute;
    background: red;
    font-size: 12px;
    border-radius: 30px;
    padding: 0 3px;
    color: #fff;
    line-height: 15px;
    text-align: center;
    top: 6px;
    left: 55%;
  }
</style>