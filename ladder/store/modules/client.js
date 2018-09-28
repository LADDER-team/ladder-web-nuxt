import jwt from 'jwt-decode'

const actions = {
  clientInit({commit, state, dispatch}, {req}) {
    if (localStorage.token) {
      commit('user/ACCESS_TOKEN_MUTATION', localStorage.token)
    }
    if (localStorage.userId) {
      const userId = parseInt(localStorage.userId)
      commit('user/ADD_USER_ID_MUTATION', userId)
    }
    if (!localStorage.userId && localStorage.token) {
      const decodedToken = jwt(localStorage.token);
      const decodedId = decodedToken.user_id;
      commit('user/ADD_USER_ID_MUTATION', decodedId)
    }
  }
}
export default {
  namespaced: false,
  actions
}
