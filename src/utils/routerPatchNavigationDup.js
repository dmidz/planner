
//___ prevent annoying error when push or replace the same route as the current

function patchRouterMethod( router, methodName ){
	router[ 'old' + methodName ] = router[ methodName ];
	router[ methodName ] = async function( ...args ){
		return router[ 'old' + methodName ].apply( router, args ).catch( ( error ) => {
			if( error.name === 'NavigationDuplicated' ){
				return this.currentRoute;
			}
			throw error;
		} );
	}
}

function routerPatch( router ){
	patchRouterMethod( router, 'push' );
	patchRouterMethod( router, 'replace' );
}

module.exports = routerPatch;