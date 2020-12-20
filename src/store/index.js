
import Vue from 'vue'
import Vuex from 'vuex'
import Axios from 'axios';

import CONSTANTS from '@/constants';
import router from '@/router';
import tasks from './tasks';
import auth_jwt from '@shared/store/auth_jwt';

Vue.use( Vuex );

// console.log('# ENV', process.env );

const axios = Axios.create( {
	baseURL: CONSTANTS.API_URL,
} );
//__ app config
// const config = {
// 	api_base:'http://api-rest.local:7678/api'//http://localhost:3000/api'
// };


export default new Vuex.Store( {
	strict: process.env.NODE_ENV !== 'production',
	namespaced: true,
	state : {
	},
	actions:{
	},
	getters : {
		// api_base(){	return config.api_base;}
	},
	mutations : {
	},
	modules: {
    // auth: auth_jwt( axios, router, {
    // }),
		tasks : tasks( axios, {
			// api_rest:{
			// }
		}),
	}
	// , plugins: debug ? [createLogger()] : []
} );
