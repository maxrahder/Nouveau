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
		return record ? record.get('text') : '';
	},
	getTopicId: function(){
		var record = this.getRecord();
		return record ? record.get('topicId') : '';
	},
	isSplash: function() {
		var record = this.getRecord();
		return record ? (this.getTopicId() === 'splash') : true;
	}

})