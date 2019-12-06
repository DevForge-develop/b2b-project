<template lang="pug">
  div
    .row
      .col
        DealCreate
      .col
        DealSearch
        Balance
    .row
      .col
        DealsActive
    .row
      .col
        DealsInactive
</template>

<script>
  import Preloader from "@/components/helpers/Preloader";
  import DealCreate from "@/components/deal/DealCreate";
  import DealSearch from "@/components/deal/DealSearch";
  import DealsActive from "@/components/deal/DealsActive";
  import DealsInactive from "@/components/deal/DealsInactive";
  import Balance from '../components/wallet/Balance'

  export default {
    name: "BestBuy",
    components: {
      Balance,
      Preloader,
      DealCreate,
      DealSearch,
      DealsActive,
      DealsInactive,
    },
  }
</script>

<style scoped>

</style>
