<template>
  <v-layout align-center justify-start column
            class="layout-user-page">
    <div class="user-page-wrap">
      <v-flex align-center justify-end layout
              class="user-page-avatar-wrap">
        <v-flex align-center justify-center layout
                class="user-page-avatar">
          <img v-if="userDetailList.icon" :src="userDetailList.icon"
               class="user-page-avatar-image" alt="avatar">
          <img v-if="!userDetailList.icon" class="user-page-avatar-image"
               src="~static/images/logo.png" alt="avatar">
        </v-flex>
      </v-flex>
      <v-flex align-center justify-start>
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
              <span class="headline">プロフィール変更</span>
            </v-card-title>
            <v-card-text>
              <v-container grid-list-md>
                <v-layout wrap>
                  <v-form lazy-validation
                          ref="form"
                          v-model="valid"
                          class="user-edit-form">
                    <v-flex layout align-center justify-center
                            class="user-edit-avatar-wrap">
                      <img :src="imageUrl"
                            ref="imageUrl"
                            class="user-edit-avatar-image">
                      <v-btn v-if="!imageUrl"
                             raised @click="onPickFile"
                             class="user-edit-circle-btn"></v-btn>
                      <input
                        ref="image"
                        @change="onFilePicked"
                        class="user-edit-avatar-input"
                        accept="image/*"
                        name="image"
                        type="file">
                      <a @click="onPickFile"
                         class="user-edit-avatar-overlay transition-item">
                        <v-icon dark size="40" >camera_alt</v-icon>
                      </a>
                    </v-flex>
                    <v-text-field
                      v-model="modelName"
                      :rules="nameRules"
                      prepend-icon="person"
                      ref="nameRef"
                      label="ニックネーム"
                      class="user-edit-input"
                      required></v-text-field>
                    <v-textarea
                      v-model="modelProfile"
                      :counter="250"
                      :rules="profileRules"
                      class="user-edit-input user-edit-textarea"
                      label="自己紹介"
                      required></v-textarea>
                  </v-form>
                </v-layout>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" flat @click="dialog=false">キャンセル</v-btn>
              <v-btn color="blue darken-1" flat
                     :disabled="!valid"
                     @click="editProfile">変更する
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-flex>
    </div>
    <v-tabs slot="extension"
            v-model="model"
            centered color="white" slider-color="blue"
            class="user-page-tabs">
      <v-tab href="#tab-1" class="user-page-tab">プロフィール</v-tab>
      <v-tab href="#tab-2" class="user-page-tab">投稿Ladder</v-tab>
    </v-tabs>
    <v-tabs-items md8 v-model="model" class="user-page-tab-items">
      <v-tab-item id="tab-1" class="user-page-tab-item user-page-profile">
        <v-flex>
          <div>
            <h3 class="user-page-profile-title">自己紹介</h3>
            <p class="user-page-profile-body">{{userDetailList.profile}}</p>
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
      defaultName: '',
      imageFile: null,
      imageUrl: '',
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
      modelProfile: "",
      nameRules: [v => !!v || '名前を入力してください'],
      profileRules: [v => !!v || '学べることを入力してください',
        v => v.length <= 200 || '学べることは200字以内で入力してください'],
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
            method: 'PUT',
            url: 'http://localhost:8080/api/users/' + userId + '/',
            headers: {
              "Authorization": "JWT " + this.token,
              "Content-type": "application/json"
            },
            data: {
              name: this.modelName,
              profile: this.modelProfile,
              // icon: this.imageFile,
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
      getUserDetail() {
        const userId = this.userId ? this.userId : 0
        axios({
          method: 'GET',
          url: 'http://localhost:8080/api/users/' + userId + '/'
        }).then((response) => {
          this.userDetailList = response.data
          this.posted = response.data.my_ladders.length !== 0
          this.imageUrl = response.data.icon ? response.data.icon : ""
          this.modelName = response.data.name ? response.data.name : ""
          this.modelProfile = response.data.profile ? response.data.profile : ""
        }).catch((error) => {
          console.log(error)
        })
      },
      onPickFile() {
        this.$refs.image.click()
      },
      onFilePicked(event) {
        const files = event.target.files || event.dataTransfer.files

        if (files && files[0]) {
          let filename = files[0].name

          if (filename && filename.lastIndexOf('.') <= 0) {
            return
          }

          const fileReader = new FileReader()
          fileReader.addEventListener('load', () => {
            this.imageUrl = fileReader.result
          })
          fileReader.readAsDataURL(files[0])

          this.imageFile = files[0]
        }
      },

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

  .user-page-avatar-wrap
    margin: 0 40px 0 0

  .user-page-avatar
    max-width: 100px
    max-height: 100px
    width: 100px
    height: 100px
    overflow: hidden
    border-radius: 50%

  .user-page-avatar-image
    max-height: 100%

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

  .user-page-profile-body
    word-break: break-word

  .user-edit-avatar-input
    position: absolute
    left: -99999px

  .user-edit-avatar-wrap
    position: relative
    max-width: 100px
    max-height: 100px
    width: 100px
    height: 100px
    margin: 0 auto !important
    padding: 0 !important
    overflow: hidden
    border-radius: 50%
    cursor: pointer

  .user-edit-avatar-image
    max-height: 100%

  .user-edit-circle-btn
    background-color: $default_tertiary_color

  .user-edit-avatar-overlay
    position: absolute
    top: 0
    left: 0
    display: inline-flex
    align-items: center
    justify-content: center
    padding: 0!important
    margin: 0!important
    width: 100%
    height: 100%
    opacity: .9
    background: rgba(0, 0, 0, .4)
    transition: opacity .3s
    &:hover
      opacity: .1

  .user-edit-textarea
    font-size: 14px

</style>
