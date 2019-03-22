<template>
  <div class="fh scroll">
    <div v-for="item in infoData" :key="item.index">
      <div v-if="item.type==='text'&& item.show">
        <div class="form-lists ">
          <div class="lab">{{item.lab}}：</div>
          <div class="value">
            {{item.value}}
          </div>
        </div>
      </div>
      <div v-if="item.type==='img'&& item.value.length">
        <div class="img-item form-lists ">
          <div class="item-key lab">
            <p>{{item.lab}}：</p>
          </div>
          <div class="item-value">
            <div class="img-box">
              <div class="img-box-item" v-for="img in item.value" :key="img.index">
                <div class="zoomImage" @click="showImg(img)">
                  <img :src="img" alt="暂无图片" class="img-position font-img">
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { api } from '../public/api';
  import swal from 'sweetalert';
  export default {
    name: 'shop-info',
    data() {
      return {
        infoData: [],
        map:{
          "1":'即开型',
          "2":'电脑型'
        }
      }
    },
    methods: {
      showImg: function (src) {
        window.location.href = src;
      },
      getinfo: function () {
        this.infoData = [];
        var _vue = this;
        api.request('mobile/wechat/api_shopid')
          .then((res) => {
            if (res.status.succeed === 1 && res.data) {
              _vue.infoData = [{
                  type: 'text',
                  lab: '店铺ID',
                  value: res.data.id ? res.data.id : '',
                  show: res.data.id ? true : false,
                },
                {
                  type: 'text',
                  lab: '本人姓名',
                  value: res.data.name ? res.data.name : '',
                  show: res.data.name ? true : false
                },
                {
                  type: 'text',
                  lab: '店铺名称',
                  value: res.data.view_name ? res.data.view_name : '',
                  show: res.data.view_name ? true : false
                },
                {
                  type: 'text',
                  lab: '所持烟草专卖许可证编号',
                  value: res.data.yan_code ? res.data.yan_code : '',
                  show: res.data.yan_code ? true : false
                },
                {
                  type: 'text',
                  lab: '身份证号',
                  value: res.data.id_number ? res.data.id_number : '',
                  show: res.data.id_number ? true : false
                },
                {
                  type: 'text',
                  lab: '客户经理姓名',
                  value: res.data.manager_name ? res.data.manager_name : '',
                  show: res.data.manager_name ? true : false
                },
                {
                  type: 'text',
                  lab: '客户经理工作手机号',
                  value: res.data.manager_id ? res.data.manager_id : '',
                  show: res.data.manager_id ? true : false
                },
                {
                  type: 'text',
                  lab: '省份',
                  value: res.data.sheng ? res.data.sheng : '',
                  show: res.data.sheng ? true : false
                },
                {
                  type: 'text',
                  lab: '公益彩类型',
                  value: res.data.sell_type ? this.map[res.data.sell_type] : '',
                  show: res.data.sell_type === ('1' || '2') ? true : false
                },
                {
                  type: 'text',
                  lab: '公益彩种类',
                  value: res.data.ticket_type ? res.data.ticket_type : '',
                  show: res.data.ticket_type ? true : false
                },
                {
                  type: 'text',
                  lab: '城市',
                  value: res.data.city ? res.data.city : '',
                  show: res.data.city ? true : false
                },
                {
                  type: 'text',
                  lab: '店址',
                  value: res.data.address ? res.data.address : '',
                  show: res.data.address ? true : false
                },
                {
                  type: 'text',
                  lab: '本人手机号',
                  value: res.data.phone ? res.data.phone : '',
                  show: res.data.phone ? true : false
                },
                {
                  type: 'text',
                  lab: '开户行',
                  value: res.data.bank_name ? res.data.bank_name : '',
                  show: res.data.bank_name ? true : false
                },
                {
                  type: 'text',
                  lab: '银行卡号',
                  value: res.data.bank_card_id ? res.data.bank_card_id : '',
                  show: res.data.bank_card_id ? true : false
                },
                {
                  type: 'img',
                  lab: '身份证照',
                  value: res.data.id_number_image && res.data.id_number_image.front &&  res.data.id_number_image.back 
                  ? [res.data.id_number_image.front, res.data.id_number_image.back]
                  :[],

                },
                {
                  type: 'img',
                  lab: '烟草证照',
                  value: res.data.id_number_image && res.data.id_number_image.yan_image 
                  ? [res.data.id_number_image.yan_image] 
                  : []
                },
                {
                  type: 'img',
                  lab: '营业执照',
                  value: res.data.id_number_image && res.data.id_number_image.business_license ? [res.data.id_number_image.business_license] : [],
                },
                {
                  type: 'img',
                  lab: '签名',
                  value: res.data.sign_pic ? [res.data.sign_pic] : [],
                },
              ];
            } else {
              swal({
                button: '关闭',
                text: `用户信息获取失败,${res.status.error_desc}`,
              });
            }
          })
          .catch(err => {
            console.log(err);
            swal({
              button: '关闭',
              text: `信息获取失败,请联系客服`
            });
          })
      }
    },

    created: function () {
      this.getinfo();
    }
  }

</script>

<style>


</style>
