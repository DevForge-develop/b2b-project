<template lang="pug">
  .card
    .card-header
      strong.card-title Баланс
    .card-body
      p.card-text
        preloader(:show="showLoading")
        | Доступно : {{ convertStringToNumber(current_balance.balance) }} BTC
        br
        | Заблокировано : {{ convertStringToNumber(current_balance.blocked) }} BTC
    .card-header
      strong.card-title Комиссии
    .card-body
      p.card-text
        | Ставка : {{ convertStringToNumber(current_commissions.percent) }} %
        br
        | Минимальная комиссия : {{ convertStringToNumber(current_commissions.minCommission) }} BTC
</template>

<script>
  import { mapActions, mapGetters, mapState } from 'vuex';
  import { METHODS, INTERVAL_TIME } from '../../store/const'
  import Preloader from "@/components/helpers/Preloader";
  import utils from "@/components/mixins/utils";

  export default {
    name: "Balance",
    components: {
      Preloader,
    },
    mixins: [utils],
    data() {
      return {
        endpoint: 'balance/btc',
        interval_time: 20000,
      }
    },
    computed: {
      ...mapGetters([
        'loading',
      ]),
      ...mapState({
        'current_balance': 'balance',
        'current_commissions': 'commission',
      }),
      showLoading() {
        return this.loading(METHODS.BALANCE_BTC) === 'loading' || this.loading(METHODS.WITHDRAW_COMMISSION) === 'loading'
      },
    },
    methods: {
      ...mapActions([
        'requestBalance',
        'withdrawCommission',
      ]),
    },
    mounted() {
      this.requestBalance();
      this.withdrawCommission();
      this.interval = setInterval(() => {
        this.requestBalance();
      }, this.interval_time || INTERVAL_TIME);
    },
    beforeDestroy() {
      this.interval = clearInterval(this.interval);
    },
  }
</script>

<style scoped>

</style>
