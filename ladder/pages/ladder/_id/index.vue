<template>
  <v-layout align-center justify-start column
            class="layout-ladder-management">
    <v-tabs slot="extension"
            v-model="model"
            centered
            color="white"
            slider-color="blue"
            class="my-page-tabs">
      <v-tab href="#tab-1" class="my-page-tab">投稿 Ladder</v-tab>
      <v-tab href="#tab-2" class="my-page-tab">学習中 Ladder</v-tab>
      <v-tab href="#tab-3" class="my-page-tab">学習済 Ladder</v-tab>
    </v-tabs>
    <v-tabs-items v-model="model" class="my-page-tab-items">
      <v-tab-item id="tab-1" class="my-page-tab-item">
        <p v-show="!myLadderList.length" class="my-page-not-ladder">投稿したLadderがありません</p>
        <v-flex align-start　justify-center
                class="ladder-links-wrap my-page-ladders-wrap">
          <div v-for="(ladder, index) in myLadderList" :key="index"
               class="ladder-link-wrap">
            <ladder-list-item :ladderId="ladder.id"
                              :title="ladder.title"
                              :manage="true"
                              :isPublic="ladder.is_public"
                              @publish-emit="getMyLadders"/>
          </div>
        </v-flex>
      </v-tab-item>
      <v-tab-item id="tab-2" class="my-page-tab-item">
        <p v-show="!learningLadderList.length" class="my-page-not-ladder">学習中のLadderがありません</p>
        <v-flex md8 align-start　justify-center
                class="ladder-links-wrap my-page-ladders-wrap">
          <div v-for="(ladder, index) in learningLadderList" :key="index"
               class="ladder-link-wrap">
            <ladder-list-item :ladderId="ladder.id"
                              :title="ladder.title"/>
          </div>
        </v-flex>
      </v-tab-item>
      <v-tab-item id="tab-3" class="my-page-tab-item">
        <p v-show="!finishLadderList.length" class="my-page-not-ladder">学習済みのLadderがありません</p>
        <v-flex align-start　justify-center
                class="ladder-links-wrap my-page-ladders-wrap">
          <div v-for="(ladder, index) in finishLadderList" :key="index"
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
    name: "LadderManagementPage",
    layout: 'engineer',
    scrollToTop: true,
    transitions: {
      name: 'page',
      mode: 'out-in'
    },
    data: () => ({
      posted: false,
      avatarSize: 100,
      defaultUsername: 'ユーザー',
      model: 'tab-1',
      profile: '',
      defaultImage: {
        src: "http://via.placeholder.com/350x150",
        alt: "placeholder-image"
      },
      learningLadderList: [],
      myLadderList: [],
      finishLadderList: []
    }),
    head() {
      return {
        title: 'Ladder-Manage'
      }
    },
    components: {
      LadderListItem
    },
    created() {
      this.getFinishLadders()
      this.getLearningLadders()
      this.getMyLadders()
    },
    methods: {
      unimplemented() {
        alert("機能搭載までお待ちください！")
      },
      getFinishLadders() {
        axios({
          method: 'GET',
          url: 'http://127.0.0.1:8080/api/users/' + this.userId + '/finish-ladder/'
        }).then((response) => {
          this.finishLadderList = response.data
        }).catch((error) => {
          console.log(error)
        })
      },
      getLearningLadders() {
        axios({
          method: 'GET',
          url: 'http://127.0.0.1:8080/api/users/' + this.userId + '/learning-ladder/'
        }).then((response) => {
          this.learningLadderList = response.data
        }).catch((error) => {
          console.log(error)
        })
      },
      getMyLadders() {
        axios({
          method: 'GET',
          url: 'http://127.0.0.1:8080/api/users/' + this.userId + '/'
        }).then((response) => {
          this.myLadderList = response.data.my_ladders
        }).catch((error) => {
          console.log(error)
        })
      }
    },
    computed: {
      ...mapGetters('user', {
        isLogin: 'loginGetter',
        userId: 'userIdGetter',
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
    max-width: 650px !important
  .my-page-ladders-title
    padding: 20px
    background: #fff
    border-bottom: 1px solid $default_border_color
    text-align: center
    font-weight: normal
  .my-page-avatar
    margin: 0 40px 0 0
  .my-page-tab-items
    max-width: 650px
    width: 100%
    height: 100%
  .my-page-tab-item
    overflow: scroll
    width: 100%
    height: 80%
  .my-page-profile
    padding: 20px 40px
  .my-page-profile-title
    margin: 0 0 6px
    border-bottom: 1px solid $default_border_color
    font-weight: normal
  .my-page-not-ladder
    padding: 28px 0
    background-color: #fff
    text-align: center
  .ladder-links-wrap
    display: inline-block
    &:last-child
      border-bottom: none
</style>
