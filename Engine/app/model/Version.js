Ext.define('Engine.model.Version', {
	requires: ['Ext.Ajax'],
	singleton: true,
	ready: false,
	constructor: function() {
		var me = '';
		function response(parameters, success, response) {
			me.version = success?Ext.String.trim(response.responseText):'0';
			me.ready = true;
		};
		Ext.Ajax.request({
			url: 'UUID.txt',
			callback: response
		});
		this.callParent();
	}
});