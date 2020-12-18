
const isNil = require('lodash/isNil');

function jsonParse ( str ){
  if( isNil( str ) ){ return null;}
  try {
    return JSON.parse( str );
  }catch( err ){
    console.error( err );
    return null;
  }
}

module.exports = jsonParse;