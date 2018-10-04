<template>
  <v-flex class="post-item-wrap">
    <v-text-field
      v-model="modelSubTitle"
      @input="inputSubTitle"
      outline
      :label="'Unitタイトル'+index"
      :rules="[v => !!v || 'Unitタイトルを入力してください']"
      class="post-item-text-field post-item-sub-title"
      placeholder="Pythonに触れよう！"></v-text-field>
    <v-text-field
      v-model="modelUrl"
      @input="inputUrl"
      outline
      :rules="[v => !!v || '参考サイトURLを入力してください',
                         v => /(^http:\/\/|^https:\/\/)\w{1,}/.test(v) || 'http://xxxもしくはhttps://xxxの形式で入力してください']"
      label="参考サイトURL"
      class="post-item-text-field post-item-url"
      placeholder="https://www.python.org/"></v-text-field>
    <v-textarea
      v-model="modelDescription"
      @input="inputDescription"
      outline
      :counter="200"
      :rules="[v => !!v || '学べることを入力してください',
                         v => v.length <= 200 || '学べることは200字以内で入力してください']"
      label="学べること"
      class="post-item-text-field post-item-description"
      placeholder="Djangoでアプリケーションをつくるには、Pythonから勉強することが必要です！なので、まずはPythonに触れてプログラミングがどういったものかをProgateで試してみましょう！"></v-textarea>
  </v-flex>
</template>

<script>
  export default {
    name: "ladder-post-item-form",
    props: {
      index: 0,
      unit: null,
      isEdit: false
    },
    data: () => ({
      modelDescription: "",
      modelSubTitle: "",
      modelUrl: "",
      testRule: [v => !!v || 'タイトルを入力してください'],
    }),
    mounted() {
      if(this.isEdit){
        this.modelDescription = this.unit.description ? this.unit.description : ""
        this.modelSubTitle = this.unit.title ? this.unit.title : ""
        this.modelUrl = this.unit.url ? this.unit.url : ""
        this.inputSubTitle()
        this.inputUrl()
        this.inputDescription()
      }
    },
    methods: {
      inputSubTitle() {
        this.$emit('sub-title-emit', this.modelSubTitle, this.index)
      },
      inputUrl() {
        this.$emit('url-emit', this.modelUrl, this.index)
      },
      inputDescription() {
        this.$emit('description-emit', this.modelDescription, this.index)
      }
    }
  }
</script>

<style lang="sass" scoped>
  .post-item-wrap
    margin: 0 0 30px

  .post-item-text-field
    font-size: 14px
    @media (min-width: $media_desktop_md)
      font-size: 18px
</style>
