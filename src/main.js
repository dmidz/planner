import Vue from 'vue';
import App from './App.vue';
// import './registerServiceWorker';
import router from './router';
import store from './store';

Vue.config.productionTip = false;

import pluginLog from '@/plugins/pluginLog';
Vue.use( pluginLog );

// import { BootstrapVue/*, IconsPlugin*/ } from 'bootstrap-vue';
// Vue.use( BootstrapVue );

new Vue({
  router,
  store,
  render: h => h( App ),
}).$mount('#app');

if( module.hot ){
  module.hot.accept();
  
  module.hot.addStatusHandler( status => {
    if( status === 'prepare' ){ console.clear();}
  } );
}
