import 'babel-polyfill'

const initialState = {
  isLogin: false,
  isSign: false,
  email: null,
  name: null,
  token: null,
  userId: null
}
const state = {
  isLogin: false,
  isSign: false,
  email: null,
  name: null,
  token: null,
  userId: null
}
const getters = {
  emailGetter(state) {
    return state.email
  },
  loginGetter(state) {
    return state.isLogin
  },
  nameGetter(state) {
    return state.name
  },
  signGetter(state) {
    return state.isSign
  },
  tokenGetter(state) {
    return state.token
  },
  userIdGetter(state) {
    return state.userId
  }
}
const mutations = {
  accessTokenMutation(state, token) {
    state.token = token
    localStorage.setItem('token', state.token)
  },
  addEmailMutation(state, payload) {
    state.email = payload.email
  },
  addUserMutation(state, payload) {
    state.name = payload.name
  },
  addTokenMutation(state, payload) {
    state.token = payload.token
    localStorage.setItem('token', state.token)
  },
  addUserIdMutation(state, userId) {
    state.userId = userId
    if(state.userId){
      localStorage.setItem('userId', state.userId)
    }
  },
  loginEmailMutation(state, payload) {
    state.email = payload.email
  },
  loginMutation(state, payload) {
    state.isLogin = payload.isLogin
  },
  signMutation(state, payload) {
    state.isSign = payload.isSign
  },
  logoutMutation(state) {
    state.isLogin = initialState.isLogin
    state.isSign = initialState.isSign
    state.email = initialState.email
    state.name = initialState.name
    state.userId = initialState.userId
  }
}
const actions = {
  addEmailAction({commit}, email) {
    commit('addEmailMutation', {email})
  },
  addNameAction({commit}, name) {
    commit('addUserMutation', {name})
  },
  addTokenAction({commit}, token) {
    commit('addTokenMutation', {token})
  },
  addUserIdAction({commit}, userId) {
    commit('addUserIdMutation', userId)
  },
  signAction({commit}, isSign) {
    commit('signMutation', {isSign})
  },
  loginAction({commit}, isLogin) {
    commit('loginMutation', {isLogin})
  },
  loginEmailAction({commit}, email) {
    commit('loginEmailMutation', {email})
  },
  logoutAction({commit}){
    commit('logoutMutation')
  }
}
export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
