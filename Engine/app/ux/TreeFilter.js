
Ext.define('TreeFilter', {
    extend: 'Ext.AbstractPlugin'
    , alias: 'plugin.treefilter'
    
    , snapshot: undefined
    , matchParentNodes: true
    
    , init: function (tree) {
        var me = this;
        me.tree = tree;
        
        tree.filter = Ext.Function.bind(me.filter, me);
        tree.clearFilter = Ext.Function.bind(me.clearFilter, me);
    }
    
    , clearFilter: function () {
        var me = this
            , snapshot = me.snapshot;

        if (snapshot) {
            me.tree.setRootNode(snapshot);
            me.tree.getRootNode().collapseChildren(true);
        }
    }
    
    , filter: function (value, property, re) {
        var me = this
            , tree = me.tree
            , re = re || new RegExp(value, "ig")
            , property = property || 'text'
            , notMatched = []
            , snapshot, tempRoot, markMatch, i;
        
        if (Ext.isEmpty(value)) {
            me.clearFilter();
            return;
        }
        
        me.snapshot = me.snapshot || tree.getRootNode().copy(null, true);
        tempRoot = me.snapshot.copy(null, true);

        markMatch = function (node) {
            node.filterMatch = true;
            if (node.parentNode) {
                markMatch(node.parentNode);
            }
        };
        
        tempRoot.cascadeBy(function (node) {
            if (node.get(property).match(re)) {
                if (node.isLeaf() || me.matchParentNodes === true) {
                    markMatch(node);
                }
            }
        });
        
        tempRoot.cascadeBy(function (node) {
            if (node.filterMatch !== true) {
                notMatched.push(node);
            }
        });
        
        for (i = 0; i < notMatched.length; i++) {
            notMatched[i].remove();
        }
        
        tree.setRootNode(tempRoot);
        tree.getRootNode().expandChildren(true);
        
    }
});

