<template lang="pug">
  span.badge(:class="getStatus.class") {{ getStatus.text }}
</template>

<script>
  export default {
    name: "Status",
    props: {
      status: {
        type: String,
        default: 'Cancel',
      },
    },
    computed: {
      getStatus() {
        let obj = {};
        switch (this.status) {
          case 'Verification':
          case 'Verified':
          case 'Seller requisite':
            obj = {
              text: 'Ожиданиет оплаты',
              class: 'badge-primary',
            };
            break;
          case 'Paid':
            obj = {
              text: 'Оплачена',
              class: 'badge-info',
            };
            break;
          case 'Finishing':
          case 'Finished':
            obj = {
              text: 'Завершена',
              class: 'badge-success',
            };
            break;
          case 'In dispute':
            obj = {
              text: 'В диспуте',
              class: 'badge-danger',
            };
            break;
          case 'Autocanceled':
          case 'Canceled':
          case 'Cancellation':
          default:
            obj = {
              text: 'Отменена',
              class: 'badge-warning',
            };
            break;
        }
        return obj;
      },
    },
  }
</script>
