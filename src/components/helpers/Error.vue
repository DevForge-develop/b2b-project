<template lang="pug">
  .alert.alert-danger.mt-3(v-if="show", :class="{'mb-3' : margin_bottom, 'mb-0' : !margin_bottom}")
    | {{ message }}
    button.close(type='button', data-dismiss='alert', aria-label='Close' @click="close")
      span(aria-hidden='true') &times;
</template>

<script>

  export default {
    name: "Error",
    props: {
      message: {
        type: String,
        default: '',
      },
      show: {
        type: Boolean,
        default: false,
      },
      margin_bottom: {
        type: Boolean,
        default: false,
      },
    },
    methods: {
      close() {
        this.$emit('close', 'error');
      },
    },
  }
</script>

<style scoped>

</style>
