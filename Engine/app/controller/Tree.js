Ext.define('Engine.controller.Tree', {
    extend: 'Ext.app.Controller',

    views: ['Tree', 'LinkWindow'],
    stores: ['Topics'],
    models: ['Topic'],

    requires: ['Ext.state.LocalStorageProvider'],

    refs: [{
        ref: 'treeView',
        selector: 'training_tree treeview'
    }, {
        ref: 'filePathLabel',
        selector: '#filePathLabel'
    }, {
        ref: 'slide',
        selector: 'slide'
    }, {
        ref: 'contentBody',
        selector: 'training_contentbody'
    }, {
        ref: 'tree',
        selector: 'training_tree'
    }],

    init: function() {

        var me = this;

        if (Ext.supports.LocalStorage) {
            this.stateProvider = Ext.create('Ext.state.LocalStorageProvider');
        }

        // Kludge to get a reference to this controller in memory
        // for debugging purposes.
        Engine.controllers = {
            Tree: this
        };

        this.control({
            'training_tree': {
                select: this.nodeSelected,
                collapse: this.treeCollapsedHandler,
                expand: this.treeExpandHandler
            }
        });


        this.getTopicsStore().on('load', this.topicsStoreLoadHandler, this);
        this.getTopicsStore().load();
    },

    getEscapedBreadcrumb: function() {
        return escape(this.getSlide().getBreadcrumb(this.getRecord()));
    },

    onLaunch: function(application) {
        this.addKeyNav();

        // for unpinned tree: show when mousing over tree or splitter, hide when
        // mousing over main content
        this.getTree().getEl().on('mouseover', function(e, target) {
            this.getTree().expandIfNeeded();
        }, this);
        this.getTree().splitter.getEl().on('mouseover', function(e, target) {
            this.getTree().expandIfNeeded();
        }, this);
        this.getSlide().getEl().on('mouseover', function(e, target) {
            this.getTree().collapseIfNeeded();
        }, this);
    },

    treeCollapsedHandler: function(treePanel) {
        this.keyNav.enable();
    },
    treeExpandHandler: function(treePanel) {
        this.keyNav.disable();
    },

    addKeyNav: function() {
        var that = this;

        this.keyNav = new Ext.util.KeyNav({
            target: Ext.getDoc(),
            disabled: true,
            ignoreInputFields: true,
            left: prev,
            right: next,
            space: next
        });

        function prev() {
            if (Engine.util.Presentation.showPrevSlide()) {
                return;
            }

            // Only works if the nodes are expanded. So this won't
            // work right if you collapse all, go to some group node,
            // and press back.

            // If on first child, go to parent.
            // If previous node is a folder, then select its last child.
            // If previous node is another leaf, then select it.

            var sm = that.getTree().getSelectionModel();
            var current = sm.getSelection()[0];
            var previous = current.previousSibling;
            if (previous && !previous.isExpanded()) {
                previous.expand();
            }
            sm.selectPrevious();
        }

        function getNextUncle(node) {
            // Gets the next parent node's next sibling. If that
            // doesn't have a sibling, go up again. Hitting root
            // returns null.
            if (node.isRoot()) {
                return null;
            } else {
                if (node.parentNode.nextSibling) {
                    return node.parentNode.nextSibling;
                } else {
                    return getNextUncle(node.parentNode);
                }
            }
        }

        function getNext(node) {
            // returns the next node from the specified node
            // This should probably be a method on the tree.
            var result = null;
            if (node) {
                if (node.hasChildNodes()) {
                    result = node.firstChild;
                } else if (node.nextSibling) {
                    result = node.nextSibling;
                } else if (node.parentNode) {
                    // No next siblings or kids -- must be the last child
                    return getNextUncle(node);
                }
            }
            return result;
        }

        function next() {
            if (Engine.util.Presentation.showNextSlide()) return;

            var r = that.getRecord();
            var nextRecord = getNext(r);
            if (nextRecord) {
                nextRecord.parentNode.expand();
                that.getTree().getSelectionModel().select(nextRecord);
            } else {
                // Assert: nextRecord is falsey
                that.getTree().getSelectionModel().select(that.getTree().getRootNode());
            }
        }
    },

    topicsStoreLoadHandler: function() {
        // If there's a deeplink path in the URL, use it. Else see if there's
        // a path saved via the state provider and use that.
        var path = Ext.Object.fromQueryString(location.search.substring(1)).page;
        path = path ? path : this.getDeeplinkPath();
        this.openPage(path);
    },

    openPage: function(path) {
        // Opens the page from the specified path. The path must be of the form
        // nodeTitle/nodeTitle/nodeTitle. " > " may also be used for the
        // delimiter.
        var startingNode = this.getTree().getRootNode();
        path = path || '';

        // regex "global" replace
        var path = path.replace(/ > /g, '/');
        var links = path.split('/');
        for (var i = 0; i < links.length; i++) {
            var pageTitle = Ext.String.trim(links[i]);
            var child = startingNode.findChildBy(function(node) {
                return (Ext.String.trim(node.get('text')) === pageTitle);
            });
            if (child) {
                startingNode = child;
                //this.getTree().expandNode(startingNode);
            } else {
                break;
            }
        }
        if (startingNode.isRoot()) {
            startingNode = startingNode.firstChild;
        }
        this.getTree().getSelectionModel().select(startingNode);
    },

    createTrace: function(message) {
        // Usage : this.createTrace('In method foo')';
        return Ext.Function.bind(this.trace, this, [message]);
    },
    trace: function(message) {
        console.log(message);
    },

    getRecord: function() {
        return this.getTree().getSelection();
    },

    nodeSelected: function(selectionModel, record) {

        this.saveDeeplinkPath();

        var me = this;

        if (this.getRecord().isSlide()) {
            var callback = function(content) {
                me.showContent(record, content);
            };
            me.getPageContent(record.get('fileId'), callback);
        } else {
            me.getSlide().showNode(record);
            me.getFilePathLabel().setText('');
        }
    },

    showContent: function(record, content) {
        this.getSlide().showNode(record, content);
        var s = 'This content is physically located at ' + record.getFilePath();
        this.getFilePathLabel().setText(s);
    },

    getPageContent: function(fileId, callback) {
        // Runs callback passing the content from fileId, or the empty string if
        // there is no fileId. If there is a fileId, and no page is found, it
        // recovers by creating a new page with that name. This cleans up
        // the file system somehow being out of sync with the topics tree.
        // The file content is passed as the single parameter to callback.
        var c = function() {
            callback('Default content');
        };
        var me = this;
        var response = function(response) {
            var status = response.status;
            if ((status >= 400) && (status <= 499)) {
                me.addPagePrivate(fileId, c);
            } else if ((status >= 200) && (status <= 299)) {
                callback(response.responseText);
            }
        };
        if (fileId) {
            Ext.Ajax.request({
                url: Engine.Global.dataContentPath + fileId + '.html',
                success: response,
                failure: response
            });
        } else {
            callback('Default content');
        }
    },
    getUnreferencedFiles: function(callback) {
        // Returns an array of file names of unreferenced files.
        // This is a utility routine to detect possible garbage.
        // Look at the resulting file names -- they are time stamps,
        // so if you think you lost some new nodes, run the routine
        // and see if the time stamps match when you created them,
        // them open them up and inspect their contents.
        var me = this;
        var file = Ext.create('Engine.util.File', {
            path: Engine.Global.dataContentPath
        });
        file.getChildren(function(files) {
            var allInTree = me.getTopicsStore().getFileIdArray();
            var result = Ext.Array.difference(files, allInTree);
            callback(result);
        });
    },

    getDeeplinkPath: function() {
        if (this.stateProvider) {
            return unescape(this.stateProvider.get('deeplinkpath'));
        } else {
            return '';
        }
    },
    saveDeeplinkPath: function() {
        if (this.stateProvider) {
            this.stateProvider.set('deeplinkpath', this.getEscapedBreadcrumb());
        }
    }

});