
// import { isNil, get } from 'lodash'
import merge from '@/utils/merge';

export default function( axios, _options ){
	const options = merge( {
		urlPrefix: '/MyEntity'
	}, _options );

	return {
		// actions,
		// getters,
		// namespaced: true,
		state : function(){
			// console.log('state creation');
			return {
				record:{},
				records:[],
				changes:{},
				test:{}
			};
		},
		getters:{
			records( state, getters ){
				// console.log('records changed', state.records );
				return state.records;
			},
			record( state, getters ){
				// console.log('record changed', state.record );
				return state.record;
			}
		},
		actions : {
			create: function( context, properties ){
				return axios.post( options.urlPrefix+'/', { data: properties } )
				.then( ( res ) => {
					context.commit('setCreated', res.data );
					return res.data;
				})
				.catch(function( err ){
					console.error(err );
				})
				;
			},
			read: function( context, idOrParams ){
				// console.log( 'read', this );
				let t = typeof idOrParams;
				const is_single = t === 'string' || t === 'number';
				let pr;
				if( is_single ) pr = axios.get( options.urlPrefix+'/' + idOrParams );
				else{
					// console.log('__ get collection', axios.defaults );
					pr = axios.get( options.urlPrefix+'', { params: idOrParams } );
				}

				return pr.then(function( res ){
					// console.log('RES', res );
					if( is_single ){
						context.commit('setRecord', res.data );
					}else{
						context.commit('setRecords', res.data );
					}
					return res.data;
				})
				.catch(function( err ){
					console.error(err );
				})
				;
			},
			update: function( context, id, changes ){
				// id = id || context.state.record.id;
				// if( context.state.changes[id]) properties = Object.assign({}, context.state.changes[id], properties );
				return axios.patch( options.urlPrefix+'/' + id, changes )
				.then( ( res ) => {
					context.commit('setUpdated', { id, changes } );
					// context.commit('applyRecordChanges', id);
				})
				.catch(function( err ){
					console.error(err );
				})
				;
			},
			delete: function( context, id ){
				id = id || context.state.record.id;
				return axios.delete( options.urlPrefix+'/' + id );
			},
			send: function( context, options ){
				return axios.request( options );
			},
			//__ changes
			// updateChanges( context ){
			// 	return context.dispatch('update', context.state.record.id, context.state.changes );
			// }
		},
		mutations : {
			setRecords : function( state, records ) {
				// console.log('...state setRecords', records.length, records );
				state.records = records;
			},
			setRecord : function( state, record ){
				state.record = record;
			},
			setCreated : function( state, created ){
				state.created = created;
			},
			setUpdated : function( state, updated ){
				state.updated = updated;
			},
			setDeleted : function( state, deleted ){
				state.deleted = deleted;
			},
			applyRecordChanges( state, id){
				const changes = state.changes[id];
				if(!changes)	return;
				// changes.title += ' modified';
				Object.assign(state.record, changes);
				console.log('applyRecordChanges', state.record);
			},
			// setRecordProperty : function( state, [property, value, id] ){
			// 	id = id || state.record.id;
			// 	if(!state.changes[id])		Vue.set(state.changes, id, {} );
			// 	Vue.set(state.changes[id], property, value );
			// 	// console.log('setRecordProperty', property, value, id, state.changes);
			// },
			// pushRecordProperty : function( state, [property, value, id] ){
			// 	id = id || state.record.id;
			// 	const arr = get(state.changes[id], property, []);
			// 	arr.push(value);
			// 	// console.log('setRecordProperty', property, value, id, state.changes);
			// },
		}
	};
};
