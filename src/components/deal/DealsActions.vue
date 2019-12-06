<template lang="pug">
  .text-center.wrapper
    .row.mb-3(v-if="showPayButton(deal.status)")
      .col
        input.form-control.w-100(
        v-model="phone",
        :disabled="phoneDisabled(deal)",
        placeholder="4 последних цифры номера телефона"
        )
    .row.mb-3(v-if="showPayButton(deal.status)")
      .col
        button.btn.btn-success.w-100(@click='payDeal(deal.id)' :disabled="payDisabled(deal)") Оплачено
    .row.mb-3
      .col
        button.btn.btn-danger.w-100(@click='cancelDeal(deal.id)' :disabled="disable_buttons") Отмена
    preloader(:show="showLoading")
</template>

<script>
  import {mapActions, mapGetters} from "vuex";
  import {METHODS} from "../../store/const";
  import Preloader from "@/components/helpers/Preloader";

  export default {
    name: "DealsActions",
    props:{
      deal: Object
    },
    components:{
      Preloader
    },
    data(){
      return {
        disable_buttons: false,
        method_pay: METHODS.PAY_DEAL,
        method_cancel: METHODS.CANCEL_DEAL,
        phone: '',
        no_loading: true
      }
    },
    computed: {
      ...mapGetters([
        'loading',
      ]),
      showLoading() {
        return this.loading(METHODS.DEALS_ACTIVE) === 'loading' && !this.no_loading
      },
    },
    methods: {
      ...mapActions([
        'requestPayDeal',
        'requestCancelDeal',
        'getActiveDeals',
      ]),
      async payDeal(id) {
        this.disable_buttons = true;
        this.method_pay = this.method_pay.replace(':id:', id);
        const pay = await this.requestPayDeal({
          id: id,
          requisite: this.phone,
        });
        if (pay) {
          this.no_loading = false;
          this.phone = '';
          this.$emit('success', {
            success_pay_request: true,
            success_cancel_request: false
          });
          const active_deal = await this.getActiveDeals({ page: 1 });
          if(active_deal){
            this.no_loading = true;
          }
        }
        this.disable_buttons = false;
      },
      async cancelDeal(id) {
        this.no_loading = false;
        this.disable_buttons = true;
        this.method_cancel = this.method_cancel.replace(':id:', id);
        const cancel = await this.requestCancelDeal({ id: id });
        if (cancel) {
          this.$emit('success', {
            success_pay_request: false,
            success_cancel_request: true
          });
          const active_deal = await this.getActiveDeals({ page: 1 });
          if(active_deal){
            this.no_loading = true;
          }
        }
        this.disable_buttons = false;
      },
      showPayButton(status) {
        return status === 'Verification' || status === 'Verified' || status === 'Seller requisite'
      },
      phoneDisabled(deal) {
        return this.disabled(deal)
      },
      payDisabled(deal) {
        return this.disabled(deal) || !this.isNumeric(this.phone) || this.phone.length !== 4;
      },
      disabled(deal) {
        return this.disable_buttons || deal.status === 'Verification'
          || deal.status === 'Verified'
      },
      isNumeric(value) {
        return /^\d+$/.test(value);
      }
    },
  }
</script>

<style scoped>
  .wrapper{
    position: relative;
  }
</style>
