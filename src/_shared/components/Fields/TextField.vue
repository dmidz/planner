<template lang="pug">
	textarea(v-if="multiline" v-bind:value="c_value" v-bind:name="name" v-on:input="onChange")
	input(v-else type="text" v-bind:value="c_value" v-bind:name="name" v-on:input="onChange")

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
		// beforeUpdate(){
		//   console.log('beforeUpdate', this.value);
		// 	this.c_value = this.value;
		// },
		watch: {
			value( value ){
				this.c_value = value;
			}
		},
		methods : {
			onChange( event ){
				this.c_value = event.target.value;
				// console.log('onChanges', this.name, this.c_value, event, this );
				this.$emit('change', this.c_value, this.name, event);
			},
		}
	}
</script>

<style lang="scss">


</style>
