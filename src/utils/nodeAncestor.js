
function nodeAncestor( node, selector, node_limit ){
	// console.log('nodeMatches', node );
	if( !node || node == document.body )	return null;
	if( node.matches( selector ) )	return node;
	if( node.parentNode === node_limit )		return null;
	return nodeAncestor( node.parentNode, selector, node_limit );
}

module.exports = nodeAncestor;
