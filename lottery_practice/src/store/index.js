import Vue from 'vue'
import Vuex from 'vuex'
import session from './modules/session'
import pcasCode from './modules/pcas-code'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    session,
    pcasCode
  }
})
