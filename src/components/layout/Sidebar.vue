<template lang="pug">
  aside#left-panel.left-panel
    nav.navbar.navbar-expand-sm.navbar-default
      #main-menu.main-menu.collapse.navbar-collapse
        ul.nav.navbar-nav.mt-4
          li
            router-link(:to="{name: 'best-buy'}")
              img.icon(src='/img/best.png')
              | Покупка
          li
            router-link(:to="{name: 'wallet'}")
              img.icon(src='/img/wallet.png')
              | Кошелек
</template>

<script>
  export default {
    name: "Sidebar",
  }
</script>

<style scoped>
  .icon {
    width: 20px;
    margin-right: 10px;
  }
</style>
