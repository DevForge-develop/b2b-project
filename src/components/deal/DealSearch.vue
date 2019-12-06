<template lang="pug">
  div
</template>

<script>
  import { mapGetters, mapActions, mapState } from 'vuex';
  import { INTERVAL_TIME, LIMIT_MAX, LIMIT_MIN } from "../../store/const";
  import utils from "@/components/mixins/utils";

  export default {
    name: "DealSearch",
    data() {
      return {
        interval: null,
        interval_time: 5000,
        auto_update: true,
        limit_min: LIMIT_MIN,
        limit_max: LIMIT_MAX,
      }
    },
    mixins:[utils],
    computed: {
      ...mapState([
        'best_buy',
        'balance',
      ]),
      ...mapGetters([
        'loading',
      ]),
      haveBestBuy() {
        return this.best_buy.length > 0;
      },
      isAutoupdate() {
        return this.auto_update ? 'Включено' : "Выключено"
      },
    },
    watch: {
      auto_update(val) {
        if (val) {
          this.interval = setInterval(() => {
            this.bestBuy(false);
          }, this.interval_time || INTERVAL_TIME);
        } else {
          this.interval = clearInterval(this.interval);
        }
      },
    },
    methods: {
      ...mapActions([
        'bestBuy',
        'requestBalance',
      ]),
      getBestBuy() {
        this.bestBuy({
          data: {
            from: parseInt(this.limit_min),
            to: parseInt(this.limit_max),
          },
        });
      },
      changeUpdate() {
        this.auto_update = !this.auto_update
      },
    },
    mounted() {
      this.getBestBuy();
      this.requestBalance();
      this.interval = setInterval(() => {
        this.getBestBuy();
      }, this.interval_time || INTERVAL_TIME);
    },
    beforeDestroy() {
      this.interval = clearInterval(this.interval);
    },
  }
</script>

<style scoped>

</style>
