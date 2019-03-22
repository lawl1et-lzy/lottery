
// initial state
const state = {
  sid: '',
  areaId: ''
}

// getters
const getters = {
}

// actions
const actions = {

}

// mutations
const mutations = {
  setSid (state, urlSid) {
    state.sid = urlSid;
    localStorage.setItem('sid',urlSid);
  },
  setAreaId(state, id) {
    state.areaId = id;
    localStorage.setItem('areaId',id);
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
