Ext.define('Engine.model.Node', {
	extend: 'Ext.util.Observable',
	singleton: true,
	config: {
		record: null
	},
	data: {},
	slideHtml: '',
	updateRecord: function(record) {
		var me = this;

		this.data = Ext.apply({}, record.getData());
		var fileId = record.get('fileId');

		function response(parameters, success, response) {
			var status = response.status;
			var text = response.responseText;
			if ((status >= 400) && (status <= 499)) {
				console.log('Not found: ' + parameters + '/n' + text)
			} else if ((status >= 200) && (status <= 299)) {
				me.slideHtml = text;
				Ext.apply(me.data, {
					slideHtml: me.slideHtml
				});
			}
			me.fireEvent('change', me);
		};

		if (fileId) {
			Ext.Ajax.request({
				url: Engine.Global.dataContentPath + fileId + '.html',
				callback: response
			});
		} else {
			me.fireEvent('change', me);
		}
	},
	isSlide: function() {
		var record = this.getRecord();
		return record ? this.getRecord().isLeaf() : false;
	},
	isTopic: function() {
		var record = this.getRecord();
		return record ? record.isTopic() : false;
	},
	getTopicArray: function() {
		var record = this.getRecord();
		return record ? record.getTopicArray() : [];
	},
	getTitle: function() {
		var record = this.getRecord();
		return record ? record.getSlideText() : '';
	},
	isTitle: function() {
		return (this.getRecord() === null);
	},
	BREADCRUMB_DELIMITER: ' &gt; ',
	getBreadcrumb: function() {
		// topic > subtopic > ... > title
		var me = this;
		var s = '';
		Ext.Array.forEach(this.getTopicArray(), function(topic) {
			s += topic + Engine.model.Node.BREADCRUMB_DELIMITER;
		});
		var title = this.getTitle();
		if (title) {
			s += title;
		}
		s = Engine.util.String.removeFromEnd(s, Engine.model.Node.BREADCRUMB_DELIMITER);
		return s;
	},



})