const state = {
  sid: ''
}

const mutations = {
  setSid (state, sid) {
    state.sid = sid || ''
    localStorage.setItem('sid', sid)
  }
}

export default {
  state,
  mutations
}
