<template>
  <v-layout align-center justify-start column
            class="layout-manage">
    <v-tabs slot="extension"
            v-model="model"
            centered
            color="white"
            slider-color="blue"
            class="manage-tabs">
      <v-tab href="#tab-1" class="manage-tab">投稿 Ladder</v-tab>
      <v-tab href="#tab-2" class="manage-tab">学習中 Ladder</v-tab>
      <v-tab href="#tab-3" class="manage-tab">学習済 Ladder</v-tab>
    </v-tabs>
    <v-tabs-items v-model="model" class="manage-tab-items">
      <v-tab-item id="tab-1" class="manage-tab-item">
        <p v-show="!myLadderList.length" class="manage-not-ladder">投稿したLadderがありません</p>
        <v-flex align-start　justify-center
                class="ladder-links-wrap manage-ladders-wrap">
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
      <v-tab-item id="tab-2" class="manage-tab-item">
        <p v-show="!learningLadderList.length" class="manage-not-ladder">学習中のLadderがありません</p>
        <v-flex md8 align-start　justify-center
                class="ladder-links-wrap manage-ladders-wrap">
          <div v-for="(ladder, index) in learningLadderList" :key="index"
               class="ladder-link-wrap">
            <ladder-list-item :ladderId="ladder.id"
                              :title="ladder.title"/>
          </div>
        </v-flex>
      </v-tab-item>
      <v-tab-item id="tab-3" class="manage-tab-item">
        <p v-show="!finishLadderList.length" class="manage-not-ladder">学習済みのLadderがありません</p>
        <v-flex align-start　justify-center
                class="ladder-links-wrap manage-ladders-wrap">
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
        if(this.userId) {
          axios({
            method: 'GET',
            url: 'http://localhost:8080/api/users/' + this.userId + '/finish-ladder/'
          }).then((response) => {
            this.finishLadderList = response.data
          }).catch((error) => {
            console.log(error)
          })
        }
      },
      getLearningLadders() {
        if(this.userId) {
          axios({
            method: 'GET',
            url: 'http://localhost:8080/api/users/' + this.userId + '/learning-ladder/'
          }).then((response) => {
            this.learningLadderList = response.data
          }).catch((error) => {
            console.log(error)
          })
        }
      },
      getMyLadders() {
        if(this.userId) {
          axios({
            method: 'GET',
            url: 'http://localhost:8080/api/users/' + this.userId + '/'
          }).then((response) => {
            this.myLadderList = response.data.my_ladders
            console.log(this.myLadderList)
          }).catch((error) => {
            console.log(error)
          })
        }
      }
    },
    computed: {
      ...mapGetters('user', {
        isLogin: 'LOGIN_GETTER',
        userId: 'USER_ID_GETTER',
      })
    },
  }
</script>
<style scoped lang="sass">
  .manage-wrap
    overflow: hidden
    display: flex
    flex-direction: row
    padding: 15px
    margin: 0 0 40px
    width: 100%

  .manage-ladders-wrap
    width: 100%
    max-width: 650px !important

  .manage-ladders-title
    padding: 20px
    background: #fff
    border-bottom: 1px solid $default_border_color
    text-align: center
    font-weight: normal

  .manage-avatar
    margin: 0 40px 0 0

  .manage-tab-items
    max-width: 600px
    width: 100%
    height: 100%

  .manage-tab-item
    overflow: scroll
    width: 100%
    height: 80%

  .manage-profile
    padding: 20px 40px

  .manage-profile-title
    margin: 0 0 6px
    border-bottom: 1px solid $default_border_color
    font-weight: normal

  .manage-not-ladder
    padding: 28px 0
    background-color: #fff
    text-align: center

  .ladder-links-wrap
    display: inline-block
    &:last-child
      border-bottom: none

</style>
