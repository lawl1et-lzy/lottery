import {api} from '@/public/api'
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
  /**
   * @method getDistricts
   * @param {String} type 请求地区类型 => ['province', 'city', 'area', 'street']
   * @param {Number} code 请求地区id
   */
  async getDistricts ({dispatch, commit}, {type, code}) {
    if (!(type && code.toString())) {
      return
    }
    // 获取 localStorage 类型为 type 的所有数据
    let typeData = localStorage.getItem(type) ? JSON.parse(localStorage.getItem(type)) : []
    // 判断 localStorage 是否有值
    if (typeData.length > 0) {
      // 判断查询的code是否已经存在
      let index = Object.keys(typeData[0]).findIndex(key => {
        return key === code
      })
      // code不存在
      if (index === -1) {
        // 请求地区数据
        let res = await dispatch('handleGetDistricts', {type, code})
        if (res) {
          commit('add', {type, code, res})
        }
      } else {
        // 更新 state 数据
        let value = typeData[0][code] // 取出 localStorage 数据
        commit('update', {type, value})
      }
    } else {
      // 请求地区数据
      let res = await dispatch('handleGetDistricts', {type, code})
      if (res) {
        commit('add', {type, code, res})
      }
    }
  },
  /**
   * @method handleGetDistricts
   * @param {String} type 请求地区类型 => ['province', 'city', 'area', 'street']
   * @param {Number} code 请求地区id
   * @return {Array} 返回请求数据
   */
  async handleGetDistricts ({dispatch, commit}, {type, code}) {
    try {
      let res = await api.request('/public/common/getAreaInfoJsonData', {type: type, area_code: code})
      if (res.data && res.code === 0) {
        return res.data
      } else {
        return null
      }
    } catch (e) {
      console.log('地区数据获取失败，请检查', e)
    }
  }
}

const mutations = {
  /**
   * @method add
   * @param {String} type 请求地区类型 => ['province', 'city', 'area', 'street']
   * @param {Number} code 请求地区id
   * @param {Array} res 数组数据
   */
  add (state, {type, code, res}) {
    // state赋值
    state.address[type] = res
    // 新增localstorage数据
    let lsVal = localStorage.getItem(type) ? JSON.parse(localStorage.getItem(type)) : []
    if (lsVal.length > 0) {
      lsVal[0][code] = res
    } else {
      let obj = {}
      obj[code] = res
      lsVal.push(obj)
    }
    localStorage.setItem(type, JSON.stringify(lsVal))
  },
  /**
   * @method update
   * @param {String} type 请求地区类型 => ['province', 'city', 'area', 'street']
   * @param {Array} value 数据
   */
  update (state, {type, value}) {
    state.address[type] = value
  },
  /**
   * @method clear 当重新选择的时候，清除下级数据，用于处理数据闪烁问题
   * @param {String} type 请求地区类型 => ['province', 'city', 'area', 'street']
   */
  clear (state, type) {
    switch (type) {
      case 'province':
        state.address.city = []
        state.address.area = []
        state.address.street = []
        break
      case 'city':
        state.address.area = []
        state.address.street = []
        break
      case 'area':
        state.address.street = []
        break
    }
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
