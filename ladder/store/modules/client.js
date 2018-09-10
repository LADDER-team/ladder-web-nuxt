import jwt from 'jwt-decode'

const actions = {
  clientInit({commit, state, dispatch}, {req}) {
    if (localStorage.token) {
      commit('user/accessTokenMutation', localStorage.token)
    }
    if (localStorage.userId) {
      const userId = parseInt(localStorage.userId)
      commit('user/addUserIdMutation', userId)
    }
    if (!localStorage.userId && localStorage.token) {
      const decodedToken = jwt(localStorage.token);
      const decodedId = decodedToken.user_id;
      commit('user/addUserIdMutation', decodedId)
    }
  }
}
export default {
  namespaced: false,
  actions
}
