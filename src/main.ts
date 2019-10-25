import Vue from 'vue';
import App from './views/App.vue';
import router from './router';
import moment from 'moment';

//import './registerServiceWorker';
import TreeView from "vue-json-tree-view"

Vue.use(TreeView)

import VTooltip from 'v-tooltip';

Vue.use(VTooltip);
Vue.use(require('vue-moment'));

// Load every component from _common
const req = require.context('./components/', true, /\.(js|svg|vue)$/i)
for (const key of req.keys()) {
  const name = key.match(/\w+/)![0]
  Vue.component(name, req(key).default)
}


// Load every svg 
const svgRequire = require.context('./svg/', true, /\.svg$/i)

for (const key of svgRequire.keys()) {
  const name = key.match(/\w+/)![0]
  Vue.component(`${name}${name.endsWith('Svg') ? '' : 'Svg'}`, svgRequire(key).default)
}


Vue.directive('moment-ago', {

  // puke :( 
   
  bind (el, timestamp) {
    el.innerHTML = moment(timestamp.value).fromNow();
    if ((el as any).__$_interval) { clearInterval((el as any).__$_interval); }

    (el as any).__$_interval = setInterval(() => {
      el.innerHTML = moment(timestamp.value).fromNow()
    }, 7000);
  },
  
  update (el, timestamp) {  
    el.innerHTML = moment(timestamp.value).fromNow();
    if ((el as any).__$_interval) { clearInterval((el as any).__$_interval); }
    (el as any).__$_interval = setInterval(() => {
      el.innerHTML = moment(timestamp.value).fromNow()
    }, 7000);
  },

  unbind (el) {
    if ((el as any).__$_interval) { clearInterval((el as any).__$_interval); }
  }

})

router.beforeEach((to, from, next) => {
  next();
})

Vue.config.productionTip = false;

new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app');
