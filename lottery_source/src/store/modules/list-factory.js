import {api} from '../../public/api'
export class listFactory {
  constructor(options) {
    this.namespaced = true
    this.options = options
    this.state = {}
    this.getters = {}
    this.actions = {}
    this.mutations = {}
  }
  /* 
    options = {
      nav:[],
      service: '',
      params:{},
      navType: ''
    }
  */
  initState(options) {
    const state = {
      ...options.state
    }
    state['currentPage'] = options.nav[0]
    for(let nav of options.nav) {
      state[nav] = {
        list: [],
        params: {
          ...options.params,
          pageIndex:1,
          entryNum: 20,
          [options.navType]: nav
        },
        paramsIndex: 0,
        empty: true,
        noMore: true,
      }
    }
    state.isLoading = false
    return state
  }

  initgetters(state,options) {
    const getters = {
      ...options.getters,
      isEmpty: (state) =>{
        return state[state.currentPage].empty
      },
      noMore: (state) => {
        return state[state.currentPage].noMore
      }
    }
    return getters
  }

  initactions(state,options) {
    const actions = {
      ...options.actions,
      updateData({commit,state}) {
        let params = state[state.currentPage].params
        if (state[state.currentPage].paramsIndex === params.pageIndex) {
          return
        }
        commit('updateParamsIndex')
        commit('isLoading', true)
        api.request(options.service, params)
          .then(res => {
            let list = res.data.lists
            commit('updateList',{type:state.currentPage, list})
            if(state[state.currentPage].list.length >= res.data.length) {
              commit('noMore', true)
            } else {
              commit('noMore', false)
            }
            commit('isEmpty')
          })
          .catch(err => {
    
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

    return actions
  }

  initmutations(state,options) {
    let that = this
    const mutations = {
      ...options.mutations,
      initdata(state){
        let  resetState = that.initState(that.options)
        state = Object.assign(state,resetState)
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
    return mutations
  }

  creatStore() {
    this.state = this.initState(this.options)
    this.getters = this.initgetters(this.state,this.options)
    this.actions = this.initactions(this.state,this.options)
    this.mutations = this.initmutations(this.state,this.options)
  }
}