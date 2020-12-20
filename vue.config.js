
const path = require('path');
require('dotenv').config();

process.env.VUE_APP_API_URL = `http${(process.env.API_TLS==='true'?'s':'')}://${process.env.API_HOST}:${process.env.API_PORT}`;

//__ see https://cli.vuejs.org/config/
module.exports = {
  // publicPath: '/build',
  productionSourceMap: false,
  configureWebpack: baseWebpackConfig => {
    // console.log('baseWebpackConfig', baseWebpackConfig );
	  
    function resolve( dir ) { 	return path.join( baseWebpackConfig.context, dir );}

    return {
      resolve: {
     	  // modules: ['node_modules'],
     		extensions: ['.js', '.vue', '.json'],
     		alias: {
		      '@': resolve('src'),
		      '@pages': resolve('src/pages'),
     			'@assets': resolve('src/assets'),
     			'@theme': resolve('src/assets/css/themes/oblivion'),
     			'@comps': resolve('src/components'),
     			'@shared': resolve('src/_shared'),
     			'@plugins': resolve('src/plugins'),
		      // '@dmidz': resolve('packages'),
		      // '@core': resolve('src/core'),
     			// '@store': resolve('src/store'),
     			// '@services': resolve('src/services'),
     			// '@mixin': resolve('src/mixin'),
          // 'vue$': 'vue/dist/vue.esm.js',
     		}
     	},
    };
  },
	// chainWebpack: config => {
	// 	console.log('chainWebpack', config.resolve );
	// 	config.resolve.symlinks( false );
	// },
};
