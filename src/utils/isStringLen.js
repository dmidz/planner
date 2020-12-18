
const isString = require('lodash/isString');

function isStringLen( value, minLength = 0 ){
	return isString( value ) && value.length >= minLength;
}

module.exports = isStringLen;
