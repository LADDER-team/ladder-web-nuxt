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
        <v-flex v-for="index in unitIndex" :key="index">
          <ladder-post-form :index="index"
                            @sub-title-emit="onSubTitle"
                            @url-emit="onUrl"
                            @description-emit="onDescription"
                            class="ladder-post-item"/>
        </v-flex>
        <v-layout flex row justify-center
                  class="ladder-post-icons">
          <v-icon size="40" @click="addUnit"
                  class="ladder-post-add">add_circle_outline
          </v-icon>
          <v-icon size="40" @click="removeUnit"
                  class="ladder-post-remove">remove_circle
          </v-icon>
        </v-layout>
        <v-flex class="ladder-post-dialog-wrap">
          <v-dialog v-model="dialog" width="500">
            <v-btn slot="activator"
                   dark fab large
                   @click="validateForm"
                   class="contribution-floating-btn ladder-post-submit">
              <v-icon dark>done</v-icon>
            </v-btn>
            <v-card>
              <v-card-title class="headline dialog-title" primary-title>
                編集確認
              </v-card-title>
              <v-card-text>
                {{this.modelTitle}}を投稿しますか？
                投稿完了後はTOPに遷移します！
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
                  @click="postLadder">
                  投稿する
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
  import {mapGetters} from 'vuex'
  import LadderPostForm from '~/components/ladderPostForm.vue'

  export default {
    name: "LadderPostDetail",
    layout: 'engineer',
    scrollToTop: true,
    transitions: {
      name: 'page',
      mode: 'out-in'
    },
    data: () => ({
      dialog: false,
      unitIndex: 1,
      ladderTitle: "",
      modelLadderDescription: "",
      modelTitle: "",
      unit: [],
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
        title: 'Post'
      }
    },
    components: {
      LadderPostForm
    },
    beforeMount() {
      this.modelTitle = this.modelTitle ? this.modelTitle : ""
    },
    methods: {
      addUnit() {
        if (this.unitIndex < 8) {
          this.unitIndex++;
        } else {
          alert('これ以上ユニットは増やせません！')
        }
      },
      removeUnit() {
        if (this.unitIndex === 1) {
          alert('これ以上ユニットは削除できません！')
        } else {
          this.unitIndex--;
        }
      },
      postLadder() {
        if (!this.isLogin) {
          alert('ログインしてください！')
          return
        }
        for (let i = 1; i <= this.unitIndex; i++) {
          this.unit[i - 1] =
            {
              title: this.subtitleList[i],
              url: this.urlList[i],
              description: this.descriptionList[i],
              index: i
            }
        }
        let unit = JSON.stringify(this.unit)
        unit = JSON.parse(unit)

        if (!this.$refs.form.validate()) {
          alert('投稿に不備があります！')
        } else {
          axios({
            method: 'POST',
            url: 'http://127.0.0.1:8080/api/ladder/',
            headers: {
              "Accept": "application/json",
              "Authorization": "JWT " + this.token,
              "Content-type": "application/json"
            },
            data: {
              title: this.modelTitle,
              ladder_description: this.modelLadderDescription,
              tags: [],
              units: unit
            }
          }).then(() => {
            this.$router.push('/')
          }).catch((error) => {
            alert('投稿に失敗しました！！')
            console.log(error)
          })
        }
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
        !this.modelTitle && !this.modelLadderDescription ? this.unInputForm(0)
          : !this.modelTitle ? this.unInputForm(1)
          : !this.modelLadderDescription ? this.unInputForm(2)
            : console.log('true')
      },
      unInputForm(input) {
        const message = input === 0 ? "ラダーのタイトルと説明文を入力してください！"
          : input === 1 ? "ラダーのタイトルを入力してください！"
            : "ラダーの説明文を入力してください！"
        alert(message)
        setTimeout(() => {
          this.dialog = false
        }, 1)
      }
    },
    computed: {
      ...mapGetters('user', {
        token: 'tokenGetter',
        isLogin: 'loginGetter'
      })
    },
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
  .ladder-post-dialog-wrap
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

