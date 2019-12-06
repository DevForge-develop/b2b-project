import config from '../../config';

export const METHODS = {
  BALANCE_BTC: 'balance/btc',
  PAY_DEAL: 'deal/paid/:id:',
  CANCEL_DEAL: 'deal/cancel/:id:',
  CREATE_DEAL: 'deal/btc/qiwi',
  DEALS_INACTIVE: 'deals_inactive',
  DEALS_ACTIVE: 'deals_active',
  BEST_BUY: 'best-buy/btc/qiwi',
  LOGIN: 'login',
  WITHDRAW: 'withdraw/btc',
  WITHDRAW_HISTORY: 'withdraw/btc/history',
  WITHDRAW_COMMISSION: 'withdraw-commission/btc',
};
export const API_URL = config.api_url;
export const INTERVAL_TIME = config.interval_time;
export const LIMIT_MIN = config.limit_min;
export const LIMIT_MAX = config.limit_max;
