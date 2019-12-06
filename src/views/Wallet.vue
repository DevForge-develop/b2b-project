<template lang="pug">
  div
    .row
      .col
        balance
      .col
        withdraw
    withdraw-history
</template>

<script>
  import Balance from "../components/wallet/Balance";
  import Withdraw from "../components/wallet/Withdraw";
  import WithdrawHistory from "../components/wallet/WithdrawHistory";

  export default {
    name: "Wallet",
    components: {
      Balance,
      WithdrawHistory,
      Withdraw,
    },
  }
</script>

<style scoped>

</style>
