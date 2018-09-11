<template>
  <v-layout align-start justify-center wrap
            class="layout-error">
    <div class="container error-wrap">
      <h2 v-if="error.statusCode === 404" class="display-1">ページが見つかりません！</h2>
      <h2 v-else class="display-1">エラーが発生しました！</h2>
      <p class="back-link">
        <nuxt-link to="/" class="subheading">TOPへ戻る</nuxt-link>
      </p>
    </div>
  </v-layout>
</template>
<script>
  export default {
    props: ['error'],
    layout: 'engineer',
    scrollToTop: true,
    transitions: {
      name: 'page',
      mode: 'out-in'
    },
  }
</script>
<style lang="sass" scoped>
  .back-link
    text-align: center
    a
      color: $default_primary_color
      transition: .2s all
      &:hover
        opacity: .5
        border-bottom: 1px solid $default_primary_color
  .error-wrap
    line-height: 4em
</style>
