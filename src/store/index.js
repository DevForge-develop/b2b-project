import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import router from "../router";
import { API_URL, METHODS } from './const';

Vue.use(Vuex);

/**
 * Обработка ошибок в запросах
 * Используется в get_request, post_request
 * В случае 401 ошибки делает logout
 * @param e
 * @param commit
 * @param method
 * @param error
 * @returns {Promise<void>}
 */
const handleError = async (e, commit, method, error) => {
  commit('setLoading', {
    name: method,
    value: 'error',
  });
  if (e.response && e.response.status === 401 || !e.response) {
    commit('setToken', '');
    commit('updateState', {
      name: 'user_login',
      data: '',
    });
    await router.push({ name: 'login' });
    return;
  }
  let error_message = 'Что-то пошло не так, обратитесь в тех. поддержку';
  if (error) {
    error_message = error;
  } else if (e.response.data && e.response.data.error) {
    error_message = e.response.data.error;
    commit('setError', {
      name: method,
      value: e.response.data.error,
    })
  }
  commit('setError', {
    name: method,
    value: error_message,
  })
};

const getDefaultState = () => {
  return {
    token: localStorage.getItem('token') || '',
    user_login: localStorage.getItem('user_login') || '',
    deals_inactive: [],
    deals_active: [],
    best_buy: [],
    withdraw: {},
    withdraw_history: {},
    loading: {},
    error: {},
    balance: {
      balance: 0,
      blocked: 0,
    },
    commission: {},
    deal_pay: {},
    deal_cancel: {},
    create_deal: null,
    sidebar: false,
  }
};

export default new Vuex.Store({
  state: getDefaultState(),
  getters: {
    loading: (state) => name => name ? state.loading[name] : state.loading,
    error: (state) => name => name ? state.error[name] : state.error,
    getSidebar: state => state.sidebar,
  },
  mutations: {
    setToken(state, token) {
      state.token = token;
    },
    updateState(state, { name, data }) {
      Vue.set(state, name, data);
    },
    removeError(state, name) {
      Vue.set(state.error, name, '');
    },
    clearAllError(state) {
      Vue.set(state, 'error', {});
    },
    setLoading(state, { name, value }) {
      Vue.set(state.loading, name, value);
    },
    setError(state, { name, value }) {
      Vue.set(state.error, name, value);
    },
    clearState(state) {
      Object.assign(state, getDefaultState());
    },
  },
  actions: {
    /**
     * Запрос GET
     * @param state
     * @param commit
     * @param dispatch
     * @param method - url на который будет идти запрос
     * @param name - имя мутации, что будет выполнена в случае успешного запроса
     * @param params - объект с параметрами, ключ -> значение, будет добавлен ?key=valye
     * @param with_token - отправлять токен?
     * @param error - какую ошибку вывести в случае неудачи? Если не задавать, то выведется ошибка с запроса
     * @param no_commit - не делать мутацию после запроса? По умолчанию мутация выполняется
     * @returns {Promise<AxiosResponse<T>>}
     */
    async get_request({ state, commit, dispatch }, { method, name, params, with_token = true, error = '', no_commit = false }) {
      const config = {};
      if (with_token) {
        config.headers = { Authorization: 'Bearer ' + state.token };
      }
      if (params) {
        config.params = params;
      }
      commit('setLoading', {
        name: method,
        value: 'loading',
      });
      commit('removeError', method);
      try {
        let request = await axios.get(API_URL + method, config);
        commit('setLoading', {
          name: method,
          value: 'loaded',
        });
        if (no_commit === false) {
          commit('updateState', {
            name,
            data: request.data,
          });
        }
        return request;
      } catch (e) {
        await handleError(e, commit, method, error);
      }
    },

    /**
     * Запрос POST
     * @param state
     * @param commit
     * @param dispatch
     * @param method - url на который будет идти запрос
     * @param name - имя мутации, что будет выполнена в случае успешного запроса
     * @param body - тело/данные запроса
     * @param id - id для замены в url
     * @param with_token - отправлять токен?
     * @param error - какую ошибку вывести в случае неудачи? Если не задавать, то выведется ошибка с запроса
     * @param no_commit - не делать мутацию после запроса? По умолчанию мутация выполняется
     * @returns {Promise<AxiosResponse<T>>}
     */
    async post_request(
      { state, commit, dispatch },
      { method, name, body = {}, id = null, with_token = true, error = '', no_commit = false },
    ) {
      const config = {};
      if (with_token) {
        config.headers = { Authorization: 'Bearer ' + state.token };
      }
      if (id) {
        method = method.replace(':id:', id);
      }
      commit('setLoading', {
        name: method,
        value: 'loading',
      });
      commit('removeError', method);
      try {
        let request = await axios.post(API_URL + method, body, config);
        commit('setLoading', {
          name: method,
          value: 'loaded',
        });
        if (no_commit === false) {
          commit('updateState', {
            name,
            data: request.data,
          });
        }
        return request;
      } catch (e) {
        await handleError(e, commit, method, error);
      }
    },
    /**
     * Запрос на авторизацию
     * в случае успешной авторизации задает записывает token и user_login в localstorage
     * @param dispatch
     * @param commit
     * @param data
     * @returns {Promise<void>}
     */
    async login({ dispatch, commit }, data) {
      let request = await dispatch('post_request', {
        method: METHODS.LOGIN,
        name: 'balance',
        body: data,
        error: 'Ошибка авторизации',
      });

      if (request) {
        localStorage.setItem('token', request.data.token);
        localStorage.setItem('user_login', data.login);
        commit('setToken', request.data.token);
        commit('updateState', {
          name: 'user_login',
          data: data.login,
        });

        await router.push({ name: 'best-buy' });
      }
    },
    /**
     * Запрос на получение баланса пользователя
     * @param commit
     * @param dispatch
     * @returns {Promise<void>}
     */
    async requestBalance({ commit, dispatch }) {
      let request = await dispatch('get_request', {
        method: METHODS.BALANCE_BTC,
        name: 'balance',
        no_commit: true,
      });

      commit('updateState', {
        name: 'balance',
        data: request.data.shift(),
      });
    },
    /**
     * Запрос на получение активных сделок
     * @param dispatch
     * @param page - номер страницы для отображения
     */
    async getActiveDeals({ dispatch }, { page }) {
      return await dispatch('get_request', {
        method: METHODS.DEALS_ACTIVE,
        name: 'deals_active',
        params: { page },
      });
    },
    /**
     * Запрос на получение завершенных сделок
     * @param dispatch
     * @param page
     */
    getInactiveDeals({ dispatch }, { page }) {
      dispatch('get_request', {
        method: METHODS.DEALS_INACTIVE,
        name: 'deals_inactive',
        params: { page },
      });
    },
    /**
     * Запрос на создание сделки
     * @param dispatch
     * @param data
     * @returns {Promise<*>}
     */
    async createNewDeal({ dispatch }, { data }) {
      return await dispatch('post_request', {
        method: METHODS.CREATE_DEAL,
        body: data,
        name: 'create_deal',
      });
    },
    /**
     * Запрос на оплату сделки
     * @param dispatch
     * @param state
     * @param id
     * @param requisite
     * @returns {Promise<*>}
     */
    async requestPayDeal({ dispatch, state }, { id, requisite }) {
      return await dispatch('post_request', {
        method: METHODS.PAY_DEAL,
        name: 'deal_pay',
        body: {
          requisite,
        },
        id,
      });
    },
    /**
     * Запрос на отмену сделки
     * @param dispatch
     * @param state
     * @param id
     * @returns {Promise<*>}
     */
    async requestCancelDeal({ dispatch, state }, { id }) {
      return await dispatch('post_request', {
        method: METHODS.CANCEL_DEAL,
        name: 'deal_cancel',
        id,
      });
    },
    /**
     * Запрос на лучшее объявление
     * @param dispatch
     * @param data
     */
    bestBuy({ dispatch }, { data }) {
      dispatch('get_request', {
        method: METHODS.BEST_BUY,
        name: 'best_buy',
        params: data,
      });
    },
    /**
     * Запрос на вывод
     * @param dispatch
     * @param state
     * @param data
     * @returns {Promise<*>}
     */
    async withdraw({ dispatch, state }, { data }) {
      data.login = state.user_login;
      return await dispatch('post_request', {
        method: METHODS.WITHDRAW,
        name: 'withdraw',
        body: data,
      });
    },
    /**
     * Запрос на получение комиссий для текущего авторизованного пользователя
     * @param dispatch
     * @param state
     */
    withdrawCommission({ dispatch, state }) {
      dispatch('post_request', {
        method: METHODS.WITHDRAW_COMMISSION,
        name: 'commission',
        body: { login: state.user_login },
      });
    },
    /**
     * Запрос на получение истории выводов
     * @param dispatch
     * @param page
     */
    withdrawHistory({ dispatch }, { page }) {
      dispatch('get_request', {
        method: METHODS.WITHDRAW_HISTORY,
        name: 'withdraw_history',
        params: { page },
      });
    },
    /**
     * Выход из приложения
     * @param commit
     */
    async requestLogout({ commit }) {
      localStorage.removeItem('token');
      localStorage.removeItem('user_login');
      commit('clearState');
      await router.push({ name: 'login' });
    },
  },
})
