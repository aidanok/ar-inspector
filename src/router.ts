import Vue from 'vue';
import Router from 'vue-router';
import Filters from './views/Filters.vue';
import Blocks from './views/Blocks.vue';
import ViewTransaction from './views/ViewTransaction.vue';
import Transactions from './views/Transactions.vue';
import Notifications from './views/Notifications.vue';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/transactions'
    },
    {
      path: '/transactions',
      name: 'transactions',
      component: Transactions,
    },
    {
      path: '/blocks',
      name: 'blocks',
      component: Blocks, 
    },
    {
      path: '/filters',
      name: 'filters',
      component: Filters, 
    },
    {
      path: '/tx/:id?',
      name: 'tx',
      component: ViewTransaction,
      props: true
    },
    {
      path: '/notifications',
      name: 'notifications',
      component: Notifications,
    }
  ],
});
