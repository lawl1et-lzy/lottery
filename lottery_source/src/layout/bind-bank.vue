<template>
  <div class="fh scroll">
    <vue-form @submit="submit($event)">
      <!-- <form-item v-if="peoData[0].value" :IData="peoData[0]">
        <div class="form-lists ">
          <div class="lab">{{peoData[0].lab}}：</div>
          <div class="value">{{peoData[0].value}} </div>
        </div>
      </form-item> -->
      <form-item>
        <list-select :item="peoData[1]" @selected="areaSelect($event)"></list-select>
      </form-item>
      <form-item>
        <list-select :item="peoData[2]" @selected="bankSelect($event)"></list-select>
      </form-item>
      <form-item v-show="showSelsect">
        <list-select :item="peoData[3]"></list-select>
      </form-item>
      <form-item v-if="!showSelsect">
        <list-item :item="other"></list-item>
      </form-item>
      <form-item class="d-flex align-items-center">
        <list-item class="flex-grow" :item="peoData[4]"></list-item>
        <div class="load-icon re" @click.prevent.once="notes">
          <img src="../assets/camera.png" alt="" width="25" height="25">
          <input class="load-input ab" type="file" accept="image/*"  @input="loadFile($event)" />
        </div>
      </form-item>
      <div class="my-30" slot="btn">
        <button :disabled="submitting" class="sub-btn">完成</button>
      </div>
    </vue-form>
  </div>
</template>

<script>
  import vueForm from '@/components/form/vue-form'
  import formItem from '../components/form/form-item'
  import listItem from '../components/form/list-item'
  import listSelect from '../components/form/list-select'
  import swal from 'sweetalert';
  import {
    api
  } from '../public/api';
  import CITY_CODE from "a_code-list/code-list/pcas-code-city";
  export default {
    name: "bind-bank",
    components: {
      vueForm,
      formItem,
      listItem,
      listSelect
    },
    data: function () {
      return {
        other: {
          lab: "开户行",
          value: '',
          key: 'bank_name',
          verifyFn: function (value) {
            if (!value) {
              return false
            } else {
              return true;
            }
          }
        },
        peoData: [{
            lab: "持卡人",
            value: '',
            key: 'name'

          },
          {
            type: "select",
            id: "area",
            lab: '开户行地区',
            key: 'area_bank',
            value: '',
            valueId: '',
            codeId: '',
            extraId: '',
            list: CITY_CODE,
            Wheels: 2,
          },
          {
            type: "select",
            id: "bank",
            lab: '银行',
            key: 'bank',
            value: '',
            valueId: '',
            codeId: '',
            list: [],
            Wheels: 1,
            rules: [12],
          },
          {
            type: "select",
            id: "open_bank",
            lab: '开户行',
            key: 'open_bank',
            value: '',
            valueId: '',
            codeId: '',
            list: [],
            Wheels: 1,
            rules: [20],
          },
          {
            lab: '卡号',
            value: '',
            key: 'bank_card_id',
            placeholder:'持卡人银行卡号',
            verifyFn: function (value) {
              let reg = /\d{15,22}/;
              if (!reg.test(value)) {
                return false
              } else {
                return true;
              }
            }
          },
        ],
        codeID: '',
        submitting: false,
        showSelsect: false,
        refuse: '0',
        agreeCheck: true,
        cityID: '',
        bankID: '',
        bankName:'',
        imgState:true,
        loagBankName: ''
      }
    },

    created: function () {
      var name = this.$route.query.name;
      this.peoData[0].value = unescape(name);
      this.codeID = this.$route.query.code;
      this.refuse = this.$route.query.refuse;
      this.getBankNames();
    },
    methods: {
      getinfo: function () {
        api.request('mobile/Register/get_club_bank')
          .then((res) => {
            if (res.code == 0) {
              this.refuse = "1";
              // this.peoData[1].valueId = "3101";
              this.peoData[1].codeId = res.data.bank_areaCode
              this.peoData[1].extraId = this.codeID
              this.cityID = res.data.bank_areaCode;
              this.peoData[2].codeId = res.data.bank_id
              this.bankID = res.data.bank_id
              this.getBanks(res.data.bank_areaCode, res.data.bank_id).then(() => {
                this.peoData[3].codeId = res.data.open_bank_id
                if (!this.peoData[3].list.length) {
                  this.other.value = res.data.bank_name
                }
              })
              this.peoData[4].value = res.data.bank_card_id;
            }
          })
          .catch(err => {
            swal({
              button: '关闭',
              text: `信息获取失败,请联系客服`
            });
          })
      },
      areaSelect(e) {
        this.cityID = e[e.length - 1].id
        if (this.cityID && this.bankID) {
          this.getBanks(this.cityID, this.bankID);
        }
      },
      bankSelect(e) {
        this.bankID = e[e.length - 1].id
        this.bankName =  e[e.length - 1].value
        if(this.loagBankName) {
          this.imgState = this.bankName.includes(this.loagBankName)
        }
        if (this.cityID && this.bankID) {
          this.getBanks(this.cityID, this.bankID);
        }
      },
      selectChange(obj, item) {
        let e = obj.data
        item.selectItem = e;
        if (item.info.id === 'area') {
          this.isGetBank = true;
          let lastItem = select.selectLast(e);
          this.cityID = lastItem ? lastItem.id : '';
        }
        if (item.info.id === 'banks') {
          this.bankID = e[0].id;
          this.isGetBank = true;
        }

        if (item.info.id === 'childBanks') {
          this.isGetBank = false;
        }

        if (this.cityID && this.bankID && this.isGetBank) {
          this.getBanks(this.cityID, this.bankID);
        }
      },
      getBankNames: function () {
        api.request('public/Common/getBankList')
          .then(res => {
            if (res.data && res.data.length) {
              this.peoData[2].list = res.data;
            }
          }).catch(err => console.log(err))
          .then(() => {
            // this.getinfo();
          });
      },
      getBanks: function (cityId, bankId) {
        var reqData = {
          city_id: cityId,
          bank_id: bankId
        };
        return api.request('public/Common/getBankChilds', reqData)
          .then(res => {
            if (res.code === 0) {
              if (res.data.length) {
                this.peoData[3].list = res.data;
                this.peoData[3].noCheck = false;
                this.showSelsect = true
              } else {
                this.peoData[3].list = []
                this.peoData[3].noCheck = true;
                this.showSelsect = false
              }
            }
          })
          .catch(err => {
            console.log(err);
            this.showSelsect = false
            swal({
              button: '关闭',
              text: '服务器错误，请稍后重试'
            })
          })
      },
      notes(){
        swal({
          button:'确定',
          text:'上传银行卡正面，保证图像清晰，方向与手机方向一致'
        })
      },
      loadFile: function (e) {
        var imageBase64 = '';
        var file = e.target.files[0];
        console.log(file)
        if (file) {
          this.loading = true;
        } else {
          return;
        }
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
          imageBase64 = reader.result;
          api.request('mobile/Register/bankCardOcr',{base64:imageBase64})
          .then((res)=>{
            if (res.code == 0) {
              let str = String(res.data.bank_card_id);
              this.peoData[4].value = str.split(' ').join('')
              this.loagBankName = res.data.bank_name;
              this.imgState = true;
              if(this.bankName) {
                if(!this.bankName.includes(this.loagBankName)) {
                  swal({text:'银行名称与上传的银行卡不符',button:'关闭'})
                  this.imgState = false;
                }
              } else {
                  swal({text:'银行卡没有选择',button:'关闭'})
                  this.imgState = false
              }
            }
          })
        }
      },

      submit: function (e) {
        if (this.submitting) {
          return;
        }
        if(!this.imgState){
         swal({text:'银行名称与上传的银行卡不符',button:'关闭'})
         return
        }
        this.submitting = true;
        let reqData = {
          // name: e.name ? e.name :'',
          bank_areaCode: e.area_bank.id,
          bank_id: e.bank.id,
          open_bank_id: e.open_bank.id || '',
          bank_name: e.open_bank.value || e.bank_name,
          bank_card_id: e.bank_card_id
        };
        api.request('mobile/Register/bindBankCard', reqData)
          .then(res => {
            if (res.code === 0) {
              swal({
                button: '关闭',
                text: "注册成功，请耐心等待审核"
              }).then(() => {
                this.$router.push({
                  name: "shopinfo"
                });
              });
              // switch (this.codeID) {
              //   case "14":
              //     this.$router.push({ name: 'hunanQuestion'});
              //     break;
              //   case "25":
              //     this.$router.push({ name: 'hunanQuestion'});
              //     break;
              //   default:
              //     this.$router.push({ name: 'guangxiQuestion'});
              // }
            } else {
              swal({
                button: '关闭',
                text: `#${res.code}: 注册失败，请检查信息！${res.msg}`
              });
            }
          })
          .catch(err => {
            swal({
              button: '关闭',
              text: "注册失败，服务器异常！"
            });
            console.log(err);
          })
          .then(() => {
            this.submitting = false;
          });
      }
    }
  }

</script>
<style scoped>
  .my-30 {
    margin: 30px 0
  }
  .load-icon{
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    padding: 11px 15px 11px 0;
  }
  .load-input {
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
  }
  .flex-grow{
    flex-grow: 1;
  }

</style>
