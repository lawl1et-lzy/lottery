
/**
 * 这个是页面表单元素对应的id
 *
 * 后台给返回一个 要显示的id数组
 *
 * 例如： [1,2,3,4,6]
 *
 * 页面显示 地区选择，客户经理，手机号，姓名，身份证号
 *
 */
const config = [
  /** 必须项 */
  {
    id: 1,
    label: '地区选择',
    key: 'address'
  },
  {
    id: 2,
    label: '客户经理',
    key: 'manager'
  },
  {
    id: 3,
    label: '手机号+验证码',
    key: 'phone'
  },
  /** 选择项 */
  {
    id: 4,
    label: '姓名',
    key: 'name'
  },
  {
    id: 5,
    label: '所持烟草专卖证许可证编号',
    key: 'yan_code'
  },
  {
    id: 6,
    label: '身份证号',
    key: 'id_number'
  },
  {
    id: 7,
    label: '您的店铺名称',
    key: 'view_name'
  },
  {
    id: 8,
    label: '详细地址',
    key: 'detailAddress'
  },
  {
    id: 9,
    label: '公益彩类型',
    key: 'sell_type'
  },
  {
    id: 10,
    label: '协议',
    key: 'agreeCheck'
  },
  {
    id: 11,
    label: '银行卡',
    key: 'bank'
  },
  // {
  //   id:12,
  //   label:'问卷调查',
  //   key: 'questionnaire'
  // },
  {
    id: 12,
    label: '签名',
    key: 'signature'
  }
]
export default {
  config
}
/**
 *
 *
 */
