<template lang="pug">
  .preloader(v-if="show")
    img(src="/img/pufff.svg")
</template>

<script>
  export default {
    name: "Preloader",
    props: {
      show: {
        type: Boolean,
        default: true,
      },
    },
  }
</script>
