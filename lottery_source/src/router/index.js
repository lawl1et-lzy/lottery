import Vue from 'vue'
import Router from 'vue-router'
import Register from '@/layout/register'
import shopzc from '@/layout/shopzc'
import cooperateAgreement from '@/components/agreements/agreements'
import shopImg from '@/layout/shopzc-img'
import shopinfo from '@/layout/shopinfo'
import bindBank from '@/layout/bind-bank'
// import question from '@/components/questions'
import managerzc from '@/layout/managerzc'
import managerinfo from '@/layout/managerinfo'

import FAQ from '@/layout/question/question'
import answer from '@/layout/question/answer'

import shopOperation from '@/shop-operation/shop-operation'
import shopPage from '@/shop-operation/page'
import shopPoint from '@/shop-operation/shop-point'

import managerOperation from '@/manager-operation/manager-operation'
import managerPage from '@/manager-operation/page'
import oneOrder from '@/manager-operation/manager-oneorder'


Vue.use(Router)

export const router =  new Router({
  routes: [
    { 
      path: '/', 
      redirect: '/shopzc-img' 
    },
    {
      path: '/register',
      name: 'Register',
      component: Register,
      redirect: '/shopzc-img',
      children: [
        {
          path: '/shopzc-img',
          name: 'shopzcImg',
          component: shopImg,
          meta: { title: '零售店注册' }
        },
        {
          path: '/shopzc',
          name: 'shopzc',
          component: shopzc,
          meta: { title: '零售店注册'},
        },
        {
          path: '/cooperateAgreement',
          name: 'cooperateAgreement',
          component: cooperateAgreement,
          meta: { title: '协议' },
        },
      ]
    },
    {
      path: '/shopinfo',
      name: 'shopinfo',
      component: shopinfo,
      meta: { title: '零售店信息' }
    },
    {
      path: '/bind-bank',
      name: 'bind-bank',
      component: bindBank,
      meta: { title: '银行卡绑定' },
    },
    // {
    //   path: '/question/14',
    //   name: 'hunanQuestion',
    //   component: question.hunan,
    //   meta: { title: '公益彩专卖申请' },
    // },
    // {
    //   path: '/question/7',
    //   name: 'guangxiQuestion',
    //   component: question.guangxi,
    //   meta: { title: '公益彩专卖申请' },
    // },
    {
      path: '/managerzc',
      name: 'managerzc',
      component: managerzc,
      meta: { title: '客户经理注册' }
    },
    {
      path: '/managerinfo',
      name: 'managerinfo',
      component: managerinfo,
      meta: { title: '客户经理信息' }
    },
    {
      path: '/pay-order',
      name: 'payOrder',
      component: shopPage.payOrder,
      meta: { title: '订单支付' }
    },
    {
      path: '/bank-list',
      name: 'bankList',
      component: shopPage.bankList,
      meta: { title: '银行卡' }
    },
    {
      path: '/add-bank',
      name: 'addBank',
      component: shopPage.addBank,
      meta: { title: '添加银行卡' }
    },
    {
      path: '/bank-agreement',
      name: 'agreement',
      component: shopPage.agreement,
      meta: { title: '添加银行卡' }
    },
    {
      path: '/verify',
      name: 'verify',
      component: shopPage.verify,
      meta: { title: '添加银行卡' }
    },
    {
      path: '/pay-result',
      name: 'payResult',
      component: shopPage.payComplete,
      meta: { title: '支付结果' }
    },
    {
      path:'/shop-operation',
      name: 'shop-operation',
      component:shopOperation,
      children: [
        {
          path:'/lottery',
          name: 'lottery',
          component:shopPage.lottery,
          meta: { title: '申领公益彩' }
        },
        {
          path:'/rank-list',
          name: 'rank',
          component:shopPage.rank,
          meta: { title: '销售排行榜' }
        },
        {
          path:'/lottery-order',
          name: 'order',
          component:shopPage.lotteryOrder,
          meta: { title: '订单' }
        },
        {
          path:'/device',
          name: 'device',
          component:shopPage.device,
          meta: { title: '自助彩票机信息' }
        },
        {
          path:'/me',
          name: 'me',
          component:shopPage.me,
          meta: { title: '我的' }
        },
      ]
    },
    {
      path: '/shop-point',
      name: 'shopPoint',
      component: shopPoint,
      meta: { title: '我的公益分' }
    },
    {
      path: '/manager-operation',
      name: 'managerOperation',
      component: managerOperation,
      children: [
        {
          path:'/manager-point',
          name: 'point',
          component: managerPage.point,
          meta: { title: '公益分' }
        },
        {
          path:'/manager-order',
          name: 'managerOrder',
          component: managerPage.order,
          meta: { title: '订单' }
        },
        {
          path:'/manager-review',
          name: 'review',
          component:managerPage.review,
          meta: { title: '审核' }
        },
        {
          path:'/my-manager',
          name: 'myManager',
          component:managerPage.me,
          meta: { title: '审核' }
        },
      ]
    },
    {
      path:'/manager-oneorder',
      name: 'oneOrder',
      component: oneOrder,
      meta: { title: '订单信息' }
    },
    {
      path: '/review-info',
      name: 'reviewInfo',
      component: managerPage.reviewInfo,
      meta: { title: '审核详细信息' }
    },
    {
      path: '/faq',
      name: 'faq',
      component: FAQ,
      meta: { title: '常见问题' }
    },
    {
      path: '/answer',
      name: 'answer',
      component: answer,
      meta: { title: '常见问题' }
    },
  ]
});

router.beforeEach((to,from,next) => {
  let sid = from.query.sid;
  if (sid) {
    to.query['sid'] = sid;
  }
  next();
})
router.afterEach((to, from) => {
  let titleEle =  document.getElementsByTagName('title')[0];
  let title = (to.meta && to.meta.title) ? to.meta.title : '中维';
  titleEle.innerHTML = title;
})




