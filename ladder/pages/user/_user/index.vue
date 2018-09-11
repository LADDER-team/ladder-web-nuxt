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
    <v-tabs-items md8 v-model="model" class="my-page-tab-items">
      <v-tab-item id="tab-1" class="my-page-tab-item my-page-profile">
        <v-flex>
          <div>
            <h3 class="my-page-profile-title">自己紹介</h3>
            <p>これはプロフィールの例文になります！<br/>こんにちは！ここは{{compUser}}のマイページです！今後、たくさんの機能が追加予定ですのでお楽しみに！</p>
          </div>
        </v-flex>
      </v-tab-item>
      <v-tab-item md8 id="tab-2" class="my-page-tab-item">
        <p v-show="!posted" class="my-page-not-ladder">投稿したLadderがありません</p>
        <v-flex align-start　justify-center
                class="ladder-links-wrap my-page-ladders-wrap">
          <div v-for="(ladder, index) in myLadderList" :key="index"
               class="ladder-link-wrap">
            <ladder-list-item :ladderId="ladder.id"
                              :title="ladder.title"/>
          </div>
        </v-flex>
      </v-tab-item>
    </v-tabs-items>
  </v-layout>
</template>

<script>
  import axios from 'axios'
  import {mapGetters} from 'vuex'
  import LadderListItem from '~/components/LadderListItem'

  export default {
    name: "MyPage",
    layout: 'engineer',
    scrollToTop: true,
    transitions: {
      name: 'page',
      mode: 'out-in'
    },
    data: () => ({
      posted: false,
      avatarSize: 100,
      defaultUsername: '',
      model: 'tab-1',
      profile: '',
      defaultImage: {
        src: "http://via.placeholder.com/350x150",
        alt: "placeholder-image"
      },
      myLadderList: [],
    }),
    head() {
      return {
        title: 'MyPage'
      }
    },
    components: {
      LadderListItem
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
    max-width: 600px !important
  .my-page-ladders-title
    padding: 20px
    background: #fff
    border-bottom: 1px solid $default_border_color
    text-align: center
    font-weight: normal
  .my-page-avatar
    margin: 0 40px 0 0
  .my-page-tab-items
    max-width: 600px
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
</style>
