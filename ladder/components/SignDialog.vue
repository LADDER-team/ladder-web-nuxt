<template>
  <v-dialog v-model="dialog"
            persistent
            max-width="500">
    <v-btn slot="activator"
           dark round outline small
           class="avatar-btn">
      <v-avatar :size="40">
        <v-icon>person_outline</v-icon>
      </v-avatar>
    </v-btn>
    <transition name="sign-up">
      <sign-up-form v-show="sign&&!this.isLogin"
                    v-on:cancel="onCancelDialog"
                    v-on:direct-login="onDirectLogin"
                    v-on:login="receivedLogin"
                    v-on:sign="signin"/>
    </transition>
    <transition name="sign-in">
      <sign-in-form v-show="login&&!this.isLogin"
                    v-on:cancel="onSignInDialog"
                    v-on:login="receivedLogin"/>
    </transition>
  </v-dialog>
</template>

<script>
  import {mapGetters, mapActions} from 'vuex'
  import SignInForm from '~/components/SignInForm'
  import SignUpForm from '~/components/SignUpForm'

  export default {
    name: "sign-dialog",
    components: {
      SignInForm,
      SignUpForm,
    },
    data: () => ({
      dialog: false,
      login: false,
      sign: true,
      avatar: "person_outline",
    }),
    mounted() {
      if (this.isLogin) {
        this.sign = false;
      }
    },
    methods: {
      onSignInDialog() {
        this.dialog = false
        setTimeout(() => {
          this.login = false
          this.sign = true
        }, 200)
      },
      onCancelDialog() {
        this.dialog = false
      },
      onDirectLogin() {
        this.sign = false
        setTimeout(() => {
          this.login = true
        }, 350)
      },
      signin() {
        this.dialog = false
      },
      receivedLogin() {
        this.avatar = "face"
        this.dialog = false
      },
      ...mapActions([
        'user/addTokenAction',
        'user/loginAction'
      ])
    },
    computed: {
      ...mapGetters('user', {
        isLogin: 'loginGetter',
        token: 'tokenGetter'
      }),
    },
  }
</script>

<style scoped lang="sass"></style>
