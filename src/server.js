const Path = require( 'path' );
const Hapi = require( '@hapi/hapi' );
const Inert = require( '@hapi/inert' );

console.log( '# env', process.env );
//process.env.NODE_ENV==='production'

const init = async () => {
	
	const server = new Hapi.Server( {
		port: ( !!process.env.HEROKU ) ? 443 : 3000,
		routes: {
			files: {
				relativeTo: Path.join( __dirname, '../dist' )
			}
		}
	} );
	
	await server.register( Inert );
	
	server.route( {
		method: 'GET',
		path: '/{param*}',
		handler: {
			directory: {
				path: '.',
				redirectToSlash: true
			}
		}
	} );
	
	await server.start();
	
	console.log( 'Server running at:', server.info.uri );
};

init();