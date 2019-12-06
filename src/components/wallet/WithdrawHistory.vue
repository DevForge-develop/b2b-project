<template lang="pug">
  div
    .row
      .col
        .card
          .card-header
            strong.card-title(ref="history") ИСТОРИЯ ВЫВОДОВ
          .card-body
            table.table.table-bordered
              thead
                tr
                  th.text-center.w-25(scope='col') Количество
                  th.text-center(scope='col') Кошелек
                  th.text-center(scope='col') Дата
              tbody(v-if="haveHistory")
                tr(v-for='deal in withdraw_history.data', :key='deal.id')
                  td.text-center {{ deal.amount }}
                  td {{ deal.wallet }}
                  td.text-center {{ deal.date }}
              tbody(v-if="!haveHistory")
                tr
                  td(colspan="3") У вас нет истории выводов
          div(v-if="haveHistory && showPagination")
            nav(aria-label='Deal history pagination')
              ul.pagination
                li.page-item(
                  v-for='page in withdraw_history.total',
                  :key='page',
                  :class='{active: page === current_page}',
                  @click='setPage(page)'
                )
                  span.page-link {{ page }}
          preloader(:show="showLoading")

</template>

<script>
  import { mapActions, mapGetters, mapState } from 'vuex';
  import { METHODS, INTERVAL_TIME } from "../../store/const";
  import Preloader from "@/components/helpers/Preloader";

  export default {
    name: "WithdrawHistory",
    components: {
      Preloader,
    },
    data() {
      return {
        endpoint: 'withdraw/btc/history',
        current_page: 1,
        interval: null,
        interval_time: 0, // Если 0, то возьмет из конфига стандартное время
        no_loading: false,
      }
    },
    computed: {
      ...mapGetters([
        'loading',
      ]),
      ...mapState([
        'withdraw_history',
      ]),
      haveHistory() {
        return this.withdraw_history.data && this.withdraw_history.data.length > 0;
      },
      showPagination() {
        return this.withdraw_history.total > 1;
      },
      showLoading() {
        return this.loading(METHODS.WITHDRAW_HISTORY) === 'loading' && !this.no_loading
      },
    },
    watch: {
      current_page(val) {
        this.no_loading = false;
        this.withdrawHistory({ page: val });
        this.$refs.history.scrollIntoView();
      },
    },
    mounted() {
      this.withdrawHistory({ page: this.current_page });
      this.interval = setInterval(() => {
        this.no_loading = true;
        this.withdrawHistory({ page: this.current_page });
      }, this.interval_time || INTERVAL_TIME);
    },
    beforeDestroy() {
      this.interval = clearInterval(this.interval);
    },
    methods: {
      ...mapActions([
        'withdrawHistory',
      ]),
      setPage(page) {
        this.$set(this, 'current_page', page)
      },
    },
  }
</script>

<style scoped>

</style>
