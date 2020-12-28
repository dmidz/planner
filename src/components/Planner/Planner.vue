<template lang="pug">
	.planner
		//b-card(no-body)
			b-tabs(card)
				b-tab(v-for="(period, index) in periods" :key="index" :active="index===currentPeriod" :title="period.label")
					b-card-text
		.head
			button.nav
				icon-arrow-left
			h2.period Lundi 14 déc.
			button.nav
				icon-arrow-right
		.body
			.table-wrapper(v-if="currentPeriod && periodTemplate")
				table
					thead
						tr
							th Postes
							th(v-for="(slot, index) in slots" :style="'width:'+colWidth" ) {{slot.label}}
					tbody
						template(v-for="(post, index) in (() => { rowNum = 0; return this.posts;})()")
							//template(v-if="post.exp")
							tr(v-for="(count, countIndex) in (post.count||1)" @click="handleClickRow" :key="rowNum++" :data-num="rowNum" :class="rowNum === rowSelectIndex ? 'select' : ''")
								//tr(v-for="(row, index) in valuesByPost" @click="handleClickRow" :data-num="index" :class="index === rowSelectIndex ? 'select' : ''")
								th(v-if="post.exp&&count<=post.exp" scope="row" class="post exp" title="Coop formé ou expérimenté")
										IconExp(class="rounded-circle")
										| {{post.label.toLowerCase()}}
								th(v-else class="post" scope="row") {{post.label.toLowerCase()}}
								td(v-for="(slot, slotIndex) in slots") {{rowValue( post, slotIndex, countIndex )}}
										//{{get( valuesByPost.exp, `${countIndex}.${slotIndex}.${countIndex}` )}}
								//template()
									td(v-for="(slot, slotIndex) in slots")
										//{{post.values[slotIndex]}}
							//b-table(:fields="columns" :items="rows")
</template>

<script>

import map from 'lodash/map';
import each from 'lodash/each';
import get from 'lodash/get';
import keyBy from 'lodash/keyBy';

import { //BTab, BCard, BTable,
	BIconAward as IconExp, BIconArrowLeftSquare as IconArrowLeft, BIconArrowRightSquare as IconArrowRight
} from 'bootstrap-vue';

import { nodeAncestor } from '@/utils';

//__ TODO : column resize: https://codepen.io/paulobrien/pen/LBrMxa

export default {
	name: 'dz-planner',
	components: { /*BTab, BCard, BTable,*/ IconExp, IconArrowLeft, IconArrowRight },
	props:{
		debug: {
			default: true,
		}
	},
	data(){
		return {
			periods: [
				{ label: '14-19 déc. 2020', template: 1, values: [
						{ post: 'stock', slot: 0, value: 'David' },
						{ post: 'stock', slot: 0, value: 'Thomas' },
				] },
			],
			currentPeriodIndex: 0,
			availablePosts: {
				ouverture: { label: 'OUVERTURE' },
				appui: { label: 'APPUI-COOP' },
				stock: { label: 'STOCK', exp: 1 },
				accueil_vac: { label: 'ACCUEIL VACATION / VOLANT' },
				regul_entree: { label: 'RÉGULATION ENTRÉE' },
				hygiene: { label: 'HYGIÈNE / VOLANT' },
				volant: { label: 'VOLANT' },
				caisse: { label: 'CAISSE', exp: 1 },
				fromagerie: { label: 'FROMAGERIE (+/- boucherie)' },
				boucherie: { label: 'BOUCHERIE / VOLANT' },
				primeurs: { label: 'PRIMEURS' },
				vrac: { label: 'VRAC', exp: 1 },
				menage: { label: 'Ménage', exp: 1 },
				fermeture: { label: 'Fermeture' },
			},
			periodTemplates: {
				1: {
					slots: [
						{ label: '6h - 9h' },
						{ label: '8h30 - 11h30' },
						{ label: '11h - 14h' },
						{ label: '13h30 - 16h30' },
						{ label: '16h - 19h' },
						{ label: '18h - 21h' },
					],
					posts: [
						{ post: 'ouverture' },
						{ post: 'appui' },
						{ post: 'stock', exp: 2, count: 5 },
						{ post: 'accueil_vac' },
						{ post: 'regul_entree' },
						{ post: 'hygiene' },
						{ post: 'volant' },
						{ post: 'caisse', exp: 1, count: 3 },
						{ post: 'fromagerie' },
						{ post: 'boucherie' },
						{ post: 'primeurs' },
						{ post: 'vrac', exp: 1, count: 3 },
						{ post: 'menage', exp: 1, count: 4 },
						{ post: 'fermeture' },
					]
				},
			},
			rowSelectIndex: null,
		};
	},
	mounted(){
		this.log('mounted', this.posts, this.valuesByPost, this );
	},
	computed: {
		currentPeriod(){
			return this.periods[this.currentPeriodIndex];
		},
		periodTemplate(){
			const res = this.periodTemplates[get( this.currentPeriod, 'template')];
			if(!res){
				console.error(new Error('Period template not found : '+this.currentPeriod.template), this.currentPeriod );}
			return res;
		},
		slots(){
			return this.periodTemplate.slots;
		},
		posts(){
			const res = [];
			for(let i = 0, max = this.periodTemplate.posts.length; i < max; i++ ){
				const post = this.periodTemplate.posts[i];
				const avPost = this.availablePosts[post.post];
				if(!avPost){  continue;}
				res.push( { ...avPost, ...post } );
			}
			return res;
		},
		postsByKey(){
			return keyBy( this.posts, 'post' );
		},
		colWidth(){
			// return '2%';
			return (100/(this.slots.length+1))+'%';
		},
		// slots(){
		// 	return this.periodTemplate.slots;
		// },
		valuesByPost(){
			let res = [];
			if( !this.currentPeriod || !this.periodTemplate ){  return res;}
			// const valuesByPost = keyBy( this.currentPeriod.values, 'post' )
			/*
			 stock: [// _ exp 2
			 	0 exp : [//_ row
						0: [ value, value ],// slots
				 ]
			 	1 exp : [//_ row
						0: [ value, value ],// slots
				 ]
			 	2 		: []
			* */
			// const valuesByPost = {};
			each( this.currentPeriod.values, value => {
				const post = this.postsByKey[value.post];
				const exp = get( post, 'exp', 0 );
				if( !res[value.post] ){ res[value.post] = [];}//{ post };}//__ rows
				if( !res[value.post][value.slot] ){	res[value.post][value.slot] = [];}//_ slots
				res[value.post][value.slot].push( value );
				// let index = 0;
				// if( exp && !value.exp ){	index = exp;}
				// while( index < post.count && res[value.post][value.slot][index] ){  index++;}
				// res[value.post][value.slot][index] = value;
				
			});
		
			return res;
		},
	},
	methods:{
		rowValue( post, slotIndex, postIndex ){
			// console.log('rowValue', post, slotIndex, postIndex );
			return get( this.valuesByPost[post.post], `${slotIndex}.${postIndex}.value` );
		},
		handleClickRow( event ){
			const row = nodeAncestor( event.target, '[data-num]');
			if( !row ){  return;}
			// this.log('handleClickRow', row.getAttribute('data-num'), event, this );
			this.rowSelectIndex = row.getAttribute('data-num')*1;
		},
	}
}

</script>

<style lang="scss">

@import "~@assets/css/_variables";

.planner {
	background-color: #fff;
	border-radius: 3px;
	//padding: 5px;
	display: flex;
	flex-direction: column;
	overflow:hidden;
	.head {
		display: flex;
		flex-direction: row;
		align-items: center;
		padding: 10px 0 10px 0;
		justify-content:center;
		.period {
			//flex: 1;
			width: 300px;
			font-size: 1.5em;
			margin: 0;
		}
		.nav {
			font-size: 1.5em;
			padding: 0;
			border: 0;
			background-color:transparent;
		}
	}
	.body {
		flex: 1;
		overflow: hidden;
	}
	.table-wrapper {
		height:100%;
		overflow:auto;
		border: 1px solid #CCC;
		&::-webkit-scrollbar {
			background-color:#eee;
			border:1px solid #ddd;
			width: 8px;
			//padding:2px;
			//border:1px solid #fff;
			//height:100%;
		}
		&::-webkit-scrollbar-thumb {
			background-color:#fff;
			border-radius: 4px;
			border:2px solid #ddd;
			&:hover {
				background-color: #e5ffa9;
			}
			//margin: 3px;
		}
	}
	table {
		font-size: 0.9em;
		height:100%;
		td, th {
			//padding: 2px 5px;
			padding: 4px 5px;
		}
		thead {
			//display: block;
			th {
				//width: 150px;
				//border-bottom: 2px solid $color-dark-20;
				background-color: #fff8c8;
				position:sticky;
				top: 0;
				z-index: 2;
				border-top: none;
				border-bottom: none;
				&:first-child {
					//width: auto;
					min-width: 140px;
					background-color: #cff0ff;
					//background-color: transparent;
				}
				&::before {
					content: " ";
					border-bottom: 2px solid $color-dark-20;
					position:absolute;
					bottom:0;
					left: 0;
					right:0;
				}
			}
			.period {
				font-size: 1.35em;
			}
		}
		tbody {
			//overflow: auto;
			tr {
				//background-color:#00bcff;
				//position:relative;
				//&::before {
				//	content: " ";
				//	position: absolute;
				//	top: 0; left:0; right: 0; bottom: 0;
				//}
				th {
					border-right: 2px solid $color-dark-20;
					text-transform:capitalize;
					width: 210px;
					background-color: #00b3ff12;
					//&::before {
					//	background-color: #00b3ff12;
					//}
				}
				&.select {
					background-color:#f8ffb8;
				}
				&:hover {
					th, td {
						background-color: $color-dark-5;
					}
				}
			}
		}
		.post {
			text-align: right;
			& .b-icon {
				margin-right: 5px;
				background-color: #fff8c8;
			}
		}
	}
}

</style>
