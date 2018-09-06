const actions = {
  clientInit ({ commit, state, dispatch }, { req }) {
    if (localStorage.getItem('token')) {
      commit('user/accessTokenMutation', localStorage.getItem('token'))
    }
  }
}
export default{
  namespaced: false,
  actions
}
