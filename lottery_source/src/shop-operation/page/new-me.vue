<template>
  <div class="me fh d-flex flex-column">
    <div class="me-header re">
      <div class="img">
        <img src="../../assets/me-bg.png" alt="">
      </div>
      <div class="user-info d-flex ab align-items-center">
          <div class="avatar"><img :src="avatar" alt=""></div>
          <div class="name f-14">{{userName}}</div>
          <div class="shop-name mt-5 f-13">{{shopName}}</div>
      </div>
      <div class="public-benefit d-flex text-center f-14">
        <div class="integral" @click="navTo({route:'/shop-point',outSide: false})">
          <i class="iconfont icon-publicwelfare"></i>
          <div class="mt-2">公益分</div>
        </div>
        <div class="shoping" @click="navTo({outSide: true})">
          <i class="iconfont icon-mall"></i>
          <div class="mt-2">公益分商城</div>
        </div>
      </div> 
    </div>
    <div class="me-nav box">
      <div class="d-flex j-between me-item f-14" v-for="(item,index) in list" :key="index" @click="navTo(item)">
        <div>
          <i :class="['iconfont','f-20',item.icon]"></i>
          <span class="text ml-5">{{item.title}}</span>
        </div>
        <i class="iconfont icon-right lh-23 f-14"></i>
      </div>
    </div>
  </div>
</template>

<script>
import {api} from '../../public/api'
import swal from 'sweetalert'
const USER_AVATAR = require('@/assets/default-avatar.png')
export default {
  name: 'new-me',
  data(){
    return {
      avatar: USER_AVATAR,
      userName: '',
      shopName: '',
      list:[
        {
          title:'我的资料',
          route:'/shopinfo',
          icon: 'icon-personal',
          outSide: false,
        },
        // {
        //   title:'我的银行卡',
        //   route:'/bank-list?noBtn=true',
        //   icon: 'icon-bankcard',
        //   outSide: false,
        // }
      ]
    }
  },
  created(){
  this.getUserInfo()
  },
  methods: {
    navTo(item) {
      if(!item.outSide){
        this.$router.push({path: item.route})
      } else {
        api.navigateWithSid('mobile/wechat/credits_shop');
      }
    },
    getUserInfo(){
      api.request('mobile/wechat/api_shopid')
      .then(data => {
        if(data.status.succeed === 1) {
          this.userName = data.data.name
          this.shopName = data.data.view_name
        }else{
          swal({
            button: '关闭',
            text: '获取用户信息失败,请重新加载',
          })
        }
      })
      .catch(err=>{
        swal({
          button: '关闭',
          text: '获取用户信息失败,请重新加载',
        })
      }) 
    }
  }
}
</script>

<style scoped>
  img {
    width: 100%;
  }
  .me-header .user-info {
    width: 100%;
    flex-direction: column;
    padding-top: 6%;
    color: #fff;
    left: 0;
    top: 0;
  }
  .user-info .avatar {
    width: 43px;
    height: 43px;
    margin-bottom: 10px;
  }
  .me-header .public-benefit {
    color: #757575;
    margin: 0 10px;
    background-color: #fff;
    padding: 10px;
    border-radius: 5px;
    box-shadow: 0px 1px 5px rgba(0, 0, 0, 0.1);
    margin-top: -9%;
    position: relative;
  }
  .me-header .public-benefit i {
    font-size: 20px;
  }
  .me-header .public-benefit > div {
    width: 50%;
  }
  .me-header .public-benefit .integral {
    border-right: 1px solid #f0f0f0;
  }
  .public-benefit .integral i{
    color: #ff6925;
  }
  .public-benefit .shoping i{
    color: #ffb224;
  }
  .me .me-nav {
    flex-grow: 1;
    margin-top: 10px;
    margin-left: 10px;
    margin-right: 10px;
    margin-bottom: 67px;
    border-radius: 5px;
    background-color: #fff;
    color: #757575;
  }
  .me-nav .me-item {
    padding: 10px;
    border-bottom: 1px solid #f0f0f0;
  }
  .me-nav .me-item .text {
    vertical-align: 2px;
  }
  .lh-23 {
    line-height: 23px;
  }
  .me-nav > .me-item:nth-child(1) > div >i {
    color: #16a686;
  }
  .me-nav > .me-item:nth-child(2) > div >i {
    color: #ffb224;
  }
</style>
