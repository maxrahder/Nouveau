Ext.define('Engine.util.Sync', {
	requires: ['Ext.Ajax'],
	singleton: true,
	url: 'http://yelp.senchabits.com/go',
	setPage: function(page) {
		if (Engine.util.Version.ready) {
			function failure(parameters, success, response) {
				if (!success) {
					console.log('Page sync set is failing');
					console.log(response);
				}
			};
			var version = Engine.util.Version.version;
			Ext.Ajax.request({
				url: this.url,
				failure: failure,
				params: {
					fn: 'pagesyncset',
					name: version,
					value: page
				}
			});
		}
	},
	getPage: function(callback) {
		if (Engine.util.Version.ready) {
			function success(parameters, success, response) {
				if (success){
					var data = Ext.JSON.decode(response.responseText);
					callback(data.value)
				}
			};
			var version = Engine.util.Version.version;
			Ext.Ajax.request({
				url: this.url,
				success: success,
				params: {
					fn: 'pagesyncget',
					name: version,
					value: page
				}
			});
		}
	}
});