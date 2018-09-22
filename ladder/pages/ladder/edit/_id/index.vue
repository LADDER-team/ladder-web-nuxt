<template>
  <v-layout justify-center
            ref="scrollWrapRef"
            id="scroll-wrap"
            class="layout-ladder-post">
    <v-flex justify-center align-start
            md7
            class="ladder-posts-wrap">
      <v-form ref="form" v-model="valid"
              lazy-validation
              class="ladder-post-form">
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
          <ladder-post-form :index="index+1"
                            :unit="unit"
                            :isEdit="true"
                            @sub-title-emit="onSubTitle"
                            @url-emit="onUrl"
                            @description-emit="onDescription"
                            class="ladder-post-item"/>
        </v-flex>
        <v-flex class="ladder-post-btn">
          <v-btn dark fab large
                 @click="editLadder"
                 class="contribution-floating-btn ladder-post-submit">
            <v-icon dark>done</v-icon>
          </v-btn>
        </v-flex>
      </v-form>
    </v-flex>
  </v-layout>
</template>

<script>
  import axios from 'axios'
  import _ from 'underscore'
  import {mapGetters} from 'vuex'
  import LadderPostForm from '~/components/ladderPostForm.vue'

  export default {
    name: "ladder-edit",
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
        url: 'http://127.0.0.1:8080/api/ladder/' + params.id + '/'
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
        modelLadderDescription: ladderDetailList.ladder_description,
      }
    },
    data: () => ({
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
      LadderPostForm
    },
    created() {
      const ladderId = this.$route.params.id
      axios({
        method: 'GET',
        url: 'http://127.0.0.1:8080/api/ladder/' + ladderId + '/'
      }).then((response) => {
        this.ladderDetailList = response.data
        this.unitsList = _.sortBy(response.data.units, (value) => {
          return value.index
        })
      }).then(() => {
        this.modelTitle = this.ladderDetailList.title
        this.modelLadderDescription = this.ladderDetailList.ladder_description
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
            url: 'http://127.0.0.1:8080/api/ladder/' + this.ladderDetailList.id + '/',
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
              url: 'http://127.0.0.1:8080/api/unit/' + value.id + '/',
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

        setTimeout(()=>{
          alert('ユニットを編集しました！Ladderへ遷移します！')
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
    }
    ,
    computed: {
      ...mapGetters('user', {
          token: 'tokenGetter',
          isLogin: 'loginGetter'
        })
    }
  }
</script>

<style scoped lang="sass">
  .ladder-posts-wrap
    position: relative
    padding: 70px
    max-width: 800px
    background-color: #fff
  .ladder-post-icons
    max-width: 40px
    max-height: 40px
    margin: 0 auto
    cursor: pointer
  .ladder-post-add
    &:hover
      opacity: .7
  .ladder-post-remove
    &:hover
      opacity: .7
  .ladder-post-btn
    z-index: 100
    position: fixed
    bottom: 150px
    display: block
    margin: 0 auto
    max-width: 770px
    width: 55%
  .ladder-post-submit
    position: absolute !important
    right: 0
  .post-description
    margin: 0 0 24px !important
    border-bottom: 3px solid $default_border_color
  .post-text-field
    font-size: 18px
</style>

