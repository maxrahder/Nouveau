Ext.define('Engine.util.Version', {
	requires: ['Ext.Ajax'],
	singleton: true,
	ready: false,
	constructor: function() {
		var me = this;
		function response(parameters, success, response) {
			me.version = success?Ext.String.trim(response.responseText):'000';
			me.ready = true;
		};
		Ext.Ajax.request({
			url: 'UUID.txt',
			callback: response
		});
		this.callParent();
	}
});