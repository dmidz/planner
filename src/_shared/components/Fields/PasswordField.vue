<template lang="pug">
	input(type="password" v-bind:value="c_value" v-bind:name="name" v-on:input="onChange")

</template>

<script>
	export default {
		name: 'field-text',
		components : {
		},
		props : {
			value:{
				default: null
			},
			name: {
				default: null, type: String
			},
			multiline: {
				default: false
			}
		},
		data(){
			return {
				c_value: null
			}
		},
		mounted(){
			this.c_value = this.value;
		},
		// watch: {
		// 	value( value ){
		// 		this.c_value = value;
		// 	}
		// },
		methods : {
			onChange( event ){
				// console.log('onChanges', event, this );
				this.c_value = event.target.value;
				this.$emit('change', this.c_value, this.name, event);
			},
		}
	}
</script>

<style lang="scss">


</style>
