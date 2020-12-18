<template lang="pug">
	#app
		#content
			router-view
</template>

<script>

export default {
	name: 'app',
	components: {},
	data: () => {
		return {
		};
	},
	created(){
		// console.log('created', this );
	},
	methods: {
		clickItem( item ){
			this.log( 'clickItem', item );
		},
	}
};

</script>

<style lang="scss">

@import "@/assets/css/themes/default";

#app {
  //font-family: 'Avenir', Helvetica, Arial, sans-serif;
  //-webkit-font-smoothing: antialiased;
  //-moz-osx-font-smoothing: grayscale;
  text-align: center;
  flex: 1;
  display: flex;
  flex-direction: row;
  align-items: stretch;
	overflow:auto;
  //color: $color-text;

  .page_bgd {
    position: fixed;
    z-index: -999;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    /*opacity:0.8;*/
    overflow: hidden;

  }

  #sidebar {
    width: 20%;
    background: $color-dark-3;
    //color: #fff;
    padding: 1em;
    border-radius: 2px;
    /*border:1px solid rgba(255,255,255,0.15);*/
    align-self: stretch;

    h1 {
      font-size: 1.3em;
      font-weight: 100;
    }
	  
	  .menu {
		  border: none;
	  }
  }

  #content {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
}
</style>
