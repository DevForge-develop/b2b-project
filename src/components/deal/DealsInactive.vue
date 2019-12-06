<template lang="pug">
  div
    .row
      .col
        .card
          .card-header(ref="deal_inactive")
            strong.card-title Завершенные покупки
          .card-body
            table.table.table-bordered
              thead
                tr
                  th.text-center(scope='col') Номер
                  th.text-center(scope='col') Платежная система
                  th.text-center(scope='col') Статус
                  th.text-center(scope='col') RUB
                  th.text-center(scope='col') BTC
                  th.text-center(scope='col') Кошелек
              tbody(v-if="haveInactiveDeals")
                tr(v-for='deal in deals_inactive.data', :key='deal.id')
                  td.text-center {{deal.id}}
                  td.text-center {{deal.payment}}
                  td.text-center
                    status(:status="deal.status")
                  td.text-center {{deal.sum}}
                  td.text-center {{deal.crypto_sum}}
                  td {{deal.requisite}}
              tbody(v-if="!haveInactiveDeals")
                tr
                  td(colspan="6") У вас нет завершенных покупок
          div(v-if="haveInactiveDeals && showPagination")
            nav(aria-label='Page navigation example')
              ul.pagination
                li.page-item(
                  v-for='page in deals_inactive.total',
                  :key='page',
                  :class='{active: page === current_page}',
                  @click='setPage(page)'
                )
                  span.page-link {{ page }}
          preloader(:show="showLoading")
</template>

<script>
  import { mapGetters, mapActions, mapState } from 'vuex';
  import { INTERVAL_TIME, METHODS } from "../../store/const";
  import Status from "@/components/helpers/Status";
  import Preloader from "@/components/helpers/Preloader";

  export default {
    data() {
      return {
        current_page: 1,
        interval: null,
        interval_time: 10000, // Если 0, то возьмет из конфига стандартное время
        no_loading: false,
      }
    },
    name: "DealsInactive",
    components: {
      Preloader,
      Status,
    },
    computed: {
      ...mapGetters([
        'loading',
      ]),
      ...mapState([
        'deals_inactive',
      ]),
      haveInactiveDeals() {
        return this.deals_inactive.data && this.deals_inactive.data.length > 0;
      },
      showPagination() {
        return this.deals_inactive.total > 1;
      },
      showLoading() {
        return this.loading(METHODS.DEALS_INACTIVE) === 'loading' && !this.no_loading;
      },
    },
    watch: {
      current_page: function (val) {
        this.no_loading = false;
        this.getInactiveDeals({ page: val });
        this.$refs.deal_inactive.scrollIntoView();
      },
    },
    mounted() {
      this.getInactiveDeals({ page: this.current_page });
      this.interval = setInterval(() => {
        this.no_loading = true; // Выключаем loading, чтоб не мешал при обновлении страницы
        this.getInactiveDeals({ page: this.current_page });
      }, this.interval_time || INTERVAL_TIME);
    },
    beforeDestroy() {
      this.interval = clearInterval(this.interval);
    },
    methods: {
      ...mapActions([
        'getInactiveDeals',
      ]),
      setPage(page) {
        this.$set(this, 'current_page', page)
      },
    },
  }
</script>

<style scoped>

</style>
