import Vue from 'vue'
import Vuex from 'vuex'
import session from './modules/session'
import newLottery from './modules/new-lottery'
import bank from './modules/bank'
import check from './modules/check'
import order from './modules/order'
import pcasCode from './modules/pcas-code'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    session,
    newLottery,
    bank,
    check,
    order,
    pcasCode
  }
})
