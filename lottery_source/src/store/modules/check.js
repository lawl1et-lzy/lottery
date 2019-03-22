
// initial state
import {api} from '../../public/api'
import { MessageBox } from 'mint-ui';
const state = {
  currentPage: 'undone',
  undone: {
    list: [],
    params: {
      identity: 'manager',
      pageIndex: 1,
      entryNum: 20,
      type: 'undone',
    },
    paramsIndex: 0,
    empty: true,
    noMore: true,
  },
  done: {
    list: [],
    params: {
      identity: 'manager',
      pageIndex: 1,
      entryNum: 20,
      type: 'done',
    },
    paramsIndex: 0,
    empty: true,
    noMore: true,
  },
  refuse: {
    list: [],
    params: {
      identity: 'manager',
      pageIndex: 1,
      entryNum: 20,
      type: 'refuse',
    },
    paramsIndex: 0,
    empty: true,
    noMore: true,
  },
  isLoading: false,
}

// getters
const getters = {
  isEmpty: (state) =>{
    return state[state.currentPage].empty
  },
  noMore: (state) => {
    return state[state.currentPage].noMore
  }
}

// actions
const actions = {
  updateData({commit, state}) {
    let params = state[state.currentPage].params
    if (state[state.currentPage].paramsIndex === params.pageIndex) {
      return
    }
    commit('updateParamsIndex')
    commit('isLoading', true)
    api.request('mobile/Audit/audit_', params)
      .then(res => {
        if(res.code == 0) {
          let list = res.data.lists
          commit('updateList',{type:state.currentPage, list})
          if(state[state.currentPage].list.length >= res.data.length) {
            commit('noMore', true)
          } else {
            commit('noMore', false)
          }
          commit('isEmpty')
        } else {
          MessageBox.alert(res.msg,'')
        }
      })
      .catch(err => {
        console.log(err)
      })
      .then(()=>{
        commit('isLoading', false)
      })
  },
  loadMore({dispatch, commit}) {
    commit('noMore', true)
    commit('updateParams')
    dispatch('updateData')
  }
}

// mutations
const mutations = {
  initCheckState(state) {
    state.undone = Object.assign(state.undone, {
      list: [],
      params: {
        identity: 'manager',
        pageIndex: 1,
        entryNum: 20,
        type: 'undone',
      },
      paramsIndex: 0,
      empty: true,
      noMore: true,
    })
    state.done = Object.assign(state.done, {
      list: [],
      params: {
        identity: 'manager',
        pageIndex: 1,
        entryNum: 5,
        type: 'done',
      },
      paramsIndex: 0,
      empty: true,
      noMore: true,
    })
    state.refuse= Object.assign(state.refuse, {
      list: [],
      params: {
        identity: 'manager',
        pageIndex: 1,
        entryNum: 20,
        type: 'refuse',
      },
      paramsIndex: 0,
      empty: true,
      noMore: true,
    })
  },
  isEmpty(state) {
    state[state.currentPage].empty = state[state.currentPage].list.length ? false : true
  },
  noMore (state,status) {
    state[state.currentPage].noMore = status
  },
  isLoading (state,status) {
    state.isLoading = status
  },
  updateParamsIndex (state) {
    state[state.currentPage].paramsIndex = state[state.currentPage].params.pageIndex
  },
  changeActive (state, active) {
    state.currentPage = active
  },
  updateParams (state) {
    state[state.currentPage].params.pageIndex ++
  },
  updateList (state,Payload) {
    state[Payload.type].list = [...state[Payload.type].list, ...Payload.list]
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
