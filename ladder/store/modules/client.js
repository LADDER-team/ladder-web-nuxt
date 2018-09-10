const actions = {
  clientInit ({ commit, state, dispatch }, { req }) {
    if (localStorage.getItem('token')) {
      commit('user/accessTokenMutation', localStorage.getItem('token'))
    }
    if (localStorage.getItem('userId')) {
      const userId = parseInt(localStorage.getItem('userId'))
      commit('user/addUserIdMutation', userId)
    }
  }
}
export default{
  namespaced: false,
  actions
}
