
// initial state
const state = {
  info: {},
  name:''
}

// getters
const getters = {

}

// actions
const actions = {

}

// mutations
const mutations = {
  updateBnakInfo(state, item) {
    state.info = {
      ...item
    }
  },
  updateBankName (state, name) {
    state.name = name
  },
  clearBnakInfo(state) {
    state.info = {}
    state.name = ''
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
