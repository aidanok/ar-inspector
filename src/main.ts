import Vue from 'vue';
import App from './views/App.vue';
import router from './router';
import VTooltip from 'v-tooltip';
//import './registerServiceWorker';


//Vue.use(TreeView)
Vue.use(VTooltip)

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

router.beforeEach((to, from, next) => {
  next();
})

Vue.config.productionTip = false;

new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app');
