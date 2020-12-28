
// import _ from 'dmidz-node-utils';

import merge from '@/utils/merge';
import storeRest from '@shared/store/rest';
// import storeRest from '@services/store-rest';

export default function ( axios, _options ){

	const options = merge({
		api_rest:{
			urlPrefix: '/Task',
		}
	}, _options );


	const res = merge( storeRest( axios, options.api_rest ), {
		namespaced: true,
		actions:{
			addChild: function( context, child ){

				context.commit('setRecordProperty', ['children_create', {name:'New Task'}]);
			},
		},
		mutations:{
			// addChild( state, id){
			// }
		},
		// getters:{
		// 	test_obj( state, getters, rootState, rootGetters ){
		// 		console.log('test_obj changed', state.test_obj );
		// 		return state.test_obj;
		// 	}
		// }
	}, true );

	// console.log('..module tasks', res );

	return res;
};

