<!--
<template lang="pug" functional>
	.row.field
		label {label}

		//input(type={type} ref="input" onchange=onChange)

</template>
-->

<script>
// import get from 'lodash/get';
import merge from '@/utils/merge';
import TextField from './TextField';
import PasswordField from './PasswordField';

const mapTypes = {
	text: TextField,
	password: PasswordField,
};

export default {
	name: 'field',
	functional: true,
	// components : { FieldText },
	props : {
		label: {
			default: null, type: String
		},
		type: {
			default: 'text', type: String
		},
		// name: {
		// 	default: null, type: String, required: true,
		// },
	},
	data(){
		return {
		}
	},
	render: function ( createElement, context ) {
		const comp = mapTypes[context.props.type];
		//__ TODO : check why all fields are rendered when on input one
		// console.log('render', get( context.data, 'attrs.name'), context );
		if(!comp){
			throw 'Unknown compoenent type : '+context.props.type;
			return null;
		}

		const cpData = merge( {
			'class': (context['class']||'')+' field-comp',
			// props: {
			// 	// name: context.props.name,
			// 	// value: context.props.value,
			// },
			// on: {
			// 	change( value, name, event ){
			// 		console.log('onChange', value, name, event );
			// 		// this.$emit('change', value, this.name,  event );
			// 	}
			// }
		}, context.data );

		return createElement( 'div', {
			'class': 'row field',
		}, [
			createElement( 'label', {
				domProps: {
					innerHTML: context.props.label,
				},
			} ),
			createElement( comp, cpData ),
		] );
	}
	// mounted(){
	//
	// },
	// watch: {
	// 	value( value ){
	// 	}
	// },
	// methods : {
	// 	onChange( event ){
	// 		// console.log('onUserInput', arguments );
	// 		// this.c_value = event.target.value;
	// 		// this.$emit('change', this.c_value, this.name, event);
	// 	},
	// }
}
</script>

<style lang="scss">
.field {
	flex: 1;
	display: flex;
	flex-direction: row;
	align-self: stretch;
	margin-bottom: 6px;
	text-transform: capitalize;
	label {
		flex: 1;
		text-align: right;
		margin-right: 10px;
	}
	.field-comp {
		flex: 2;
		width: auto;
	}
}

</style>
