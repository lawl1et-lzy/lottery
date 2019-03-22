
// initial state
import {api} from '../../public/api'
import { MessageBox } from 'mint-ui';
const state = {
  orderList: [],
  hotOrderList:[],
  orderMap:{},
  navList:[],
  total:[],
  type:[],
  isOpen: false,
  scrollState: false,
  childScrollState: false,
  scrollContentHeight: 400,
  isOver: false,
}

// getters
const getters = {
  money: (state) =>{
    let all = 0
    for (let item of state.orderList) {
      all += item.num * Number(item.price)
    }
    return all
  },
  totalNum: (state) =>{
    let all = 0
    for (let item of state.orderList) {
      all += item.num
    }
    return all
  },
}

// actions
const actions = {
  // 初始化 state 数据 外部调用
  async initLotteryData({dispatch ,commit, state}){
    try {
      let res = await api.request('mobile/Ticket/getTicketType')
      if (res.code == 0) {
        commit('updateTypeTotal',res.data)
        dispatch('updateLotteryData')
          .then((res)=>{
            dispatch('initListData')
          })
      } else {
        MessageBox.alert(res.msg)
      }
    } catch( err) {
      // MessageBox.alert('数据获取时发生错误，稍后请重试')
      console.log(err)
    }
  },
  // 内部使用 集中获取彩票列表
  async updateLotteryData({dispatch, commit, state}) {
    let promises = state.type.map(type => dispatch('getDataByType', type))
    let hotPromis = dispatch('getDataByType', "0")
    let results = [];
    for (let promise of promises) {
      results.push(await promise);
    }
    results.push(await hotPromis)
    return results
  },
  // 内部使用  初始化 列表 和 热销列表
  initListData({commit,state}) {
    commit('resetList')
    for(let key in state.orderMap) {
      if (key != 0) {
        commit('InitOrderList',state.orderMap[key])
      } else {
        commit('InithotOrderList',state.orderMap[key])
      }
    }
  },
  // 内部使用 获取列表
  async getDataByType({commit,state},payload) {
    try {
      let type = payload;
      let res = await api.request('mobile/wechat/get_ticket',{price: type})
      if(res.data) {
        for(let item of res.data) {
          item.type = type,
          item.num = 0
        }
        commit('setLotteryMapData',{type:type, data: res.data})
      } else {
        MessageBox.alert('获取数据失败')
      }
      return (res)
    } catch (err) {
      console.log(err)
    }
  },

  add({commit,getters,dispatch,state},item) {
    commit('changesIsOver', false)
    item.num ++;
    commit('updateOrderList',item)
    if (getters.money > state.total[state.total.length -1]) {
      MessageBox.alert(`每单固定金额${state.total.join('或')}元，请重新选择订单`)
      commit('changesIsOver', true)
      dispatch('minus', item)
    }
  },
  minus({commit},item) {
    if (item.num > 0) {
      item.num -= 1;
    } else {
      item.num = 0;
    }
    commit('updateOrderList',item)
  }
}

// mutations
const mutations = {

  //内部使用 设置type 和 total
  updateTypeTotal (state,payload) {
    state.type = [...payload.type];
    let index = state.type.findIndex(type => type == 0);
    if (index > -1) {
      state.type.splice(index, 1);
    }
    let arr = [];
    for (let item of state.type) {
      arr.push({type: item, active: false, num: 0})
    }
    arr[0].active = true;
    state.navList = arr;
    state.total = payload.total;
  },

  //内部使用 列表对象集合
  setLotteryMapData (state,payLoad) {
    state.orderMap[payLoad.type] = payLoad.data
  },
  // 购物车动画状态 外部调用
  changeOpen(state, status) {
    state.isOpen = status
  },

  // 重置列表 可外部调用
  resetList(state){
    state.orderList = [];
    state.hotOrderList = [];
  },
  // 设置 热销列表
  InithotOrderList(state,list) {
    state.hotOrderList = list
  },

  //设置 列表
  InitOrderList (state, list) {
    state.orderList = [...state.orderList,...list]
  },

  // 更新列表数据的num值
  updateOrderList(state,item={}) {
    let index = state.orderList.findIndex( lottery => lottery.id === item.id);
    let hotIndex = state.hotOrderList.findIndex( lottery => lottery.id === item.id);
    if (index <0 && hotIndex > -1) {
      state.orderList.push(item)
    } 
    // else {
    //   state.orderList[index].num = item.num;
    //   state.hotOrderList[hotIndex].num = item.num
    //}

    if(index>-1) {
      state.orderList[index].num = item.num;
    }

    if(hotIndex> -1) {
      state.hotOrderList[hotIndex].num = item.num
    }
    
    // 计算导航订单个数
    let navNumMap = {};
    for( let item of state.orderList) {
      if (navNumMap[item.type]) {
        navNumMap[item.type].push(item.num)
      } else {
        navNumMap[item.type] = [item.num]
      }
    }
    for(let key in navNumMap) {
      let nav =  state.navList.find(nav => nav.type === key)
      if (nav) {
        nav.num = 0
        for(let num of navNumMap[key]) {
          nav.num += num
        }
      }
    }
  },
  setHeight(state,height) {
    state.scrollContentHeight = height;
  },
  changeNav(state, item={}) {
    state.navList.map(nav=> nav.active = false)
    let activeNav = state.navList.find(nav =>nav.type === item.type)
    if (activeNav) {
      activeNav.active = true
    }
  },

  changeScrollState(state,status){
    state.scrollState = status
  },
  changeChildScrollState(state,status){
    state.childScrollState = status
  },

  changesIsOver(state,status) {
    state.isOver = status
  },

  //重置 列表的num值
  resetOrderList(state){
    state.orderList.map(item => item.num = 0)
    state.hotOrderList.map(item => item.num = 0)
    state.navList.map(item => item.num =0)
  },
}

export default {
  state,
  getters,
  actions,
  mutations
}
