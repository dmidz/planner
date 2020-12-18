
const mergeWith = require('lodash/mergeWith'),
	isArray = require('lodash/isArray')
;

function replaceArray( objValue, srcValue ){	if ( isArray(srcValue) )	return srcValue;}

function merge() {  	return mergeWith.apply( null, [...arguments, replaceArray ] );}

module.exports = merge;
