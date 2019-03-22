<template>
  <div class="pb-20">
    <vue-form @submit="submit($event)">
      <form-item>
        <list-item :item="peoData[0]"></list-item>
      </form-item>
      <form-item>
        <list-item :item="peoData[1]"></list-item>
      </form-item>
      <form-item>
        <list-select-address :item="peoData[2]" @selected="areaSelect"></list-select-address>
      </form-item>
      <form-item>
        <verify-item :item="peoData[3]"></verify-item>
      </form-item>
      <div class="mt-30" slot="btn">
        <button class="sub-btn">下一步</button>
      </div>
    </vue-form>
    <!-- <div v-for="item in peoData" :key="item.index">
      <div v-if="item.type === 'input'">
        <list-item :item="item"></list-item>
      </div>
      <div v-if="item.type === 'select'">
        <list-select :info="item.info" :list="item.list" :init="item.initData" @selectChange="selectChange($event,item)"></list-select>
      </div>
      <div v-if="item.type === 'verify'">
        <verify-item :item="item" :show="btnClicked"></verify-item>
      </div>
    </div>
    <div class="mt-30">
      <button class="sub-btn" @click="submit">下一步</button>
    </div> -->
  </div>
</template>
<script>
  import vueForm from '@/components/form/vue-form'
  import formItem from '../components/form/form-item'
  import listItem from '../components/form/list-item'
  import verifyItem from '../components/form/verify-item'
  import listSelect from '../components/form/list-select'
  import listSelectAddress from '../components/form/list-select-address'
  import select from '../public/tools/select-last';
  import swal from 'sweetalert';
  import {api} from '../public/api';
  export default {
    components: {
      vueForm,
      formItem,
      listItem,
      listSelect,
      verifyItem,
      listSelectAddress
    },
    data: function () {
      return {
        peoData: [{
            lab: "客户经理姓名",
            value: "",
            key: 'manager_name',
            show: true,
            verifyFn: function (value) {
              var reg = /^[\u4e00-\u9fa5]{2,}$/;
              if (!reg.test(value)) {
                return false;
              } else {
                return true;
              }
            }
          },
          {
            type: "input",
            lab: "身份证号",
            value: "",
            show: true,
            key: 'id_number',
            verifyFn: function (value) {
              var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
              if (!reg.test(value)) {
                return false;
              } else {
                return true;
              }
            }
          },
          {
            type: "address",
            key: 'area',
            lab: '业务地区',
            codeId: '',  // code集合
            extraId:'',  // 省 code
            province: '', // 省份
            city: '', // 市
            area: '', // 区
            address: '', // 完整的地址
            wheels: '3',
            show: true
          },
          {
            type: 'verify',
            lab: '手机号',
            value: '',
            key: 'phone',
            varifyLab: '验证码',
            verifyVal: '',
            show: true,
            verifyFn: function (value) {
              var reg = /^1[0123456789]\d{9}$/;
              if (!reg.test(value)) {
                return false
              } else {
                return true;
              }
            }
          },
        ],
        submitting: false,
        refuse: "0",
        area_id: '',
        id: '',
      };
    },
    created: function () {
      this.refuse = this.$route.query.refuse
      this.getinfo();
    },
    methods: {
      getinfo: function () {
        api.request('mobile/Register/getDetail', {
            type: 'manager'
          })
          .then((res) => {
            if (res.code === 0 && res.data) {
              this.refuse = res.data.refuse;
              if (this.refuse === '1') {
                this.id = res.data.id;
              }
              this.peoData[0].value = res.data.name || '';
              this.peoData[1].value = res.data.id_number || '';
              this.peoData[2].codeId = res.data.area_code; // code 集合
              this.peoData[2].extraId = res.data.area_id; // 省 code
              this.peoData[2].province = res.data.province // 省名称
              this.peoData[2].city = res.data.city // 市名称
              this.peoData[2].area = res.data.district_name // 区名称
              this.peoData[2].address = [res.data.province, res.data.city, res.data.district_name].join(' ').trim() // 具体的地址
              this.area_id = res.data.area_id;
              this.peoData[3].value = res.data.phone || '';
            }
          })
          .catch(err => {
            console.log(err);
            swal({button:'关闭',text:'服务器错误，请稍后重试'})
          })
      },
      areaSelect(e) {
        this.area_id = e.provinceCode || ''
        this.peoData[2].codeId = e.code || ''
        this.peoData[2].extraId = e.provinceCode || ''
        this.peoData[2].province = e.province || ''
        this.peoData[2].city = e.city || ''
        this.peoData[2].area = e.area || ''
      },
      submit: function (e) {
        if (this.submitting) {
          return;
        }
        this.submitting = true;
        var reqData = {
          manager_name: e.manager_name,
          phone: e.phone.value,
          id_number: e.id_number,
          area_id: this.area_id,
          area_code: e.area.id,
          city: this.peoData[2].city,
          code: e.phone.verifyVal,
          address: [this.peoData[2].province, this.peoData[2].city, this.peoData[2].area].join(' ').trim(),
          type: 'manager',
          update: false
        }
         let url = 'mobile/wechat/addManager';
          if (this.refuse === '1') {
            url = 'mobile/Register/modifyInfo';
            reqData['id'] = this.id;
            reqData['update'] = true;
          }
          api.request(url, reqData)
            .then(res => {
              if (res.status.succeed === 1) {
                swal({
                  button: '确定',
                  text: `信息提交成功，请您耐心等待审核！`
                }).then(() => {
                  this.$router.push({name: 'managerinfo'})
                });
              } else {
                swal({
                  button: '关闭',
                  text: `#${res.status.error_code}: 注册失败，请检查信息！${res.status.error_desc}`
                });
              }
            })
            .catch((err) => {
              console.log(err);
              swal({
                button: '关闭',
                text: "注册失败，请检查网络！"
              });
            }).then(() => {
              this.submitting = false;
            })
      },
    }
  };
</script>

<style>
  .pb-20 {
    padding-bottom: 20px;
  }
</style>
