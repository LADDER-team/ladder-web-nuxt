<template>
  <v-layout align-center justify-start column
            class="layout-user-page">
    <div class="user-page-wrap">
      <v-flex align-center justify-end layout
              class="user-page-avatar">
        <v-avatar :size="avatarSize" color="grey lighten-4">
          <img src="~assets/images/logo.png" alt="avatar">
        </v-avatar>
      </v-flex>
      <v-flex justify-start align-center>
        <h2 class="display-1">{{userDetailList.name}}</h2>
        <v-dialog v-model="dialog"
                  persistent
                  max-width="600">
          <v-btn slot="activator"
                 depressed ripple
                 class="primary-btn">
            プロフィールを編集
          </v-btn>
          <v-card>
            <v-card-title>
              <span class="headline">ユーザログイン</span>
            </v-card-title>
            <v-card-text>
              <v-container grid-list-md>
                <v-layout wrap>
                  <v-form lazy-validation
                          ref="form"
                          v-model="valid"
                          class="user-edit-form">
                    <v-text-field
                      v-model="modelName"
                      :rules="nameRules"
                      prepend-icon="person"
                      ref="nameRef"
                      label="ニックネーム"
                      required></v-text-field>
                    <v-textarea
                      v-model="modelProfile"
                      :counter="250"
                      :rules="[v => !!v || '学べることを入力してください',
                         v => v.length <= 200 || '学べることは200字以内で入力してください']"
                      label="自己紹介"
                      required></v-textarea>
                  </v-form>
                </v-layout>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn flat color="blue darken-1" @click="dialog=false">キャンセル
              </v-btn>
              <v-btn flat color="blue darken-1"
                     @click="editProfile"
                     :disabled="!valid">変更する
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-flex>
    </div>
    <v-tabs slot="extension"
            v-model="model"
            centered
            color="white"
            slider-color="blue"
            class="user-page-tabs">
      <v-tab href="#tab-1" class="user-page-tab">プロフィール</v-tab>
      <v-tab href="#tab-2" class="user-page-tab">投稿Ladder</v-tab>
    </v-tabs>
    <v-tabs-items md8 v-model="model" class="user-page-tab-items">
      <v-tab-item id="tab-1" class="user-page-tab-item user-page-profile">
        <v-flex>
          <div>
            <h3 class="user-page-profile-title">自己紹介</h3>
            <p>{{userDetailList.profile}}</p>
          </div>
        </v-flex>
      </v-tab-item>
      <v-tab-item md8 id="tab-2" class="user-page-tab-item">
        <p v-show="!posted" class="user-page-not-ladder">投稿したLadderがありません</p>
        <v-flex align-start　justify-center
                class="ladder-links-wrap user-page-ladders-wrap">
          <div v-for="(ladder, index) in userDetailList.my_ladders" :key="index"
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
    name: "user-page",
    layout: 'engineer',
    scrollToTop: true,
    transitions: {
      name: 'page',
      mode: 'out-in'
    },
    data: () => ({
      dialog: false,
      posted: false,
      avatarSize: 100,
      defaultName: '',
      model: 'tab-1',
      profile: '',
      defaultImage: {
        src: "http://via.placeholder.com/350x150",
        alt: "placeholder-image"
      },
      userDetailList: [],
      //validation
      valid: false,
      modelName: "",
      nameRules: [v => !!v || '名前を入力してください'],
      modelProfile: "",
    }),
    head() {
      return {
        title: 'User-Page'
      }
    },
    components: {
      LadderListItem
    },
    beforeMount() {
      this.getUserDetail()
    },
    methods: {
      editProfile() {
        const userId = this.userId ? this.userId : 0

        if (this.$refs.form.validate()) {
          axios({
            method: 'PATCH',
            url: 'http://localhost:8080/api/users/' + userId + '/',
            headers: {
              "Authorization": "JWT " + this.token,
              "Content-type": "application/json"
            },
            data: {
              name: this.modelName,
              profile: this.modelProfile,
            }
          }).then(() => {
            this.getUserDetail()
          })
            .catch((error) => {
            alert('プロフィール情報の変更に失敗しました!')
            console.log(error)
          })
        }
        this.dialog = false
      },
      getUserDetail(){
        const userId = this.userId ? this.userId : 0
        axios({
          method: 'GET',
          url: 'http://localhost:8080/api/users/' + userId + '/'
        }).then((response) => {
          this.userDetailList = response.data
          this.posted = response.data.my_ladders.length !== 0
          this.modelName = response.data.name ? response.data.name : ""
          this.modelProfile = response.data.profile ? response.data.profile : ""
        }).catch((error) => {
          console.log(error)
        })
      }
    },
    computed: {
      ...mapGetters('user', {
        isLogin: 'LOGIN_GETTER',
        name: 'NAME_GETTER',
        token: 'TOKEN_GETTER',
        userId: 'USER_ID_GETTER'
      })
    },
  }
</script>

<style scoped lang="sass">
  .user-page-wrap
    overflow: hidden
    display: flex
    flex-direction: row
    padding: 15px
    margin: 0 0 40px
    width: 100%

  .user-page-ladders-wrap
    width: 100%
    max-width: 600px !important

  .user-page-ladders-title
    padding: 20px
    background: #fff
    border-bottom: 1px solid $default_border_color
    text-align: center
    font-weight: normal

  .user-page-avatar
    margin: 0 40px 0 0

  .user-page-tab-items
    max-width: 600px
    width: 100%
    background-color: #fff

  .user-page-tab-item
    width: 100%

  .user-page-profile
    padding: 20px 40px

  .user-page-profile-title
    margin: 0 0 6px
    border-bottom: 1px solid $default_border_color
    font-weight: normal

  .user-page-not-ladder
    margin: 20px 0 0
    text-align: center

  .ladder-links-wrap
    display: inline-block
    &:last-child
      border-bottom: none

  .user-edit-form
    width: 100%

</style>
