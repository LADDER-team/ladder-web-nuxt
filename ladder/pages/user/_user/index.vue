<template>
  <v-layout align-center justify-start column
            class="layout-my-page">
    <div class="my-page-wrap">
      <v-flex align-center justify-end layout
              class="my-page-avatar">
        <v-avatar :size="avatarSize" color="grey lighten-4">
          <img src="~assets/images/logo.png" alt="avatar">
        </v-avatar>
      </v-flex>
      <v-flex justify-start align-center>
        <h2 class="display-1">{{compUser}}</h2>
        <v-btn depressed ripple
               @click="unimplemented"
               class="primary-btn">
          プロフィールを編集
        </v-btn>
      </v-flex>
    </div>
    <v-tabs slot="extension"
            v-model="model"
            centered
            color="white"
            slider-color="blue"
            class="my-page-tabs">
      <v-tab href="#tab-1" class="my-page-tab">プロフィール</v-tab>
      <v-tab href="#tab-2" class="my-page-tab">投稿Ladder</v-tab>
    </v-tabs>
    <v-tabs-items v-model="model" class="my-page-tab-items">
      <v-tab-item id="tab-1" class="my-page-tab-item my-page-profile">
        <v-flex>
          <div>
            <h3 class="my-page-profile-title">自己紹介</h3>
            <p>これはプロフィールの例文になります！こんにちは！ここは{{compUser}}のマイページです！今後たくさんの機能が追加予定ですので楽しみにしていてくださいね！</p>
          </div>
        </v-flex>
      </v-tab-item>
      <v-tab-item id="tab-2" class="my-page-tab-item">
        <p v-show="!posted" class="my-page-not-ladder">投稿したLadderがありません</p>
        <v-flex align-start　justify-center
                class="ladder-links-wrap my-page-ladders-wrap">
          <div v-for="(ladder, index) in myLadderList" :key="index"
               class="ladder-link-wrap">
            <router-link :to="{path: `/detail`, query: {id: ladder.id}}"
                         class="ladder-link">
              <div class="ladder-thumb-wrap">
                <img :alt="defaultImage.alt"
                     src="~assets/images/ladder_avatar.png"
                     class="ladder-thumb">
              </div>
              <div class="ladder-info-wrap">
                <h2 class="ladder-link-title">{{ ladder.title }}</h2>
              </div>
            </router-link>
          </div>
        </v-flex>
      </v-tab-item>
    </v-tabs-items>
  </v-layout>
</template>

<script>
  import axios from 'axios'
  import {mapGetters} from 'vuex'

  export default {
    name: "MyPage",
    layout: 'engineer',
    scrollToTop: true,
    transitions: {
      name: 'page',
      mode: 'out-in'
    },
    data() {
      return {
        posted: false,
        avatarSize: 100,
        defaultUsername: 'ユーザー',
        model: 'tab-1',
        profile: '',
        defaultImage: {
          src: "http://via.placeholder.com/350x150",
          alt: "placeholder-image"
        },
        myLadderList: [],
      }
    },
    created() {
      const userIdParam = this.$route.params.user
      const userId = userIdParam ? userIdParam : 0
      axios({
        method: 'GET',
        url: 'https://api.ladder.noframeschools.com/api/users/' + userId + '/'
      }).then((response) => {
        this.myLadderList = response.data.my_ladders
        this.posted = response.data.my_ladders.length !== 0
      }).catch((error) => {
        console.log(error)
      })
    },
    methods: {
      unimplemented() {
        alert("機能実装をお待ちください！")
      },
    },
    computed: {
      compUser() {
        if (this.name) {
          return this.name
        } else {
          return this.defaultUsername
        }
      },
      ...mapGetters('user', {
        isLogin: 'loginGetter',
        name: 'nameGetter'
      })
    },
  }
</script>

<style scoped lang="sass">
  .my-page-wrap
    overflow: hidden
    display: flex
    flex-direction: row
    padding: 15px
    margin: 0 0 40px
    width: 100%
  .my-page-ladders-wrap
    width: 100%
    max-width: 500px !important
  .my-page-ladders-title
    padding: 20px
    background: #fff
    border-bottom: 1px solid $default_border_color
    text-align: center
    font-weight: normal
  .my-page-avatar
    margin: 0 40px 0 0
  .my-page-tab-items
    max-width: 500px
    width: 100%
    background-color: #fff
  .my-page-tab-item
    width: 100%
  .my-page-profile
    padding: 20px 40px
  .my-page-profile-title
    margin: 0 0 6px
    border-bottom: 1px solid $default_border_color
    font-weight: normal
  .my-page-not-ladder
    margin: 20px 0 0
    text-align: center

  .ladder-links-wrap
    display: inline-block
    &:last-child
      border-bottom: none
  .ladder-link
    display: flex
    justify-content: flex-start
    align-items: flex-start
    flex-direction: row
    padding: 10px 20px
    margin: 0
    background-color: #fff
    border-bottom: 1px solid $default_border_color
    width: 100%
    &:hover
      opacity: .7
  .ladder-info-wrap
    width: 100%
  .ladder-link-title
    margin: 0 0 10px
    width: 100%
    text-decoration: none
    font-size: 20px
    font-weight: normal
    color: #000
  .ladder-link-attach
    text-decoration: none
    text-align: right
    color: $default_tertiary_color
    font-size: 11px
    span
      font-size: 14px
      color: #000
      margin: 0 0 0 5px
  .ladder-thumb-wrap
    min-width: 50px
    width: 50px
    height: 50px
    margin: 0 20px 0 0
  .ladder-thumb
    max-width: 100%
    width: 100%
    height: 100%
</style>
