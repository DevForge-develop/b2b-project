<template lang="pug">
  .container
    .row.justify-content-md-center
      .col-xs-12.col-sm-6.align-middle.align-items-center
        .card.mt-5
          .card-body
            .card-body
              .card-title
                h3.text-center Авторизация
              hr
              form(@submit.prevent="auth")
                .form-group
                  label.control-label.mb-1(for='login') Логин
                  input#login.form-control(type='text', aria-required='true', aria-invalid='false', v-model='login', required)
                .form-group
                  label.control-label.mb-1(for='password') Пароль
                  input#password.form-control(type='password', aria-required='true', aria-invalid='false', v-model='password', required)
                div
                  button#payment-button.btn.btn-lg.btn-info.btn-block(type='submit')
                    i.fa.fa-sign-in.fa-lg
                    span#payment-button-amount Войти
        error(:message="getMessage", :show="showError" @close="close")

</template>

<script>
  import { mapActions, mapGetters, mapMutations } from 'vuex';
  import { METHODS } from "../store/const";
  import Error from "@/components/helpers/Error";

  export default {
    name: 'login',
    components: {
      Error,
    },
    data() {
      return {
        login: '',
        password: '',
        method: METHODS.LOGIN,
      }
    },
    computed: {
      ...mapGetters([
        'error',
      ]),
      showError() {
        return this.error(this.method) !== undefined && this.error(this.method) !== '';
      },
      getMessage() {
        return this.error(this.method);
      },
    },
    methods: {
      ...mapActions({
        'send_auth': 'login',
      }),
      ...mapMutations([
        'removeError',
      ]),
      auth() {
        this.send_auth({
          login: this.login,
          password: this.password,
        })
      },
      close() {
        this.removeError(this.method);
      },
    },
  }
</script>
<style scoped>

</style>
