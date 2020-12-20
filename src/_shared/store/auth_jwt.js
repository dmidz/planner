
import merge from '@/utils/merge';
import jsonParse from '@/utils/jsonParse';

import CONSTANTS from '@/constants';
const isDev = CONSTANTS.DEV;

export default function ( axios, router, _options ){
  const options = {
    loginURL: '/login',//__ API login
    loginFormRoute: 'login',
  };

  if( _options ){     merge( options, _options );}

  const hasLoginRoute = router && options.loginFormRoute;

  const requestConf = {
    headers: {
      authorization: null,
    },
  };

  if( axios ){
    axios.interceptors.request.use(function ( config) {
      config = merge( config||{}, requestConf );
      // console.log('request interceptor', config );
      return config;
    }, function (error) {
      return Promise.reject(error);
    });

    axios.interceptors.response.use(function (response) {
      // Any status code that lie within the range of 2xx cause this function to trigger
      // Do something with response data
      return response;
    }, function (error) {
      const res = error.response;
      console.log(' request error', res );
      switch( res.status ){
        case 401 :
          if( hasLoginRoute && res.headers['www-authenticate'].match(/expired/i) ){
            router.push({ name: options.loginFormRoute });
          }
          break;
      }
      return Promise.reject(error);
    });
  }

	return {
		namespaced: true,
    state: function() {
		  const res = {
        token: isDev ? localStorage.getItem('token' ) : null,
        user: isDev ? jsonParse( localStorage.getItem('user' ) ) : null,
      };
      requestConf.headers.authorization = res.token;
      if( !res.token && hasLoginRoute ){
        router.push({ name: options.loginFormRoute } );
      }
		  return res;
    },
		actions:{
      login: ( { commit }, credentials ) => {
        return axios.post( options.loginURL, credentials )
        .then( ( res ) => {
          // console.log('>>> on login', res );
          commit('setAuth', { user: res.data, token:res.headers.authorization });
          return res.data;
        })
        // .catch(function ( err ) {
        //   console.error( err );
        //   throw err;
        // })
        ;
      },
      logout: ( { commit } ) => {
        return Promise.resolve( ( ) => {
          commit('setAuth', { user: null, token:null });
        });
      },
		},
		mutations:{
      setAuth: ( state, { token, user } ) => {
        requestConf.headers.authorization = token;
        state.token = token;
        state.user = user;
        if( isDev ){
          token ? localStorage.setItem('token', token ) :  localStorage.removeItem('token' );
          user ? localStorage.setItem('user', JSON.stringify( user ) ) :  localStorage.removeItem('user' );
        }
        // console.log('setAuth', state );
      },
		},
		// getters:{
		// 	test_obj( state, getters, rootState, rootGetters ){
		// 		console.log('test_obj changed', state.test_obj );
		// 		return state.test_obj;
		// 	}
		// }
	};

};

