<template>
  <v-app id="inspire" indig>
    <app-bar/>
    <v-content id="window">
      <v-container
        fluid
        fill-height
        justify-center
        align-start
        class="g-container"
      >
        <nuxt/>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
  import AppBar from '~/components/AppBar.vue'

  export default {
    components: {
      AppBar
    }
  }
</script>

<style lang="sass" scoped>

</style>

