<template lang="pug">
	.col.login()
		h1 Login
		form.col(v-on:submit="onSubmit")
			//.user(v-if="user") {{user.pseudo}}
			.msg-user(v-if="loginMessage" :class="loginSuccess?'success':'error'") {{loginMessage}}
			Field(label="login" name="login" v-on:change="onChange" v-bind:value="values.login")
			Field(label="password" name="password" type="password" v-on:change="onChange" v-bind:value="values.password")
			button(type="submit") Login

</template>

<script>

import get from 'lodash/get';
import {mapState} from 'vuex';
import Field from '@shared/components/Fields/Field';
import CONSTANTS from '@/constants';

// console.log( 'CONSTANTS', CONSTANTS );

export default {
	name: 'login',
	components: { Field },
	props: {
		onLoginRedirect: { type: String, default: '/' }
	},
	data(){
		return {
			loginMessage: null,
			loginSuccess: false,
			values: {
				login: 'user1@domain.org',
				password: 'demo',
				// login: CONSTANTS.DEV ? 'user1@domain.org' : null,
				// password: CONSTANTS.DEV ? 'demo' : null,
			},
		}
	},
	mounted: function(){
		// console.log('mounted', this );
	},
	computed: mapState( {
		user: state => {
			// console.log('userPseudo', state.auth.user );
			return state.auth.user;
		}
	} ),
	methods: {
		onSubmit( event ){
			// console.log('onSubmit', event );
			this.loginMessage = null;
			this.$store.dispatch( 'auth/login', { login: this.values.login, password: this.values.password } )
			.then( () => {
				this.loginSuccess = true;
				this.loginMessage = 'Login ok';
				this.$router.push( { path: this.onLoginRedirect } );
			} )
			.catch( ( err ) => {
				this.log( 'err', [err] );
				//Network Error
				this.loginSuccess = false;
				this.loginMessage = err.message;
				
				const status = get( err, 'response.status' );
				if( status ){
					switch( status ){
						case 404 :
							this.loginMessage = 'Not Found.';
							break;
						default:
							this.loginMessage = 'Wrong credentials.';
							break;
					}
				}
			} );
			event.preventDefault();
			return false;
		},
		onChange( value, name, event ){
			this.$set( this.values, name, value );
			// console.log('onChange', value, name, this.values/*, event*/ );
		},
	}
}
</script>

<style lang="scss">
login {
	padding: 10px;
}

form {
	width: 600px;
	padding: 10px;
}
</style>
