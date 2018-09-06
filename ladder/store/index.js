import Vue from 'vue'
import Vuex from 'vuex'
import client from './modules/client'
import user from './modules/user'

Vue.use(Vuex)

const store = () => new Vuex.Store({
  modules: {
    client,
    user
  }
})
export default store
