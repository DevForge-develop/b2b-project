import Vue from 'vue'
import store from '../store/index';
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Login from "../views/Login";
import BestBuy from "../views/BestBuy";
import Wallet from "../views/Wallet";

Vue.use(VueRouter);

const ifAuthenticated = (to, from, next) => {
  if (store.getters.getToken !== '') {
    next();
    return;
  }
  next('/login');
};

const routes = [
  {
    path: '/login',
    name: 'login',
    component: Login,
  },
  {
    path: '/',
    component: Home,
    beforeEnter: ifAuthenticated,
    children: [
      {
        path: '/',
        name: 'best-buy',
        component: BestBuy,
        beforeEnter: ifAuthenticated,
      },
      {
        path: '/wallet',
        name: 'wallet',
        component: Wallet,
        beforeEnter: ifAuthenticated,
      },
    ],
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

router.afterEach(() => { // Очищаем ошибки запросов после выхода с роута
  store.commit('clearAllError');
});

export default router
