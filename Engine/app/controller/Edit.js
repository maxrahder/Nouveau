Ext.define('Engine.controller.Edit', {
	extend: 'Ext.app.Controller',

	requires: ['Engine.view.EditToolbar'],

	views: ['Tree'],
	stores: ['Topics'],

	refs: [{
		ref: 'editToolbar',
		selector: 'edittoolbar'
	}, {
		ref: 'tree',
		selector: 'training_tree'
    }, {
        ref: 'nodeText',
        selector: '#nodeText'
    }, {
        ref: 'nodeDuration',
        selector: '#nodeDuration'
	}],

	init: function() {

		var me = this;

		Engine.editing = Ext.Object.fromQueryString(location.search.substring(1)).edit;

		if (Engine.editing) {

			// Post changes as they occur. Since it's buffered, even operations
			// that fire multiple changes, like moving nodes, will only be saved
			// once.
			this.bufferedSaveTopic = Ext.Function.createBuffered(this.saveTopic, 1000, this);

			this.getTopicsStore().on('load', function(store) {
				// treestore nodes don't keep accurate track of the store.
				// Therefore, manually put a reference onto the root. This
				// is used by the Topic.js model to have the tree fire
				// 'textchanged'. This is a bit ugly :-/

				store.getRootNode().topicsStore = store;

				// This is run BEFORE being moved, so the old parent is updated
				// if it's going between topics.
				me.getTopicsStore().on('beforeremove', me.beforeRemoveHandler, me);

				me.getTopicsStore().on('insert', me.insertHandler, me);

				me.getTopicsStore().on('beforemove', me.beforeMoveHandler, me);

				me.getTopicsStore().on('move', me.moveHandler, me);

				me.getTopicsStore().on('textchanged', me.textChangedHandler, me);

			});
		};

		this.control({

			'training_tree': {
				select: this.nodeSelectHandler
			},
			'viewport training_edittoolbar #link': {
				click: this.linkHandler
			},
			'training_contentbody': {
				save: this.saveContentHandler
			},

			'toolbar #addPage': {
				click: this.toolbarAddPage
			},
			'toolbar #dumpJson': {
				click: this.toolbarDumpJsonHandler
			},
			'toolbar #addFolder': {
				click: this.toolbarAddFolder
			},
			'toolbar #deleteNode': {
				click: this.toolbarDeleteNode
			},
			'toolbar #nodeText': {
				change: this.toolbarNodeTextChange
			},
			'toolbar #nodeDuration': {
				change: this.toolbarNodeDurationChange
			},

			'viewport #mainPanel': {
				afterrender: this.viewportOnAfterRender
			}

		});

	},

	nodeSelectHandler: function(selectionModel, record) {
		this.getNodeText().setValue(record.get('text'));
		this.getNodeDuration().setValue(record.get('duration'));
	},

	getRecord: function() {
		return this.getTree().getSelection();
	},

	beforeMoveHandler: function(store, oldParent, newParent) {
		// Moved trigger insert and remove -- this handler
		// simply disallowed moved between topics. It turns out
		// that detecting that kind of operation was too hard
		// because we couldn't differentiate between an insert
		// of a new record, versus an insert due to being moved.
		var t1 = oldParent.getTopic();
		var t2 = newParent.getTopic();
		// Neither can be false, and they can't be equal.
		if (!t1 || !t2 || !(t1 === t2)) {
			Ext.Msg.alert('Ignored', 'You may only move nodes within a sub-topic.');
			return false;
		}
	},

	moveHandler: function(store, oldParent, newParent) {
		this.bufferedSaveTopic(newParent);
	},

	linkHandler: function(button, event) {
		var url = location.origin + '/' + location.pathname + '?page=' + this.getEscapedBreadcrumb();
		Engine.view.LinkWindow.setPosition(button.x, button.y + button.getHeight());
		Engine.view.LinkWindow.show(url);
	},

	beforeRemoveHandler: function(store, record, isMove) {
		// If it's a move, then insert is run. Let that trigger the save
		if (isMove) {
			return; // Do nothing
		}
		// Get the topic -- by the time the buffered handler is run, the
		// parent pointer will be null.
		this.bufferedSaveTopic(record.getTopic());
	},

	insertHandler: function(store, record) {
		console.log('insertHandler');
		this.bufferedSaveTopic(record);
	},

	textChangedHandler: function(store, record) {
		this.bufferedSaveTopic(record);
	},

	saveTopic: function(record) {
		if (Engine.editing) {
			var t = record.getTopic();
			if (t) {
				this.getTopicsStore().saveTopic(t);
			}
		}
	},
	saveContentHandler: function(component, text) {
		// This is a little complicated. First, save the specified
		// text, assuming we're on the this.getRecord() node. (Ideally,
		// the save event would know what record we're on, but right
		// now it doesn't have a reference.) When the content is saved,
		// then re-fetch it. Why? Because we're not positive it really
		// saved, so re-fetching guarantees we're seeing the actual
		// contents on disc.
		var me = this;
		var record = this.getRecord();
		// Is it save to assume the data being saved is for the current record.
		var savePageCallback = function(content) {
			var getPageContentCallback = function(content) {
				me.showContent(record, content);
			};
			me.getPageContent(record.get('fileId'), getPageContentCallback);
		};
		this.savePagePrivate(record.get('fileId'), savePageCallback, text);
	},


	viewportOnAfterRender: function(panel) {
		this.getEditToolbar().setVisible(Engine.editing);
	},


	toolbarAddFolder: function() {
		var record = this.getRecord();
		var recordConfig = {
			text: 'New Topic',
			leaf: false,
			children: []
		};
		this.insertNode(record, recordConfig);
		this.getNodeText().focus(true);
	},

	generateFileId: function() {
		// Returns something like:
		// "2012-09-18_16-17_12-118_Z"
		// Meaning, September 18, at 16:17 and 12.118 seconds, UTC.

		function pad(number, length) {
			// Hack to pad "number" with leading zeros
			// for a final length of "length"
			length = length || 2;
			number = number + ''; // Make it a string
			var toCopyLength = (length - number.length);
			toCopyLength = (toCopyLength < 0) ? 0 : toCopyLength;
			return '0000000000'.substr(0, toCopyLength) + number;
		}
		var d = new Date();
		return d.getUTCFullYear() + '-' + pad(d.getUTCMonth() + 1) + '-' + pad(d.getUTCDate()) + '_' + pad(d.getUTCHours()) + '-' + pad(d.getUTCMinutes()) + '_' + pad(d.getUTCSeconds()) + '-' + pad(d.getUTCMilliseconds(), 3) + '_Z';

	},

	toolbarAddPage: function() {
		var me = this;
		var record = me.getRecord();
		var fileId = this.generateFileId();
		var callback = function() {
			var recordConfig = {
				text: 'New Slide',
				fileId: fileId,
				leaf: true
			};
			me.insertNode(record, recordConfig);
		}; // end callback
		this.savePagePrivate(fileId, callback);
		this.getNodeText().focus(true);
	},
	savePagePrivate: function(fileId, callback, content) {
		content = content || '';
		callback = callback || Ext.emptyFn;
		// Insert a new page, and fire off Ajax to
		// add the new empty source page.
		Ext.Ajax.request({
			url: 'php/savePage.php',
			method: 'post',
			params: {
				fileId: fileId,
				dataRootPath: Engine.dataRootPath,
				content: content
			},
			success: function(response) {
				callback();
			},
			failure: function(response) {
				callback(response.responseText);
				Ext.Msg.alert(response);
			}
		});
	},
	toolbarDeleteNode: function() {
		var me = this;
		var r = this.getRecord();
		if (r) {
			Ext.Msg.confirm('Delete', 'Are you sure you want to delete "' + r.get('text') + '"?', function(choice) {
				if (choice === 'yes') {
					var n = r.nextSibling || r.parentNode;
					me.getTree().getSelectionModel().select(n);
					// TODO
					// r.destroy() or r.remove(true) throws an exception.
					// "You are using a ServerProxy but have not supplied it
					// with a url"
					r.remove();
					var kids = r.isLeaf() ? [r.get('fileId')] : me.getTopicsStore().getFileIdArray(r);
					Ext.Array.forEach(kids, function(fileId) {
						Ext.Ajax.request({
							params: {
								fileId: fileId
							},
							url: 'php/deleteFile.php',
							success: function(response) {},
							failure: function(response) {
								Ext.Msg.alert('Error deleting ' + fileId, response.responseText);
							}
						});
					});
				}
			});
		}
	},

	insertNode: function(node, recordConfig) {
		// Insert as a sibling, unless node is a topic,
		// in which case insert as a child.
		if (node.isTopic()) {
			var n = node.appendChild(recordConfig);
			this.getTree().getSelectionModel().select(n);
		} else {
			var parent = node.parentNode;
			var n = parent.insertChild(parent.indexOf(node) + 1, recordConfig);
			this.getTree().getSelectionModel().select(n);
		}
	},

	toolbarNodeTextChange: function(field) {

		var record = this.getRecord();
		if (record) {
			// if (record && (record.get('text') != fieldGetValue())) {
			record.set('text', field.getValue());
		}
	},

	toolbarNodeDurationChange: function(field) {

		var record = this.getRecord();
		if (record) {
			// if (record && (record.get('text') != fieldGetValue())) {
			record.set('duration', field.getValue());
		}
	},
	toolbarDumpJsonHandler: function() {
		console.log(Ext.JSON.encode(this.getTopicsStore().getHierarchy()));
	}



});