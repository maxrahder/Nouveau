Ext.define('Engine.view.Tree', {
    extend: 'Ext.tree.Panel',
    alias: 'widget.training_tree',
    requires: [
        'Ext.tree.plugin.TreeViewDragDrop',
        'Engine.view.util.TreeOutlineFormats'
    ],
    rootVisible: false,
    bodyPadding: 4,
    lines: false,
    border: false,
    style: {
        borderRight: '1px solid #d0d0d0'
    },
    selModel: {
        // enableKeyNav: false
    },
    cls: 'tree',
    expandIfNeeded: function() {
        if (this.getAutoCollapse() && this.collapsed) {
            this.expand();
        }
    },
    collapseIfNeeded: function() {
        if (this.getAutoCollapse() && !this.collapsed) {
            this.collapse();
        }
    },
    toggleAutoCollapse: function() {
        this.setAutoCollapse(!this.getAutoCollapse());
    },
    updateAutoCollapse: function(newValue, oldValue) {
        // Setting to true means it's un-pinned.
        var tool = this.getPinTool();
        if (tool) {
            tool.setType(newValue ? 'unpin' : 'pin');
            this.saveState();
        }
    },
    getPinTool: function() {
        return this.down('header #pinTool');
    },

    config: {
        autoCollapse: false,
        topic: ''
    },
    initComponent: function() {
        var me = this;
        this.columns = [{
            xtype: 'treecolumn',
            dataIndex: 'text',
            flex: 1,
            renderer: function(value, metaData, record, rowIndex, columnIndex, store, view) {
                if (record.isRoot()) {
                    return '';
                } else if (record.isTitle()) {
                    return value;
                } else {
                    //console.log(record.data.topicId);
                    if (record.data.topicId !== "") {
                        me.setTopic(record.data.topicId);
                    } else {
                        //console.log(me.getTopic());
                        if (record.data.parentId !== "root") metaData.tdCls = me.getTopic();
                    }

                    var depth = record.getDepth();
                    var index = record.parentNode.indexOf(record);
                    index = (depth == 1) ? index : (index + 1);
                    if (value.indexOf('Lab') != -1 && value.indexOf('Labs') < 0) {
                        return '<span class="lab"></span>' + Engine.view.util.TreeOutlineFormats.toNumber(index, depth) + '. ' + value;
                    }
                    return Engine.view.util.TreeOutlineFormats.toNumber(index, depth) + '. ' + value;
                }
            }
        }];
        this.hideHeaders = true;


        if (Engine.editing) {
            this.viewConfig = {
                plugins: {
                    ptype: 'treeviewdragdrop'
                },
                listeners: {
                    itemkeydown: function(view, record, domElement, number, even) {
                        if (view.tree) {
                            view.tree.fireEvent('itemkeydown', view, record, domElement, number, even);
                        }
                    }
                }
            };
        }

        this.callParent();

        // For view event handling convenience put
        // a reference to the tree on the view.
        this.getView().tree = this;

    },
    getSelection: function() {
        return this.getSelectionModel().getSelection()[0];
    },
    listeners: {
        itemclick: function(view, node) {
            node[node.isExpanded() ? 'collapse' : 'expand']();
        }
    },
    tools: [{
        type: 'next',
        tooltip: 'Play the slideshow from the selected slide',
        handler: function(event, element, header, tool) {
            var slide = Ext.ComponentQuery.query('viewport')[0].el.dom;
            if (slide) {
                if (Ext.isWebKit)
                    slide.webkitRequestFullScreen();
                else if (Ext.isGecko)
                    slide.mozRequestFullScreen();
                else if (slide.el.requestFullScreen)
                    slide.requestFullScreen();
            }
        }
    }, {
        type: 'pin',
        itemId: 'pinTool',
        tooltip: 'Pinned toolbar does not auto-collapse (click to toggle)',
        handler: function(event, element, header, tool) {
            header.up('training_tree').toggleAutoCollapse();
        }

    }, {
        type: 'plus',
        tooltip: 'Expand the selected topic',
        handler: function(event, element, header, tool) {
            var tree = header.up('training_tree');
            var selection = tree.getSelection();
            if (selection && !selection.isLeaf()) {
                tree.expandNode(selection, true);
            }
        }
    }, {
        type: 'minus',
        tooltip: 'Collapse all topics',
        handler: function(event, element, header, tool) {
            header.up('training_tree').collapseAll();
        }
    }],
    // Run expand() on all parents of node
    expandParents: function(node) {
        var parent = node.parentNode;
        while (parent) {
            parent.expand();
            parent = parent.parentNode;
        }
    },
    search: function(search, previous) {
        var store = this.getStore();
        var node = store.getNode(search, this.getSelection(), previous);
        if (node) {
            this.getSelectionModel().select(node);
            this.expandParents(node);
        }
    }
});