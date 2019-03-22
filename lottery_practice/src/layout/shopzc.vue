<template>
  <div class="pb-20 fh scroll">
    <!-- 地址选项 -->
    <list-select-address v-model="peoData.address"></list-select-address>
    <!-- 客户经理 -->
    <list-select v-model="peoData.manager"></list-select>
    <!-- 姓名 -->
    <list-item v-model="peoData.name"></list-item>
    <!-- 烟草许可证编号 -->
    <list-item v-model="peoData.yan_code"></list-item>
    <!-- 身份证号 -->
    <list-item v-model="peoData.id_number"></list-item>
    <!-- 详细地址 -->
    <list-item v-model="peoData.detailAddress"></list-item>
    <!-- 店铺名称 -->
    <list-item v-model="peoData.view_name"></list-item>
    <!-- 手机号 -->
    <verify-item v-model="peoData.phone"></verify-item>
    <!-- 公益彩类型 -->
    <check-list v-model="peoData.sell_type"></check-list>
    <!-- 签名 -->
    <signature v-model="peoData.signature"></signature>
    <!-- 协议 -->
    <agree-check v-model="peoData.agreeCheck"></agree-check>
    <!-- submit button -->
    <div class="my-30">
      <button :disabled="submitting" class="sub-btn" @click="submit">{{nextBtn}}</button>
    </div>
    <div>哈哈哈</div>
  </div>
</template>

<script>
import listSelectAddress from '@/components/form/list-select-address'
import listSelect from '@/components/form/list-select'
import listItem from '@/components/form/list-item'
import verifyItem from '@/components/form/verify-item'
import checkList from '@/components/form/check-list'
import signature from '@/components/form/signature'
import agreeCheck from '@/components/form/agree-check'
import swal from 'sweetalert'
import formConfig from '@/public/tools/form-config.js'
import {api} from '@/public/api'
import '@/public/tools/validate.js'
export default {
  components: {
    listSelectAddress,
    listSelect,
    listItem,
    verifyItem,
    checkList,
    signature,
    agreeCheck
  },
  data () {
    return {
      id: '',
      // 按钮参数
      nextBtn: '完成',
      submitting: false,
      provinceId: '',
      refuse: '0',
      // 表单配置
      peoData: {
        // 姓名
        name: {
          key: 'name',
          lab: '姓名',
          value: '',
          placeholder: '请输入烟草专卖许可证上经营者姓名',
          show: false,
          validation: 'fullname'
        },
        // 烟草许可证
        yan_code: {
          key: 'yan_code',
          lab: '所持烟草专卖证许可证编号',
          value: '',
          show: false,
          validation: 'mRequired'
        },
        // 身份证
        id_number: {
          key: 'id_number',
          lab: '身份证号',
          value: '',
          show: false,
          validation: 'idNumber'
        },
        // 地区选项
        address: {
          key: 'address',
          type: 'address',
          lab: '地区',
          codeId: '', // code集合
          extraId: '', // 省 code
          province: '', // 省份
          city: '', // 市
          area: '', // 区
          street: '', // 街道
          wheels: '4',
          show: false
        },
        // 详细地址
        detailAddress: {
          key: 'detailAddress',
          type: 'input',
          lab: '详细地址',
          value: '',
          show: false,
          validation: 'mRequired'
        },
        // 客户经理
        manager: {
          key: 'manager',
          type: 'select',
          id: 'manager',
          lab: '客户经理',
          value: '',
          valueId: '',
          codeId: '',
          list: [],
          Wheels: 1,
          show: false
        },
        // 您的店铺名称
        view_name: {
          key: 'view_name',
          type: 'input',
          lab: '您的店铺名称',
          value: '',
          show: false,
          validation: 'mRequired'
        },
        // 电话
        phone: {
          key: 'phone',
          type: 'verify',
          lab: '手机号',
          value: '',
          varifyLab: '验证码',
          verifyVal: '',
          show: false,
          validation: 'phone'
        },
        // 公益彩类型
        sell_type: {
          key: 'sell_type',
          lab: '公益彩类型',
          type: 'checkbox',
          value: '',
          children: {
            '1': {
              name: '即开型',
              checked: false,
              disabled: false,
              type: '1'
            },
            '2': {
              name: '电脑型',
              checked: false,
              disabled: true,
              text: '电脑型公益彩暂未开放',
              type: '2'
            }
          },
          radio: false,
          show: false
        },
        // 我已阅读并同意
        agreeCheck: {
          key: 'agreeCheck',
          lab: '我已阅读并同意',
          type: 'agreeCheck',
          value: false,
          size: 'small',
          show: false
        },
        // 签名
        signature: {
          key: 'signature',
          lab: '签名',
          type: 'signature',
          signatureUrl: '',
          show: false
        }
        // 银行
        // bank: {
        //   key: 'bank',
        //   show: false,
        //   lab: '银行卡'
        // }
      }
    }
  },
  methods: {
    // 初始化数据
    async getinfo () {
      try {
        // 获取当前注册信息
        let fetchDetailMsg = await api.request('/mobile/Register/getDetail', {
          type: 'club'
        })
        if (fetchDetailMsg.code === 0 && fetchDetailMsg.data) {
          // 处理获取到的数据
          this.handleFetchDetailMsg(fetchDetailMsg.data)
          // 获取客户经理数据
          this.getmangerList(fetchDetailMsg.data.area_code, fetchDetailMsg.data.manager_id)
          // 获取表单配置
          this.getConfig(this.provinceId)
        }
      } catch (error) {
        console.log(error)
        swal({
          button: '关闭',
          text: '服务器错误，请稍后重试'
        })
      }
    },
    // 处理获取到的数据
    handleFetchDetailMsg (data) {
      // refuse: 1  注册失败
      this.refuse = data.refuse
      if (this.refuse === '1') {
        this.id = data.id
      }
      const peoData = this.peoData
      this.provinceId = data.area_id || ''
      peoData.name.value = data.name || ''
      peoData.yan_code.value = data.yan_code || ''
      peoData.id_number.value = data.id_number || ''
      // 地区数据
      peoData.address.codeId = data.area_code || ''
      peoData.address.extraId = data.area_id || ''
      peoData.address.province = data.province || ''
      peoData.address.city = data.city || ''
      peoData.address.area = data.district || ''
      peoData.address.street = data.street || ''

      peoData.detailAddress.value = data.address || ''
      peoData.manager.valueId = data.manager_id
      peoData.view_name.value = data.view_name || ''
      peoData.phone.value = data.phone || ''

      peoData.signature.signatureUrl = data.sign_pic
    },
    // 获取配置文件
    getConfig (id) {
      api.request('/mobile/login_config/select', {
        area_id: id
      })
        .then(res => {
          if (res.code === 200 && res.data) {
            // 1. 重置全部配置项为false
            this.resetConfig()
            // 2. 根据返回值配置
            this.handleFetchConfig(res.data)
            // submit 可用
            this.submitting = false
          } else if (res.code === 503) {
            swal({
              button: '确定',
              text: `${res.msg}`
            })
            this.submitting = true
          } else {
            this.nextBtn = '完成'
            swal({
              button: '确定',
              text: '服务器异常，请稍后再试'
            })
          }
        })
    },
    // 重置 peoData 中每一项的 show 为 false
    resetConfig () {
      for (let key of Object.keys(this.peoData)) {
        this.peoData[key].show = false
      }
    },
    // 根据接口返回的配置文件，匹配表单
    handleFetchConfig (data) {
      let existConfig = formConfig.config
      let {config, info} = data
      if (!(config instanceof Array) || config.length === 0) {
        return
      }
      // 匹配显示表单
      for (let id of config) {
        for (let item of existConfig) {
          if (Number(id) === Number(item.id)) {
            if (this.peoData[item.key]) {
              // 11: 银行卡
              if (Number(id) === 11) {
                this.nextBtn = '下一步'
              }
              this.peoData[item.key].show = true
              // 判断后台是否开启图像识别
              if (info) {
                this.peoData[item.key].value = info[item.key] || ''
              }
            }
          }
        }
      }
    },
    // 获取客户经理
    getmangerList (code, id = '') {
      var reqData = {
        area_code: code,
        type: 'manager'
      }
      api.request('/mobile/msgtip/get_manager_list', reqData)
        .then(res => {
          if (res.data && res.data.length) {
            let list = []
            for (let item of res.data) {
              list.push({
                id: item.phone,
                value: item.name + ' (' + item.phone + ')'
              })
              this.peoData.manager.list = list
              this.peoData.manager.codeId = id
            }
          } else {
            this.peoData.manager.list = []
            this.peoData.manager.codeId = id
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 处理提交表单数据
    formatReqData (data) {
      let result = {}
      for (let k in data) {
        switch (k) {
          case 'manager':
            result['manager_name'] = data[k].value.split(' ')[0]
            result['manager_id_number'] = data[k].id
            break
          case 'phone':
            result['phone'] = data[k].value
            result['code'] = data[k].verifyVal
            break
          case 'address':
            result['area_id'] = this.provinceId
            result['area_code'] = data[k].id
            let city = this.peoData.address.city
            result['city'] = city
            break
          case 'detailAddress':
            result['address'] = data[k]
            break
          default:
            result[k] = data[k]
            break
        }
      }
      return result
    },
    // submit (e) {
    //   let result = this.formatReqData(e)
    //   if (this.submitting) {
    //     return
    //   }
    //   this.submitting = true
    //   let url = '/mobile/wechat/updateShop'
    //   if (this.refuse === '1') {
    //     url = '/mobile/Register/modifyInfo'
    //     result['id'] = this.id
    //     result['type'] = 'club'
    //     result['update'] = true
    //   }
    //   api.request(url, result)
    //     .then(res => {
    //       if (res.status.succeed === 1) {
    //         if (this.peoData.bank.show) {
    //           this.$router.push({
    //             name: 'bind-bank',
    //             query: {
    //               name: escape(this.peoData.name.value),
    //               refuse: this.refuse,
    //               code: this.provinceId
    //             }
    //           })
    //         } else {
    //           swal({
    //             button: '关闭',
    //             text: `注册成功，请耐心等待审核`
    //           }).then(() => {
    //             this.$router.push({
    //               name: 'shopinfo'
    //             })
    //           })
    //         }
    //       } else {
    //         swal({
    //           button: '关闭',
    //           text: `#${res.status.error_code}: 注册失败，请检查信息！${res.status.error_desc}`
    //         })
    //       }
    //     })
    //     .catch((err) => {
    //       console.log(err)
    //       swal({
    //         button: '关闭',
    //         text: '注册失败，服务器异常！'
    //       })
    //     }).then(() => {
    //       this.submitting = false
    //     })
    // },
    // 处理签名照返回值
    handleSignCallback (imgSrc) {
      if (imgSrc) {
        const signParams = {
          type: 'sign_pic',
          base64: imgSrc
        }
        // 保存签名照
        api.request('/mobile/Register/uploadSignPic', signParams)
          .then(res => {
            if (res.code === 0) {
              // 图片保存成功
              // 1. 初始化签名档
              this.peoData.signature.signatureUrl = res.data
            } else {
              swal({
                button: '关闭',
                text: '注册失败，服务器异常！'
              })
            }
          })
      }
    },
    submit () {
      let res = this.validateBeforeSubmit()
      console.log('submit res', res)
    },
    // 提交前的验证
    async validateBeforeSubmit () {
      let validateArr = []

      this.$children.forEach(function (vm) {
        vm.$validator.validateAll()
          .then(result => {
            console.log(vm.value.key, result)
            validateArr.push(result)
          })
      })

      // const promises = this.$children.forEach(vm => {
      //   return new Promise((resolve, reject) => {
      //     vm.$validator.validateAll()
      //       .then(result => {
      //         // console.log(vm.value.key, result)
      //         resolve(result)
      //       })
      //   })
      // })

      // Promise.all(promises)
      //   .then(result => {
      //     console.log(result)
      //   })
      //   .catch(err => {
      //     console.log(err)
      //   })

      console.log('validateArr', validateArr)

      let validateResult = validateArr.every((item) => {
        console.log('item', item)
        return item === true
      })

      console.log('validateResult', validateResult)
      if (validateResult) {
        return 'true'
      } else {
        return 'false'
      }
    }
  },
  $_veeValidate: {
    validator: 'new'
  },
  created () {
    this.refuse = this.$route.query.refuse
    this.getinfo()
  }
}
</script>

<style scoped>
  .pb-20 {
    padding-bottom: 20px
  }

  .py-80 {
    padding: 80px 0
  }

  .my-30 {
    margin: 30px 0
  }
</style>
