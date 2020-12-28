
export default {
	DEV: process.env.NODE_ENV === 'development',
	API_URL: process.env.VUE_APP_API_URL,//'http://api-rest.local:7678/api',
	// DEMO_COMPS: [
	// 	{ label: 'MenuTree', route: 'MenuTree' },
	// 	{ label: 'Test', route: 'Test' },
	// ],
	DEMO_COMPS: {
	  MenuTree: { label: 'MenuTree', route: 'MenuTree' },
	  Test: { label: 'Test', route: 'Test' },
	},
};

