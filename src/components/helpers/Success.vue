<template lang="pug">
  div
    .alert.alert-success.mt-3(v-if="show", :class="{'mb-3' : margin_bottom, 'mb-0' : !margin_bottom}")
      | {{ message }}
      button.close(type='button', data-dismiss='alert', aria-label='Close' @click="close()")
        span(aria-hidden='true') &times;
</template>

<script>
  export default {
    name: "Success",
    props: {
      message: {
        type: String,
        default: 'Успех',
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
        this.$emit('close', 'success');
      },
    },
  }
</script>

<style scoped>

</style>
