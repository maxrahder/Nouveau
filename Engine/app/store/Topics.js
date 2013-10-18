Ext.define('Engine.store.Topics', {
    extend: 'Ext.data.TreeStore',
    requires: ['Engine.model.Topic'],

    model: 'Engine.model.Topic',

    //autoLoad : true, // No longer works in 4.2
    proxy: {
        type: 'ajax',
        url: 'resources/Data/Topics/_treestore.php'
    },
    saveAndRefresh: function() {
        return;
        // Make AJAX call, and on success, replace the
        // root with what's in memory (to get rid of
        // dirty settings, etc.);

        // TODO: This doesn't save the tree directly.
        // It builds a new JSON treestore, and writes
        // it to the file system -- this *should* match
        // the tree in memory, but the author should
        // refresh now and then to see what's actually
        // out there.
        var me = this;
        var h = this.getHierarchy();

        // This prettify would be better done on the back end.
        // This probably sends 5x more data. On the other hand,
        // the back end would need to go from string>JSON>pretty string.
        var s = JSON.stringify(h, null, "\t");

        Ext.Ajax.request({
            url: '../Shared/backend/saveTopics.php',
            method: 'post',
            params: {
                content: s
            },
            success: function(response) {
                // Assume we're in sync. Setting the root node
                // was losing the user's place in the tree.
                // me.setRootNode(h);
            },
            failure: function(response) {
                Ext.Msg.alert(response);
            }
        });

    },

    saveTopic: function(topic) {
        // Save the specified topic.

        var topicId = topic.get('topicId');

        if (!topicId) {
            return;
        }

        var h = {};
        this.hierarchy(topic, h);

        var s = JSON.stringify(h, null, 2);

        Ext.Ajax.request({
            url: '../Shared/backend/saveTopic.php',
            method: 'post',
            params: {
                content: s,
                topicId: topicId
            },
            success: function(response) {
                // Assume we're in sync. Setting the root node
                // was losing the user's place in the tree.
                // me.setRootNode(h);
            },
            failure: function(response) {
                Ext.Msg.alert(response);
            }
        });


    },

    getHierarchy: function() {
        var buildNode = {};
        var root = this.getRootNode();
        root.set('leaf', false);
        this.hierarchy(root, buildNode);
        return buildNode;
    },
    hierarchy: function(traverseNode, buildNode) {

        if (traverseNode.get('topicId')) {
            buildNode.topicId = traverseNode.get('topicId');
        }

        buildNode.text = traverseNode.get('text');
        buildNode.fileId = traverseNode.get('fileId');
        buildNode.html = traverseNode.get('html');
        buildNode.leaf = traverseNode.get('leaf');
        var duration = traverseNode.get('duration');
        if (duration) {
            buildNode.duration = duration;
        }

        if (!buildNode.leaf) {
            buildNode.children = [];
        }
        if (traverseNode.childNodes.length > 0) {
            buildNode.children = [];
            for (var i = 0; i < traverseNode.childNodes.length; i++) {
                var buildChild = {};
                buildNode.children.push(buildChild);
                this.hierarchy(traverseNode.childNodes[i], buildChild);
            }
        }
    },
    getRecordArray: function(node) {
        // return an array of nodes starting from the specified node.
        var result = [];
        node = node ? node : this.getRootNode();
        node.cascadeBy(function(node) {
            result.push(node);
        });
        return result;
    },

    /**
    selects the first node matching the specified title, starting
    with start. next=false searches backwards.
    @param {String} is either a node title or a file name
     */
    getNode: function(string, start, reverse) {

        var node = null;
        var i = 0;
        string = string || '';
        start = start || this.getRootNode();
        string = string.toLowerCase();
        var isFileName = false;
        var nodes = this.getRecordArray();
        if (reverse) {
            nodes.reverse();
        }
        var length = nodes.length;

        // Get the index of the starting node
        var startIndex = 0;
        for (i = 0; i < length; i++) {
            node = nodes[i];
            if (node === start) {
                startIndex = i;
                break;
            }
        }
        // Test to make sure we found it should go here.

        var result = null;
        i = startIndex;
        // while(true) is DANGEROUS. Be careful.
        while (true) {
            i++; // Don't look at the current node.
            i = (i % length); // It's a circular search
            node = nodes[i];
            if (i === startIndex){
                break;
            }
            if (node.get('fileId').toLowerCase() === string) {
                result = node;
                break;
            }
            var text = node.get('text');
            if (text && (node.get('text').toLowerCase().indexOf(string) > -1)) {
                result = node;
                break;
            }
        }
        return result;
    },


    getFileIdArray: function(root) {
        root = root ? root : this.getRootNode();
        var records = this.getRecordArray(root);
        var result = [];
        Ext.Array.forEach(records, function(node) {
            if (node.data.fileId) {
                result.push(node.data.fileId);
            }
        });
        Ext.Array.sort(result);
        return result;
    }
});