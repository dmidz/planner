<template lang="pug">
	.planner
		//b-card(no-body)
			b-tabs(card)
				b-tab(v-for="(period, index) in periods" :key="index" :active="index===currentPeriod" :title="period.label")
					b-card-text
		.head
			button.nav
				icon-arrow-left
			h2.period {{currentPeriod.label}}
			button.nav
				icon-arrow-right
		.body
			.table-wrapper(v-if="currentPeriod && periodTemplate")
				table
					thead
						tr
							th Postes
							th(v-for="(column, index) in columns" :style="'width:'+colWidth" ) {{column.label}}
								.trans(v-if="column.transition" :title="column.transition")
					tbody
						template(v-for="(post, postKey, index) in (() => { rowNum = 0; return this.posts;})()")
							//template(v-if="post.exp")
							tr(v-for="(count, countIndex) in (post.count||1)" @click="handleClickRow" :key="rowNum++" :data-num="rowNum"
									:class="{['last']:count>=post.count, select:rowNum === rowSelectIndex, even: index%2 }")
								//tr(v-for="(row, index) in valuesByPost" @click="handleClickRow" :data-num="index" :class="index === rowSelectIndex ? 'select' : ''")
								th(v-if="post.exp&&count<=post.exp" scope="row" class="post exp" title="Coop formé ou expérimenté")
										IconExp(class="rounded-circle")
										| {{post.label.toLowerCase()}}
								th(v-else class="post" scope="row") {{post.label.toLowerCase()}}
								//td(v-for="(column, columnIndex) in columns")
								template(v-for="(column, columnIndex) in columns")
									td(v-for="value in [rowValue( columnIndex, postKey, countIndex )]" :class="{closed:columnPostClosed( value )}")
										//span(v-for="value in [rowValue( columnIndex, post, countIndex )]" :class="{open:columnPostOpen( value )}")
										| {{value}}
									//| {{v = rowValue( columnIndex, post, countIndex )}}
								//| {{column.posts}}
									//{{get( valuesByPost.exp, `${countIndex}.${columnIndex}.${countIndex}` )}}
								//template()
									td(v-for="(column, columnIndex) in columns")
										//{{post.values[columnIndex]}}
							//b-table(:fields="columns" :items="rows")
</template>

<script>

import map from 'lodash/map';
import each from 'lodash/each';
import get from 'lodash/get';
import keyBy from 'lodash/keyBy';
import isUndefined from 'lodash/isUndefined';
import isNil from 'lodash/isNil';

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
				{ label: 'mardi 05/01/21', template: 1,
					columns: [
						{
							ouverture: ['MORICEAU Ludovic'],
							appui: ['MORICEAU Ludovic'],
							stock: ['BESNARD Thomas / 4','DUMESNIL Laurent',null,null],
							accueil_vac: [null],
						},
						{
							appui: ['MORICEAU Ludovic'],
							stock: ['LELIEVRE Sylvie', null],
							accueil_vac: [null],
							hygiene: [null],
							caisse: [null,null],
							fromagerie: [null],
							boucherie: ['CHITELMAN Aline'],
							primeurs: ['ORLY Maelle'],
							vrac: ['HOUEL Josseline', 'DUBOIS Morgane (à former)', null],
						},
					],
					// columns : [
					// 	{
					// 		ouverture: ['MORICEAU Ludovic'],
					// 		appui: ['Appui-coop' ],
					// 		stock: ['BESNARD Thomas / 4','DUMESNIL Laurent','MOREAU Philippe'],
					// 	},
					// 	{
					// 		// ouverture: ['MORICEAU Ludovic'],
					// 		appui: ['KASSIANOFF Irmine / 1' ],
					// 		stock: ['PONTOIZEAU Catherine','DUMARD Valentin',null],
					// 		accueil_vac: ['Accueil Vacation - Volant'],
					// 	},
					// ],
					// posts:{
				// { post: 'accueil_vac' },
				// { post: 'regul_entree' },
				// { post: 'hygiene' },
				// { post: 'volant' },
				// { post: 'caisse' },
				// { post: 'fromagerie' },
				// { post: 'boucherie' },
				// { post: 'primeurs' },
				// { post: 'vrac' },
				// { post: 'menage' },
				// { post: 'fermeture' },
					
					// }
					
				}
			],
/*
				[
						{ post: 'stock', column: 0, value: 'David' },
						{ post: 'stock', column: 0, value: 'Thomas' },
				]
*/
				// },
			// ],
			// periods: [
			// 	{ label: '14-19 déc. 2020', template: 1, values: [
			// 			{ post: 'stock', column: 0, value: 'David' },
			// 			{ post: 'stock', column: 0, value: 'Thomas' },
			// 	] },
			// ],
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
					label: 'Thuesday',
					columns: [
						{ label: '6h - 9h', transition:'transition des équipes',
							posts: {
								ouverture: 1, appui: 1, stock: 5, accueil_vac: 1
							}
						},
						{ label: '8h30 - 11h30', transition:'transition des équipes',
							posts: {
								appui: 1, stock: 2, accueil_vac: 1, hygiene: 1, caisse: 2, fromagerie:1, boucherie: 1, primeurs:1, vrac: 3, menage: 3,
							}
						},
						{ label: '11h - 14h', transition:'transition des équipes',
							posts: {
								ouverture: 1, appui: 1, stock: 5, accueil_vac: 1
							}
						},
						{ label: '13h30 - 16h30', transition:'transition des équipes',
							posts: {
								ouverture: 1, appui: 1, stock: 5, accueil_vac: 1
							}
						},
						{ label: '16 - 19h', transition:'transition des équipes',
							posts: {
								ouverture: 1, appui: 1, stock: 5, accueil_vac: 1
							}
						},
						{ label: '18h - 21h',
							posts: {
								ouverture: 1, appui: 1, stock: 5, accueil_vac: 1
							}
						},
						// { label: '8h30 - 11h30', transition:'transition des équipes', posts: {
						// 	appui: 1, stock: 3, accueil_vac: 1, hygiene: 1,
						// }},
						// { label: '11h - 14h', transition:'transition des équipes' },
						// { label: '13h30 - 16h30', transition:'transition des équipes' },
						// { label: '16h - 19h', transition:'transition des équipes' },
						// { label: '18h - 21h' },
					],
					// posts: [
					// 	{ post: 'ouverture' },
					// 	{ post: 'appui' },
					// 	{ post: 'stock', exp: 2, count: 5 },
					// 	{ post: 'accueil_vac' },
					// 	// { post: 'regul_entree' },
					// 	{ post: 'hygiene' },
					// 	{ post: 'volant' },
					// 	{ post: 'caisse', exp: 1, count: 3 },
					// 	{ post: 'fromagerie' },
					// 	{ post: 'boucherie' },
					// 	{ post: 'primeurs' },
					// 	{ post: 'vrac', exp: 1, count: 3 },
					// 	{ post: 'menage', exp: 1, count: 4 },
					// 	{ post: 'fermeture' },
					// ]
				},
			},
			rowSelectIndex: null,
		};
	},
	mounted(){
		this.log('mounted', this.posts/*, this.valuesByPost*/, this );
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
		columns(){
			return this.periodTemplate.columns;
		},
		posts(){
			const res = {};
			for( let key in this.availablePosts ){
				let avPost = this.availablePosts[key];
				for(let i = 0, max = this.periodTemplate.columns.length; i < max; i++ ){
					const col = this.periodTemplate.columns[i];
					// console.log('col', col );
					if( !col.posts[key] ){ continue;}
					let post = res[key] || { ...avPost, count: 0 };
					post.count = Math.max( post.count, col.posts[key] );
					res[key] = post;
				}
			}
			// console.log('posts', res);
			// for(let i = 0, max = this.periodTemplate.posts.length; i < max; i++ ){
			// 	const post = this.periodTemplate.posts[i];
			// 	const avPost = this.availablePosts[post.post];
			// 	if(!avPost){  continue;}
			// 	res.push( { ...avPost, ...post } );
			// }
			return res;
		},
		postsByKey(){
			return keyBy( this.posts, 'post' );
		},
		colWidth(){
			// return '2%';
			// const len = this.columns.length;
			return (100/(this.columns.length+1))+'%';
		},
		// columns(){
		// 	return this.periodTemplate.columns;
		// },
// 		valuesByPost(){
// 			let res = [];
// 			if( !this.currentPeriod || !this.periodTemplate ){  return res;}
//
// 			each( this.currentPeriod.values, value => {
// 				const post = this.postsByKey[value.post];
// 				const exp = get( post, 'exp', 0 );
// 				if( !res[value.post] ){ res[value.post] = [];}//{ post };}//__ rows
// 				if( !res[value.post][value.column] ){	res[value.post][value.column] = [];}//_ columns
// 				res[value.post][value.column].push( value );
// 			});
//
// /*
// 			each( this.currentPeriod.values, value => {
// 				const post = this.postsByKey[value.post];
// 				const exp = get( post, 'exp', 0 );
// 				if( !res[value.post] ){ res[value.post] = [];}//{ post };}//__ rows
// 				if( !res[value.post][value.column] ){	res[value.post][value.column] = [];}//_ columns
// 				res[value.post][value.column].push( value );
// 			});
// */
//
//
// 			console.log('valuesByPost', res );
// 			return res;
// 		},
	},
	methods:{
		rowValue( columnIndex, postKey, postIndex = 0 ){
			let res = get( this.currentPeriod.columns[columnIndex], `${postKey}[${postIndex}]` );
			// console.log('rowValue', res, this.currentPeriod.columns[columnIndex], columnIndex, postKey, postIndex );
			return res;
		},
		columnPostClosed( value ){
			// console.log('columnPostOpen', value, !isUndefined( value ) );
			return isUndefined( value );
			// return get( this.columns, `${columnIndex}.${post.post}`, 0 ) >= postIndex;
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
.page {
	flex: 1 1;
}

.planner {
	flex: 1 1;
	background-color: #fff;
	border-radius: 3px;
	//padding: 5px;
	display: flex;
	flex-direction: column;
	overflow:hidden;
	box-shadow: 0 0 4px rgba(0,0,0,0.5);
	border:1px solid rgba(255,255,255,0.5);
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
		//height:100%;
		max-height:100%;
		overflow:auto;
		border: 1px solid #CCC;
		&::-webkit-scrollbar {
			//background-color:#eee;
			background-color:rgba(0,0,0,0.35);
			border:1px solid #ddd;
			width: 8px;
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
			border: 1px solid rgba(0,0,0,0.1);
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
				}
				&::before {
					content: " ";
					border-bottom: 2px solid $color-dark-20;
					position:absolute;
					bottom:-2px;
					left: 0;
					right:0;
				}
				.trans {
					position:absolute;
					bottom:0;
					top: 0;
					right: 0px;
					width:10%;
					background-color:rgba(0,0,0,0.07);
					&:hover {
						background-color:rgba(0,0,0,0.15);
					}
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
				th, td {
					//border: 1px solid $color-light-10;
				}
				th {
					border-right: 2px solid $color-dark-20;
					text-transform:capitalize;
					width: 210px;
					background-color: #00b3ff12;
					//&::before {
					//	background-color: #00b3ff12;
					//}
				}
				td {
					&.closed {
						background-color:rgba(0,0,0,0.1);
					}
				}
				&.even {
					//background-color:rgba(0,0,0,0.025);
				}
				&.select {
					background-color:#f8ffb8;
				}
				&:hover {
					th, td {
						background-color: $color-dark-5;
					}
				}
				//&.post:last-child {
				&.last {
					th, td {
						border-bottom: 1px solid rgba(0,0,0,0.3);
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
