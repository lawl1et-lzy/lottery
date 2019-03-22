<template>
  <div class="container scroll">
     <ul class="list">
      <div class="lists" v-for="(item, index) in list" :key="index">
        <div class="lab">{{item.key}}：</div>
        <div class="value">
          {{item.value}}
        </div>
      </div>
      <img-list :imgs="imgs" :title="'身份证照'"></img-list>
      <img-list :imgs="img" :title="'烟草证照'"></img-list>
      <img-list :imgs="license" :title="'营业执照'"></img-list>
    </ul>
    <confirm-btn v-if="isDone" :id="id" :type="type"></confirm-btn>
    <!-- 测试按钮 -->
    <!-- <confirm-btn :id="id" :type="type"></confirm-btn> -->
  </div>
</template>

<script>
import { api } from '../../../public/api'
import swal from 'sweetalert';
import imgList from '../../components/img-list.vue'
import confirmBtn from '../../components/confirm-btn.vue'
export default {
  name: "review-info",
  components: {
    imgList,
    confirmBtn
  },
  data() {
    return {
      list: [],
      imgs: [],
      img:[],
      license:[],
      type: 'club',
      id: '',
      state: '',
      isDone: false
    }
  },
  created() {
    let currentPage = localStorage.getItem('currentPage');
    if(currentPage) {
      this.$store.commit('changeActive', currentPage)
    }

    if(this.$store.state.check.currentPage === "undone"){
      this.isDone = true;
    } else {
      this.isDone = false;
    }
    this.id = this.$route.query.id;
    this.getReviewInfo()
  },
  methods: {
    getReviewInfo(){
      let reqData = {
        type: this.type,
        id: this.id
      }
      if (this.$store.state.check.currentPage === 'refuse') {
        reqData['refuse'] = true;
      }else {
        delete reqData.refuse;
      }
      api.request('mobile/Audit/getDetail',reqData)
        .then(data =>{
          if(data.data) {
             this.formatData(data.data)
          } else{
            swal({
              button: '关闭',
              text: '获取信息失败,'+res.msg,
            });
          }
        })
        .catch(function (error) {
          console.log(error);
       });
    },
    formatData(data) {
       this.list = [];
      if(data.name) {
        this.list.push({
          key: '申请人',
          value: data.name,
        })
      }
      // if(data.yan_code) {
      //   this.list.push({
      //     key: '所持烟草专卖许可证编号',
      //     value: data.yan_code
      //   })
      // }
      // if(data.id_number) {
      //   this.list.push({
      //     key: '身份证号',
      //     value:data.id_number
      //   })
      // }
      if(data.phone) {
        this.list.push( {
          key: '手机号',
          value: data.phone
        })
      }
      // if(data.view_name) {
      //   this.list.push( {
      //     key: '店铺名称',
      //     value: data.view_name
      //   })
      // }
      // if(data.province) {
      //   this.list.push( {
      //     key: '省份',
      //     value: data.province
      //   })
      // }
      // if(data.city && data.address) {
      //   this.list.push({
      //     key: '地址',
      //     value: data.city + data.address
      //   })
      // }
      // let map = {
      //   "1":'即开型',
      //   "2":"电脑型"
      // }
      // if (data.sell_type) {
      //   this.list.push({
      //     key: '公益彩类型',
      //     value: map[data.sell_type]
      //   })
      // }
      // if (data.ticket_type) {
      //   this.list.push({
      //     key: '公益彩种类',
      //     value: data.ticket_type
      //   })
      // }
      // if(data.bank_name) {
      //   this.list.push({
      //     key: '开户行',
      //     value: data.bank_name
      //   });
      // }
      // if(data.bank_card_id){
      //   this.list.push({
      //     key: '银行卡号',
      //     value: data.bank_card_id
      //   });
      // }
      this.list.push({
        key: '申请时间',
        value: data.create_date
      });

      if (data.audit_time){
        this.list.push({
          key: '审核时间',
          value: data.audit_time
        });
      }
      if (data.reason) {
        this.list.push({
          key: '拒绝原因',
          value: data.reason
        });
      }
      this.imgs = [];
      this.img = [];
      this.license = [];
      if (data.id_number_image){
      //   if(data.id_number_image.front && data.id_number_image.back) {
      //     this.imgs = [
      //       data.id_number_image.front,
      //       data.id_number_image.back
      //     ];
      //   }
        if ( data.id_number_image.yan_image){
          this.img = [
            data.id_number_image.yan_image,
          ];
        }
        // if ( data.id_number_image.business_license){
        //   this.license = [
        //     data.id_number_image.business_license,
        //   ];
        // }
      }
    }
  }
}
</script>

<style scoped>
  .list{
    width: 100%;
    box-sizing: border-box;
    background-color: #ffffff;
    list-style: none;
    padding: 0;
    margin: 0;
    color: rgba(0, 0, 0, 0.65);
    font-weight: 500;
    font-size: 15px;
    padding-bottom: 60px;
  }
  .list-item{
    height: 50px;
    line-height: 50px;
    padding-left: 20px !important;
    padding-right: 20px !important;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  }

  .lists{
    display: flex;
    align-items: center;
    min-height: 50px;
    padding: 0 20px;
    border-top: 1px solid #f7f7f7;
    border-bottom: 1px solid rgba(0,0,0,.1);
  }

  .lists .lab{
    color: rgba(0, 0, 0, 0.65);
    font-weight: 500;
    padding-top: 1px;
    font-size: 15px;
  }
  .lists .value{
    font-size: 14px;
    width: 0;
    flex-shrink: 1;
    flex-grow: 1; 
  }
</style>
