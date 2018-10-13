<template>
  <v-card>
    <v-card-title>
      <span class="headline">パスワード再設定</span>
    </v-card-title>
    <v-card-text>
      <v-container grid-list-md>
        <v-layout wrap>
          <v-form lazy-validation
                  ref="form"
                  v-model="valid"
                  class="sign-form">
            <v-text-field
              v-model="modelEmail"
              :rules="emailRules"
              prepend-icon="email"
              ref="emailRef"
              label="メールアドレス"
              required></v-text-field>
          </v-form>
        </v-layout>
      </v-container>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn flat color="blue darken-1"
             @click="cancelDialog">キャンセル
      </v-btn>
      <v-btn color="blue darken-1" flat
             :disabled="!valid"
             @click="sendEmail">送信する
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
    export default {
      name: "password-reset-email-form",
      data() {
        return {
          loginToken: null,
          reset: false,
          //validation
          valid: false,
          modelEmail: "",
          emailRules: [
            v => !!v || 'メールアドレスを入力してください',
            v => /.+@.+/.test(v) || '正しいメールアドレスを入力してください'
          ]
        }
      },
      methods: {
        cancelDialog() {
          this.$emit('cancel')
        },
        sendEmail() {
          if (this.$refs.form.validate()) {
            this.$router.push('/settings/password/reset/')
          } else {
            alert('フォームに不備があります！')
          }
        }
      }
    }
</script>

<style lang="sass" scoped></style>
