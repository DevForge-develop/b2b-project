<template lang="pug">
  #main-wrapper
    sidebar
    #right-panel.right-panel
      Header
      .content
        router-view
      .clearfix
</template>

<script>
  import Header from '@/components/layout/Header';
  import Sidebar from '@/components/layout/Sidebar';

  export default {
    components: {
      Header,
      Sidebar,
    },
  }
</script>

<style scoped>

</style>
