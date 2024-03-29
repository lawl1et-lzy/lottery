// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import '@/public/css/lists.css'
import '@/public/font-css/iconfont.css'
import '@/public/css/custom.css'
import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'
Vue.use(MintUI)
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>',
  created () {
    let sid = this.$route.query.sid || localStorage.getItem('sid')
    if (sid) {
      this.$store.commit('setSid', sid)
    }
  }
})
