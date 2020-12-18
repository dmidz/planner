<template lang="pug">
	.page
		//h1 Planning
		planner
</template>

<script>

import Planner from '@comps/Planner';

export default {
	name: 'page-home',
	components: { Planner },
	props: {
	},
	data(){
		return {
		}
	},
	// created : function(){
	// },
	mounted(){
	},
	methods: {
	}
}
</script>

<style lang="scss">

.page {
	display: flex;
	flex-direction:column;
	overflow:hidden;
	h1 {
		font-size: 1.5em;
	}
}

</style>
