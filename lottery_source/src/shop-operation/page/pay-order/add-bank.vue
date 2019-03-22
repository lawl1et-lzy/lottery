<template>
    <div class="fh bg">
      <div class="bank-notes">为保证您的资金安全，请填写真实信息</div>
        <vue-form @submit="submit($event)" @FORM="getFormObj">
          <div class="bg-white">
            <!-- <form-item>
              <list-item :item="formData[0]"></list-item>
            </form-item>
            <form-item>
              <list-item :item="formData[1]"></list-item>
            </form-item> -->
            <form-item>
              <list-item :item="formData[2]"></list-item>
            </form-item>
            <form-item>
              <list-item :item="formData[3]"></list-item>
            </form-item>
            <form-item>
              <list-select :item="formData[4]" @selected="bankTypeSelect($event)"></list-select>
            </form-item>
            <form-item v-if="isNeed">
               <list-item :item="formData[5]"></list-item>
            </form-item>
            <form-item  v-if="isNeed">
               <list-item :item="formData[6]"></list-item>
            </form-item>
            <div v-if="isErr" class="err-info f-12">
              <span> <i class="iconfont icon-fail-circle f-12"></i></span>
              <span>{{errMsg}}</span>
            </div>
            <form-item :IData="checkData">
              <div class="d-flex p-15-20" >
                <div style=" color: rgba(0,0,0,0.5)">
                  <check-box :lab="checkData.lab" v-model="checkData.value" :size="checkData.size"/>
                </div>
                <span class="text-style" @click="readAgreement">《协议》</span>
              </div>
            </form-item>
          </div>
          <div class="btn-box" slot="btn">
            <button :disabled="isSubmiting" class="sub-btn">下一步</button>
          </div>
        </vue-form>
    </div>
</template>

<script>
import checkBox from '../../../components/check-box'
import vueForm from '../../../components/form/vue-form'
import formItem from '../../../components/form/form-item'
import listItem from '../../../components/form/list-item'
import listSelect from '../../../components/form/list-select'
import bankAgreement from './bank-agreement'
import {api} from '../../../public/api'
import swal from 'sweetalert';
export default {
  name: 'add-bank',
  components: {
    listItem,
    listSelect,
    checkBox,
    vueForm,
    formItem,
    bankAgreement
  },
  data: function() {
    return {
      isErr: false,
      errMsg: '',
      isSubmiting: false,
      formObj: {},
      isNeed: false,
      checkData: {
        value: false,
        lab: '我已阅读并接受',
        size: 'small',
        key: 'isAgree',
      },
      formData: [
        {
          lab: "持卡人",
          value:'',
          key: 'account_name',
          placeholder: "请输入持卡人姓名",
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
          lab: "身份证号",
          value: "",
          key: 'id',
          placeholder: "请输入持卡人身份证号",
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
          lab: "手机号",
          value: "",
          key: 'tel',
          placeholder: "请输入银行预留手机号",
          verifyFn: function (value) {
            var reg = /^1[0123456789]\d{9}$/;
            if (!reg.test(value)) {
              return false
            } else {
              return true;
            }
          }
        },
        {
          lab: "银行卡号",
          value: "",
          key: 'account_no',
          placeholder: "请输入银行卡号",
          verifyFn: function (value) {
            let reg = /^\d{15,19}$/;
            if (!reg.test(value)) {
              return false
            } else {
              return true;
            }
          }
        },
        {
          type: "select",
          id: "banktype",
          lab: '银行卡种类',
          key: 'banktype',
          value: '',
          valueId: '',
          codeId: '',
          list: [{id:'1', value: '借记卡'}, {id: '2', value: '信用卡'}],
          Wheels: 1,
          rules: [10],
        },
        {
          lab: "有效期",
          value: "",
          key: 'expired',
          placeholder: "请输入有效期 如：“18/12”",
          verifyFn: function (value) {
            if (!value) {
              return false
            } else {
              return true;
            }
          }
        },
        {
          lab: "安全码",
          value: "",
          key: 'cvn2',
          placeholder: "请输入安全码",
          verifyFn: function (value) {
            if (!value) {
              return false
            } else {
              return true;
            }
          }
        }
      ]
    }
  },
  created () {
    this.initFormData()
  },
  computed: {
    bankInfo () {
      return this.$store.state.bank.info
    }
  },
  methods: {
    bankTypeSelect (e){
      if(e[0].id == 2) {
        this.isNeed = true
      } else {
        this.isNeed = false
      }
    },
    getFormObj (e) {
      this.formObj = e
    },
    initFormData () {
      for (let item of this.formData) {
        if(item.type == 'select' && this.bankInfo[item.key]) {
          setTimeout(()=>{
            item.codeId = this.bankInfo[item.key].id || '';
          })
          if(this.bankInfo[item.key].id == '2') {
            this.isNeed = true
          }
        } else {
          item.value = this.bankInfo[item.key] || ''
        }
      }
      this.checkData.value = this.bankInfo.isAgree || false
    },
    readAgreement (){
      this.formObj.setResult()
      this.$store.commit('updateBnakInfo', this.formObj.result)
      this.$router.push({path:'/bank-agreement', query:this.$route.query})
    },
    submit (e) {
      if (!e.isAgree) {
        swal({
          button: '关闭',
          text: `请阅读并同意《银行协议》`
        })
        return
      }
      let result = {
        ...e
      }
      this.isErr = false
      this.$store.commit('updateBnakInfo', result)
      result.type = result.banktype.id
      delete result.banktype
      this.isSubmiting = true
      api.request('mobile/unionpay/protocol',this.bankInfo)
        .then( res => {
          if (res.code == 0) {
            this.isErr = false
            this.$store.commit('updateBankName', res.data.bank_name)
            this.$router.push({path:'/verify', query:this.$route.query})
          } else {
            this.isErr = true
            this.errMsg = res.msg
            this.isSubmiting = false
          }
        })
        .catch(err => {
          this.isSubmiting = false
          alert(err)
          console.log(err)
        })
        
    }
  }
}
</script>

<style scoped>
  .bg{
    background: #f0f4f6;
  }
  .bg-white{
    background: #fff;
  }
  .bank-notes{
    font-size: 14px;
    padding: 15px 20px;
    color: rgba(0,0,0,0.4);
  }
  .spacing-3{
    letter-spacing: 3px;
  }
  .mr-15{
    margin-right: 15px;
  }
  .spacing-20{
    letter-spacing: 20px;
  }
  .p-15-20{
    padding: 15px 20px;
  }
  .err-info{
    color: red;
    padding-top: 10px;
    padding-left: 20px;
    padding-right: 20px;
    padding-bottom: 0px;
  }
  .f-12{
    font-size: 12px !important;
  }
  .text-style{
    color: rgb(38, 162, 255);
    font-size: 12px;
    margin-left: -15px;
  }
  .btn-box{
    margin-top: 40px;
    margin-bottom: 40px;
  }
</style>