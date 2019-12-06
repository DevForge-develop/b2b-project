<template lang="pug">
  div
    .card.card-search
      .card-header
        strong.card-title Покупка
      .card-body
        div(v-if="haveBestBuy")
          .row(v-for='offer in best_buy', :key='offer.id')
            .col
              .row.mb-3
                .col Цена:&nbsp;
                  strong {{ convertStringToNumber(offer.rate) }} руб.
                  preloader(:show="showLoading")
              .row.mb-2
                .col Минимальная сумма:&nbsp;
                  strong {{ convertStringToNumber(limit_min) }} руб.
                .col Максимальная сумма:&nbsp;
                  strong {{ convertStringToNumber(limit_max) }} руб.
              form(@submit.prevent="newDeal(offer.id, offer.rate)")
                .row.mb-25
                  .col
                    input.form-control(type='text', v-model='deal_sum', placeholder="Введите сумму", required)
                .row
                  .col
                    input.btn.btn-success.w-100(type='submit', value='Купить BTC')
        .text-center(v-else) Сервис временно не доступен
        success(message="Покупка успешно создана", :show="success_request"  @close="close")
        error(message="Ошибка создания, попробуйте позже", :show="showError" @close="close")
</template>

<script>
  import { mapGetters, mapActions, mapState, mapMutations } from 'vuex';
  import Preloader from "@/components/helpers/Preloader";
  import Success from "@/components/helpers/Success";
  import Error from "@/components/helpers/Error";
  import { LIMIT_MAX, LIMIT_MIN, METHODS } from "../../store/const";
  import utils from "@/components/mixins/utils";

  export default {
    name: "DealCreate",
    components: {
      Preloader,
      Success,
      Error,
    },
    mixins:[utils],
    data() {
      return {
        deal_sum: '',
        method: METHODS.CREATE_DEAL,
        success_request: false,
        limit_min: LIMIT_MIN,
        limit_max: LIMIT_MAX,
      }
    },
    computed: {
      ...mapState([
        'best_buy',
      ]),
      ...mapGetters([
        'loading',
        'error',
      ]),
      haveBestBuy() {
        return this.best_buy.length > 0;
      },
      showLoading() {
        return this.loading(METHODS.CREATE_DEAL) === 'loading' || this.loading(METHODS.BEST_BUY) === 'loading'
      },
      showError() {
        return this.error(this.method) !== undefined && this.error(this.method) !== '';
      },
    },
    methods: {
      ...mapActions([
        'createNewDeal',
        'getActiveDeals',
      ]),
      ...mapMutations([
        'removeError',
      ]),
      async newDeal(offer_id, rate) {
        this.success_request = false;
        const create = await this.createNewDeal({
          data: {
            offer_id: offer_id,
            rate: rate,
            sum: this.deal_sum,
          },
        });
        if (create) {
          this.success_request = true;
          this.deal_sum = '';
          this.getActiveDeals({ page: 1 })
        }
      },
      close(type) {
        if (type === 'error') {
          this.removeError(this.method);
        } else {
          this.success_request = false
        }
      },
    },
  }
</script>

<style scoped>
  .card-search {
    min-height: 237px;
  }

  .mb-25 {
    margin-bottom: 0.7rem !important;
  }
</style>
