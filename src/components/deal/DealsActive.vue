<template lang="pug">
  div
    .row
      .col
        .card
          .card-header(ref="deal_active")
            strong.card-title Активные покупки
          .card-body
            success(:message="getSuccessMessage", :show="show"  @close="close", :margin_bottom="true")
            error(:message="getMessage", :show="showError" @close="close", :margin_bottom="true")
            table.table.table-bordered
              thead
                tr
                  th.text-center(scope='col') Номер
                  th.text-center(scope='col') Платежная система
                  th.text-center(scope='col') Статус
                  th.text-center(scope='col') RUB
                  th.text-center(scope='col') Кошелек
                  th.text-center.w-25(v-if="haveActiveDeals") Управление
              tbody(v-if="haveActiveDeals")
                tr(v-for='deal in deals_active.data', :key='deal.id')
                  td.align-middle.text-center {{ deal.id }}
                  td.align-middle.text-center {{ deal.payment }}
                  td.align-middle.text-center
                    status(:status="deal.status")
                    .text-center.color-red(v-if="deal.status === 'In dispute'") Обратитесь в поддержку
                  td.align-middle.text-center {{ deal.sum }}
                  td.align-middle
                    .text-center(v-if="dealWait(deal)") Ожидайте
                    .text-center(v-else)
                      .text-center(:ref="deal.id") {{ deal.requisite }}
                      button.btn.btn-info.btn-sm(v-if="dealSellerRequisite(deal)", @click="copy(deal.id)") копировать
                  td
                    deals-actions(:deal="deal" @success="resultOfActions")
              tbody(v-if="!haveActiveDeals")
                tr
                  td(colspan="8") У вас нет активных покупок
            div(v-if="haveActiveDeals && showPagination")
              nav(aria-label='Page navigation example')
                ul.pagination
                  li.page-item(
                    v-for='page in deals_active.total',
                    :key='page',
                    :class='{active: page === current_page}',
                    @click='setPage(page)'
                  )
                    span.page-link {{ page }}
          preloader(:show="showLoading")
</template>

<script>
  import { mapGetters, mapActions, mapState, mapMutations } from 'vuex';
  import { INTERVAL_TIME, METHODS } from "../../store/const";
  import Preloader from "@/components/helpers/Preloader";
  import Status from "@/components/helpers/Status";
  import Success from "@/components/helpers/Success";
  import Error from "@/components/helpers/Error";
  import DealsActions from "@/components/deal/DealsActions";

  export default {
    name: "DealsActive",
    data() {
      return {
        current_page: 1,
        interval: null,
        interval_time: 0, // Если 0, то возьмет из конфига стандартное время
        no_loading: false,
        method_pay: METHODS.PAY_DEAL,
        method_cancel: METHODS.CANCEL_DEAL,
        success_pay_request: false,
        success_cancel_request: false,
        copy_success: false,
      }
    },
    components: {
      Preloader,
      Error,
      Success,
      Status,
      DealsActions
    },
    computed: {
      ...mapGetters([
        'loading',
        'error',
      ]),
      ...mapState([
        'deals_active',
      ]),
      haveActiveDeals() {
        return this.deals_active.data && this.deals_active.data.length > 0;
      },
      showPagination() {
        return this.deals_active.total > 1;
      },
      showLoading() {
        return this.loading(METHODS.DEALS_ACTIVE) === 'loading' && !this.no_loading
      },
      showError() {
        if (this.error(this.method_pay) !== undefined && this.error(this.method_pay) !== '') {
          return true;
        }
        return this.error(this.method_cancel) !== undefined && this.error(this.method_cancel) !== '';
      },
      getMessage() {
        if (this.error(this.method_pay) !== undefined && this.error(this.method_pay) !== '') {
          return this.error(this.method_pay);
        }
        return this.error(this.method_cancel)
      },
      show() {
        return this.success_cancel_request || this.success_pay_request || this.copy_success;
      },
      getSuccessMessage() {
        if (this.success_pay_request) {
          return 'Покупка успешно оплачена';
        } else if (this.copy_success) {
          return 'Успешно скопировано'
        }
        return 'Покупка успешно отменена';
      },
    },
    watch: {
      current_page: function (val) {
        this.no_loading = false;
        this.getActiveDeals({ page: val });
        this.$refs.deal_active.scrollIntoView();
      },
    },
    mounted() {
      this.getActiveDeals({ page: 1 });
      this.interval = setInterval(() => {
        this.no_loading = true; // Выключаем loading, чтоб не мешал при обновлении страницы
        this.getActiveDeals({ page: this.current_page });
      }, this.interval_time || INTERVAL_TIME);
    },
    beforeDestroy() {
      this.interval = clearInterval(this.interval);
    },
    methods: {
      ...mapActions([
        'getActiveDeals',
      ]),
      ...mapMutations([
        'removeError',
      ]),
      setPage(page) {
        this.$set(this, 'current_page', page)
      },
      async copy(id) {
        let [data] = this.$refs[id];
        await navigator.clipboard.writeText(data.innerText);
        this.copy_success = true;
      },
      close(type) {
        if (type === 'error') {
          this.removeError(this.method);
        } else {
          this.success_pay_request = false;
          this.success_cancel_request = false;
          this.copy_success = false;
        }
      },
      dealWait(deal) {
        return deal.status === 'Verification' || deal.status === 'Verified';
      },
      dealSellerRequisite(deal) {
        return deal.status === 'Seller requisite';
      },
      resultOfActions(result){
        this.success_cancel_request = result.success_cancel_request;
        this.success_pay_request = result.success_pay_request;
      }
    },
  }
</script>

<style scoped>

</style>
