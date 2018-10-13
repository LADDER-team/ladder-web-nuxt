import 'babel-polyfill'

const initialState = {
  isLogin: false,
  email: null,
  name: null,
  token: null,
  userId: null
}
const state = {
  isLogin: false,
  email: null,
  name: null,
  token: null,
  userId: null
}
const getters = {
  EMAIL_GETTER(state) {
    return state.email
  },
  LOGIN_GETTER(state) {
    return state.isLogin
  },
  NAME_GETTER(state) {
    return state.name
  },
  TOKEN_GETTER(state) {
    return state.token
  },
  USER_ID_GETTER(state) {
    return state.userId
  }
}
const mutations = {
  ACCESS_TOKEN_MUTATION(state, token) {
    state.token = token
    localStorage.setItem('token', state.token)
  },
  ADD_EMAIL_MUTATION(state, payload) {
    state.email = payload.email
  },
  ADD_USER_MUTATION(state, payload) {
    state.name = payload.name
  },
  ADD_TOKEN_MUTATION(state, payload) {
    state.token = payload.token
    localStorage.setItem('token', state.token)
  },
  ADD_USER_ID_MUTATION(state, userId) {
    state.userId = userId
    if(state.userId){
      localStorage.setItem('userId', state.userId)
    }
  },
  LOGIN_EMAIL_MUTATION(state, payload) {
    state.email = payload.email
  },
  LOGIN_MUTATION(state, payload) {
    state.isLogin = payload.isLogin
  },
  LOGOUT_MUTATION(state) {
    state.isLogin = initialState.isLogin
    state.email = initialState.email
    state.name = initialState.name
    state.userId = initialState.userId
  }
}
const actions = {
  ADD_EMAIL_ACTION({commit}, email) {
    commit('ADD_EMAIL_MUTATION', {email})
  },
  ADD_NAME_ACTION({commit}, name) {
    commit('ADD_USER_MUTATION', {name})
  },
  ADD_TOKEN_ACTION({commit}, token) {
    commit('ADD_TOKEN_MUTATION', {token})
  },
  ADD_USER_ACTION({commit}, userId) {
    commit('ADD_USER_ID_MUTATION', userId)
  },
  LOGIN_ACTION({commit}, isLogin) {
    commit('LOGIN_MUTATION', {isLogin})
  },
  LOGIN_EMAIL_ACTION({commit}, email) {
    commit('LOGIN_EMAIL_MUTATION', {email})
  },
  LOGOUT_ACTION({commit}){
    commit('LOGOUT_MUTATION')
  }
}
export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
