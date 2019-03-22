import {api} from "../../public/api"
const state = {
  address: {
    province: '',
    city: '',
    area: '',
    street: ''
  }
}

const getters = {
}
const actions = {
  async getDistricts({dispatch, commit}, {type, code}) { // type: 请求地区类型  code: 请求地区id
    let localStorage_type = localStorage.getItem(type) ? JSON.parse(localStorage.getItem(type)) : []
    // 判断localStorage 是否有这类型的值
    if(localStorage_type.length > 0) {
      // 判断查询的code是否已经存在
      let index = Object.keys(localStorage_type[0]).findIndex(key => {
        return key == code
      })
      // 1.code不存在
      if(index === -1){
        // 请求地区数据
        let res = await dispatch('handleGetDistricts', {type, code})
        commit('add', {type, code, res})
      } else {
        // 更新Store数据
        let value = localStorage_type[0][code] // 取出 localStorage 数据
        commit('update', {type, value})
      }
    } else {
      // 请求地区数据
      let res = await dispatch('handleGetDistricts', {type, code})
      commit('add', {type, code, res})
    }
  },
  // 获取各级数据
  async handleGetDistricts({dispatch, commit}, {type, code}) {
    try{
      let res = await api.request('public/common/getAreaInfoJsonData', {type: type, area_code: code})
      if(res.data && res.code === 0){
        return res.data
      }else{
        return []
      }
    }
    catch (e) {
      console.log(e)
    }
  }
}

const mutations = {
  // 新增数据
  add(state, {type, code, res}) {
    // state赋值
    state.address[type] = res
    // 新增localstorage数据
    let ls_val = localStorage.getItem(type) ? JSON.parse(localStorage.getItem(type)) : []
    if(ls_val.length > 0){
      ls_val[0][code] = res
    } else {
      let obj = {}
      obj[code] = res
      ls_val.push(obj)
    }
    localStorage.setItem(type, JSON.stringify(ls_val))
  },
  // 更新数据
  update (state, {type, value}){
    state.address[type] = value
  },
  // 删除数据
  clear (state, type){
    switch (type) {
      case 'province':
        state.address.city = []
        state.address.area = []
        state.address.street = []
        break;
      case 'city':
        state.address.area = []
        state.address.street = []
        break;
      case 'area':
        state.address.street = []
        break;
    }
  },
}

export default {
  state,
  getters,
  actions,
  mutations
}