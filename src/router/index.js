import Vue from 'vue';
import VueRouter from 'vue-router';
// import isString from 'lodash/isString';

import Home from '@pages/Home';
import routerPatchNavigationDup from "@/utils/routerPatchNavigationDup";
// import DemoTemplate from '@pages/DemoTemplate';
// import CONSTANTS from '@/constants';

Vue.use( VueRouter );

const router = new VueRouter({
  routes: [
  	{
  		path: '/',
  		name: 'home',
  		component: Home,
  	},
  ],
});

routerPatchNavigationDup( router );

// router.onError( error => {
// 	console.log('router err', error );
// });

export default router;
