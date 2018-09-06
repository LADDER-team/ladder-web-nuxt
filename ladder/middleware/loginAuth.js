import jwt from 'jwt-decode'
import axios from 'axios'

let token = ""
let userDetail = []
let userId = ""

export default async ({store}) => {
  await login.getToken(store)
  await login.autoAuth()
}

const login = {
  async getToken(store) {
    token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjo2MSwidXNlcm5hbWUiOiJudXh0MkBuLmNvbSIsImV4cCI6MTUzNjIxMjc3MCwiZW1haWwiOiJudXh0MkBuLmNvbSJ9.0m5talkpxqtaGK9ejARydj4CO8RDNKt6fvCZlcvS5-k'
    if (token) {
    }else{
      console.log('have not token')
    }
  },
  async autoAuth() {
    userId = await this.tokenDecode()
    await this.getUser(userId)
  },
  async tokenDecode() {
    const decodedToken = await jwt(token);
    const userId = await decodedToken.user_id;
    return userId
  },
  getUser() {
    axios({
      method: 'GET',
      url: 'https://api.ladder.noframeschools.com/api/users/' + this.temporaryUserId + '/',
    }).then((response) => {
      userDetail = response.data
    }).then(() => {
      this.setUser()
    }).then(() => {
      if (store.state.isLogin) {
        store.commit('user/loginAction', true)
      }
    }).catch((error) => {
      console.log(error)
    })
  },
  setUser() {
    store.commit('user/addNameAction', userDetail.name)
    store.commit('user/addEmailAction', userDetail.email)
    store.commit('user/addUserIdAction', userDetail.userId)
  },
}
