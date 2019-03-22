
import {listFactory} from './list-factory'
let Order = new listFactory({
  nav: ['unpayed', 'payed', 'finish'],
  params: {},
  navType:'status',
  service: 'mobile/wechat/get_order_list'
})

Order.creatStore()
export default {
  namespaced:true,
  state: Order.state,
  getters: Order.getters,
  actions : Order.actions,
  mutations: Order.mutations
}
