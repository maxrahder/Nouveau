Ext.define('Ext.ux.TreeFilter', {
	extend: 'Ext.AbstractPlugin',
	alias: 'plugin.treefilter',
	collapseOnClear: true, // collapse all nodes when clearing/resetting the filter
	allowParentFolders: false, // allow nodes not designated as 'leaf' (and their child items) to  be matched by the filter
	init: function(tree) {
		var me = this;
		me.tree = tree;

		tree.filter = Ext.Function.bind(me.filter, me);
		tree.clearFilter = Ext.Function.bind(me.clearFilter, me);
	},
	filter: function(value, property, re) {

		function report(a){
			console.log('----------------');
			console.log(a.length);

			Ext.Array.forEach(a, function(record){
				if (!record.isLeaf()){
					return;
				}
		        var s = '';
		        Ext.Array.forEach(record.getTopicArray(), function(topic){
		           s +=  topic + ' > ';
		        });
		        s += record.getSlideText();
		        s = Engine.util.String.removeFromEnd(s, ' > ');
		        console.log(s);
			});

		}

		var me = this,
			tree = me.tree,
			matches = []; // array of nodes matching the search criteria
		var root = tree.getRootNode(); // root node of the tree
		property = property || 'text'; // property is optional - will be set to the 'text' propert of the  treeStore record by default
		re = re || new RegExp(value, "ig"); // the regExp could be modified to allow for case-sensitive,  starts  with, etc.
		var visibleNodes = []; // array of nodes matching the search criteria + each parent non-leaf  node up to root
		var viewNode;

		if (Ext.isEmpty(value)) { // if the search field is empty
			me.clearFilter();
			return;
		}

		tree.expandAll();
		// expand all nodes for the the following iterative routines

		// iterate over all nodes in the tree in order to evalute them against the search criteria
		root.cascadeBy(function(node) {
			if (node.get(property).match(re)) { // if the node matches the search criteria and is a leaf (could be  modified to searh non-leaf nodes)
				matches.push(node); // add the node to the matches array
			}
		});

		report(matches);

		if (me.allowParentFolders === false) { // if me.allowParentFolders is false (default) then remove any  non-leaf nodes from the regex match
			Ext.each(matches, function(match) {
				if (!match.isLeaf()) {
					Ext.Array.remove(matches, match);
				}
			});
		}

		report(matches);
		report(visibleNodes);

		Ext.each(matches, function(item, i, arr) { // loop through all matching leaf nodes

			root.cascadeBy(function(node) { // find each parent node containing the node from the matches array
				if (node.contains(item) === true) {
					if (!Ext.Array.contains(visibleNodes, node)){
						visibleNodes.push(node); // if it's an ancestor of the evaluated node add it to the visibleNodes  array
					}
				}
			});

			// if (me.allowParentFolders === true && !item.isLeaf()) { // if me.allowParentFolders is true and the item is  a non-leaf item
			// 	item.cascadeBy(function(node) { // iterate over its children and set them as visible
			// 		visibleNodes.push(node);
			// 	});
			// }
			visibleNodes.push(item); // also add the evaluated node itself to the visibleNodes array
		});

		report(visibleNodes);
		var m = [];
		root.cascadeBy(function(node) { // finally loop to hide/show each node
			// get the dom element assocaited with each node
			if (Ext.Array.contains(visibleNodes, node)){
				m.push(node);
			}
			var element = Ext.fly(tree.getView().getNode(node));
			if (element) { // the first one is undefined ? escape it with a conditional
				element.setVisibilityMode(Ext.Element.DISPLAY);
				// set the visibility mode of the dom node to display (vs offsets)
				var visible = Ext.Array.contains(visibleNodes, node);
				element.setVisible(visible);
			}
		});
		report(m);

	},
	clearFilter: function() {
		var me = this;
		var tree = this.tree;
		var root = tree.getRootNode();

		if (me.collapseOnClear) {
			tree.collapseAll();
		} // collapse the tree nodes
		root.cascadeBy(function(node) { // final loop to hide/show each node
			viewNode = Ext.fly(tree.getView().getNode(node));
			// get the dom element assocaited with each node
			if (viewNode) { // the first one is undefined ? escape it with a conditional and show  all nodes
				viewNode.show();
			}
		});
	}
});