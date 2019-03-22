import Vue from 'vue'
import Router from 'vue-router'
import shopImg from '@/layout/shopzc-img'
import shopzc from '@/layout/shopzc'
import cooperateAgreement from '@/components/agreements/agreements'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/shopzc-img'
    },
    {
      path: '/shopzc-img',
      name: 'shopzc-img',
      component: shopImg,
      meta: {
        title: '零售店注册'
      }
    },
    {
      path: '/shopzc',
      name: 'shopzc',
      component: shopzc,
      meta: {
        title: '零售店注册'
      }
    },
    {
      path: '/cooperateAgreement',
      name: 'cooperateAgreement',
      component: cooperateAgreement,
      meta: { title: '协议' }
    }
  ]
})
