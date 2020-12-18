
const noop = function(){};
const is_dev = process.env.NODE_ENV === 'development';

const mixinLog = {
  props: {
 		debug: {
 			default: false,
 		}
 	},
	created(){
		this.log = ( is_dev && this.debug ) ? console.log.bind( window.console ) : noop;
	},
};

module.exports = mixinLog;