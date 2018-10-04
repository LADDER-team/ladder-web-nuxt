<template>
  <v-layout justify-center
            ref="scrollWrapRef"
            id="scroll-wrap"
            class="layout-post">
    <v-flex justify-center align-start
            md7
            class="post-form-wrap">
      <v-form ref="form" v-model="valid"
              lazy-validation
              class="post-form">
        <v-text-field
          v-model="modelTitle"
          outline
          :rules="titleRule"
          class="post-text-field post-title"
          label="Ladderタイトル"
          placeholder="初心者がDjangoアプリケーションを作るまで！"></v-text-field>
        <v-textarea
          v-model="modelLadderDescription"
          outline
          :rules="ladderDescriptionRule"
          :counter="200"
          class="post-text-field post-description"
          label="Ladderの説明"
          placeholder="半年前までプログラミング初心者だった私がDjangoでアプリケーションをどんな順序で開発することができたのか。初心者の方に参考になればなと思います！諦めずに最後までやりきってみましょう！"></v-textarea>
        <v-flex v-for="(unit, index) in unitsList" :key="index">
          <ladder-post-item :index="index+1"
                            :unit="unit"
                            :isEdit="true"
                            @sub-title-emit="onSubTitle"
                            @url-emit="onUrl"
                            @description-emit="onDescription"
                            class="post-item"/>
        </v-flex>
        <v-flex class="post-dialog-wrap">
          <v-dialog v-model="dialog" width="500">
            <v-btn slot="activator"
                   dark fab large
                   class="submit-floating-btn post-submit-btn">
              <v-icon dark>done</v-icon>
            </v-btn>
            <v-card>
              <v-card-title class="headline dialog-title" >
                編集確認
              </v-card-title>
              <v-card-text>
                {{ladderDetailList.title}} の編集を適用しますか？
                適用後はラダー画面へ遷移します！
              </v-card-text>
              <v-divider></v-divider>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="secondary" flat
                  @click="dialog = false">
                  キャンセル
                </v-btn>
                <v-btn
                  color="primary" flat
                  @click="editLadder">
                  適用する
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-flex>
      </v-form>
    </v-flex>
  </v-layout>
</template>

<script>
  import axios from 'axios'
  import _ from 'underscore'
  import {mapGetters} from 'vuex'
  import LadderPostItem from '~/components/LadderPostItem'

  export default {
    name: "Ladder-edit",
    layout: 'engineer',
    scrollToTop: true,
    transitions: {
      name: 'page',
      mode: 'out-in'
    },
    async asyncData({params}) {
      let ladderDetailList = []
      let unitsList = []
      await axios({
        method: 'GET',
        url: 'http://localhost:8080/api/ladder/' + params.id + '/'
      }).then((response) => {
        ladderDetailList = response.data
        unitsList = _.sortBy(response.data.units, (value) => {
          return value.index
        })
      })
      return {
        ladderDetailList: ladderDetailList,
        unitsList: unitsList,
        modelTitle: ladderDetailList.title,
        modelLadderDescription: ladderDetailList.ladder_description ? ladderDetailList.ladder_description : "",
      }
    },
    data: () => ({
      dialog: false,
      unitIndex: 1,
      ladderTitle: "",
      modelLadderDescription: "",
      modelTitle: "",
      unit: [],
      unitsList: [],
      ladderDetailList: [],
      descriptionList: {
        1: "",
      },
      subtitleList: {
        1: "",
      },
      urlList: {
        1: "",
      },
      //validation
      valid: true,
      titleRule: [v => !!v || 'タイトルを入力してください'],
      ladderDescriptionRule: [v => !!v || '説明文を入力してください',
        v => v.length <= 200 || '説明文は200字以内で入力してください'],
    }),
    head() {
      return {
        title: 'Edit'
      }
    },
    components: {
      LadderPostItem
    },
    created() {
      const ladderId = this.$route.params.id
      axios({
        method: 'GET',
        url: 'http://localhost:8080/api/ladder/' + ladderId + '/'
      }).then((response) => {
        this.ladderDetailList = response.data
        this.unitsList = _.sortBy(response.data.units, (value) => {
          return value.index
        })
      }).then(() => {
        this.modelTitle = this.ladderDetailList.title
        this.modelLadderDescription = this.ladderDetailList.ladder_description ? this.ladderDetailList.ladder_description : ""
      }).catch((error) => {
        console.log(error)
      })
    },
    methods: {
      editLadder() {
        if (!this.isLogin) {
          alert('ログインしてください！')
          return
        }
        if (!this.$refs.form.validate()) {
          alert('投稿内容に不備があります！確認してください！')
          return
        }

        if (this.modelTitle || this.modelLadderDescription) {
          axios({
            method: 'PUT',
            url: 'http://localhost:8080/api/ladder/' + this.ladderDetailList.id + '/',
            headers: {
              "Accept": "application/json",
              "Authorization": "JWT " + this.token,
              "Content-type": "application/json"
            },
            data: {
              title: this.modelTitle,
              ladder_description: this.modelLadderDescription,
            }
          }).catch((error) => {
            alert('ladderのタイトルと説明の変更に失敗しました！')
            console.log(error)
          })
        }

        if (this.unitsList.length) {
          this.unitsList.forEach((value, index) => {
            axios({
              method: 'PUT',
              url: 'http://localhost:8080/api/unit/' + value.id + '/',
              headers: {
                "Accept": "application/json",
                "Authorization": "JWT " + this.token,
                "Content-type": "application/json"
              },
              data: {
                title: this.subtitleList[index + 1],
                description: this.descriptionList[index + 1],
                url: this.urlList[index + 1],
              }
            }).catch((error) => {
              alert('ユニットの変更に失敗しました！')
              console.log(error)
            })
          })
        }
        setTimeout(() => {
          this.$router.push('/detail/' + this.ladderDetailList.id + '/')
        }, this.unitsList.length * 100)
      },
      onDescription(descriptionEmit, index) {
        this.$set(this.descriptionList, index, descriptionEmit);
      },
      onSubTitle(subTitleEmit, index) {
        this.$set(this.subtitleList, index, subTitleEmit);
      },
      onUrl(urlEmit, index) {
        this.$set(this.urlList, index, urlEmit);
      },
      validateForm() {
        if (!this.$refs.form.validate)
          alert('フォームを全て埋めてください！')
        setTimeout(() => {
          this.dialog = false
        }, 1)
      },
    }
    ,
    computed: {
      ...mapGetters('user', {
        token: 'TOKEN_GETTER',
        isLogin: 'LOGIN_GETTER'
      })
    }
  }
</script>

<style scoped lang="sass">
  .post-form-wrap
    position: relative
    padding: 70px
    max-width: 800px
    background-color: #fff

  .post-dialog-wrap
    z-index: 100
    position: fixed
    bottom: 150px
    display: block
    margin: 0 auto
    max-width: 770px
    width: 55%

  .post-submit-btn
    position: absolute !important
    right: 0

  .post-description
    margin: 0 0 24px !important
    border-bottom: 3px solid $default_border_color

  .post-text-field
    font-size: 18px

</style>

