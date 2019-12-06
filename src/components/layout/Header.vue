<template lang="pug">
  header#header.header
    .top-left
      .navbar-header
        .navbar-brand
          | B2B Project
    .top-right
      .header-menu
        .header-left
          button.search-trigger(@click='logout') Выйти
</template>

<script>

  import { mapActions } from "vuex";

  export default {
    name: "Header",
    methods: {
      ...mapActions([
        'requestLogout',
      ]),
      logout() {
        this.requestLogout();
      },
    },
  }
</script>

<style lang="scss" scoped>
  .navbar-brand {
    width: 100px !important;
    margin-top: 10px;
  }
</style>
