<template lang="pug">
  .card.withdraw-card
    .card-header
      strong.card-title Вывод
    .card-body
      form
        .row
          .col
            label(for='wallet') Кошелек
            input.form-control#wallet(type='text', v-model='wallet')
          .col
            label(for='amount') Сумма для вывода (BTC)
            input.form-control#amount.mb-3(type='text', v-model='amount' @keyup="cancelAllWithdraw")
        .row
          .col
            input.btn.btn-success.w-100(type='submit', value='Вывести' :disabled="disableWithdraw" @click.prevent="withdrawBtc")
          .col
            input.btn.btn-success.w-100(type='submit', value='Выбрать всю сумму' @click.prevent="selectAllAmount()")
      .row.mt-4
        .col Сумма на вывод: {{ totalAmount }} BTC, из них комиссия: {{ commission_amount }} BTC
      .row
        .col
          success(message="Вывод успешно осуществлен", :show="success_request"  @close="close")
          error(:message="getMessage", :show="showError" @close="close")
    preloader(:show="showLoading")
</template>

<script>
  import { mapActions, mapGetters, mapMutations, mapState } from 'vuex';
  import { METHODS } from "../../store/const";
  import Preloader from "@/components/helpers/Preloader";
  import Error from "@/components/helpers/Error";
  import Success from "@/components/helpers/Success";
  import utils from "@/components/mixins/utils";

  export default {
    name: "Withdraw",
    components: {
      Preloader,
      Error,
      Success,
    },
    mixins: [utils],
    data() {
      return {
        wallet: '',
        amount: 0,
        commission_amount: 0,
        method: METHODS.WITHDRAW,
        success_request: false,
        is_edit: false,
        withdraw_all: false,
      }
    },
    computed: {
      ...mapGetters([
        'loading',
        'error',
      ]),
      ...mapState({
        'request_withdraw': 'withdraw',
        'withdraw_commission': 'commission',
        'get_balance': 'balance',
      }),
      showLoading() {
        return this.loading(METHODS.WITHDRAW) === 'loading'
      },
      smallerThanCommission() {
        return this.convertStringToNumber(this.amount) < this.convertStringToNumber(this.withdraw_commission.minCommission);
      },
      emptyAmount() {
        return this.convertStringToNumber(this.amount) <= 0 || Number.isNaN(this.convertStringToNumber(this.amount));
      },
      totalAmount() {
        let sum = this.floatPlus(this.amount, this.commission_amount);
        if (Number.isNaN(sum)) {
          return 0;
        }
        return sum;
      },
      tooBigAmount() {
        return this.totalAmount > this.get_balance.balance;
      },
      emptyWallet() {
        return this.wallet === '';
      },
      disableWithdraw() {
        return this.emptyAmount || this.tooBigAmount || this.emptyWallet || this.smallerThanCommission;
      },
      haveRequestError() {
        return this.error(this.method) !== undefined && this.error(this.method) !== ''
      },
      showError() {
        return this.haveRequestError || (this.disableWithdraw && this.is_edit);
      },
      getMessage() {
        if (this.is_edit) {
          if (this.emptyAmount) {
            return 'Введите сумму';
          } else if (this.tooBigAmount) {
            return 'Сумма вывода больше доступной';
          } else if (this.emptyWallet) {
            return 'Введите кошелек';
          } else if (this.smallerThanCommission) {
            return 'Сумма меньше, чем минимальная комиссия';
          } else {
            return '';
          }
        } else {
          return this.error(this.method);
        }
      },
    },
    watch: {
      amount(val) {
        this.is_edit = true;
        if(!this.withdraw_all){
          let amount = val;
          if(typeof amount === 'string'){
            this.amount = amount.replace(',', '.');
          }
          if(Number.isNaN(this.amount)){
            this.amount = 0;
          }
          this.commission_amount = this.calculateCommission(this.convertStringToNumber(this.amount));
        }
      },
      wallet() {
        this.is_edit = true;
      },
    },
    methods: {
      ...mapActions([
        'withdraw',
      ]),
      ...mapMutations([
        'removeError',
      ]),
      cancelAllWithdraw(){
        this.withdraw_all = false;
      },
      async withdrawBtc() {
        this.is_edit = false;
        let request = await this.withdraw({
          data: {
            wallet: this.wallet,
            amount: this.amount,
          },
        });
        if (request) {
          this.success_request = true;
          this.wallet = '';
          this.amount = 0;
        }
      },
      calculateCommission(sum) {
        let commission = sum / 100 * this.withdraw_commission.percent;
        let calculation = Math.max(this.withdraw_commission.minCommission, commission);
        if (Number.isNaN(calculation)) {
          return this.withdraw_commission.minCommission;
        } else {
          return this.convertStringToNumber(calculation);
        }
      },
      close(type) {
        if (type === 'error') {
          this.is_edit = false;
          this.removeError(this.method);
        } else {
          this.success_request = false
        }
      },
      selectAllAmount() {
        this.withdraw_all = true;
        this.commission_amount = this.calculateCommission(this.convertStringToNumber(this.get_balance.balance));
        this.amount = this.floatPlus(this.get_balance.balance, -this.commission_amount);
      },
    },
  }
</script>

<style scoped>
  .withdraw-card {
    min-height: 266px;
  }
</style>
