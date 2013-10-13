Ext.define('Engine.util.File', {
	extend: 'Ext.util.Observable',
	required: ['Engine.util.DomParser'],
	config: {
		path: ''
	},
	constructor: function(config) {
		this.initConfig(config);
		this.callParent(arguments);
	},
	// Returns an array of the child File objects.
	// If this is not a directory, getChildren()
	// returns an empty array. TODO: Passing true in
	// contents will return all children in sub-
	// directories. sub-directories is not yet
	// implemented,
	getChildren: function(callback, subdirectories) {
		var me = this;
		result = [];
		var p = this.getPath();
		if ((p.length > 0) && ((p.substr(0, 1) === '/') || p.substr(p.length - 1, 1) === '/')) {
			// p must start and end with /
			Ext.Ajax.request({
				url: p,
				success: function(response) {
					var text = response.responseText;
					var start = text.indexOf('<body>');
					var end = text.indexOf('</body>');
					var s = text.substr(start, end - start + 7);
					// Assert: s contains the body tag and its contents
					var dom = Engine.util.DomParser.parse(s);
					var nodes = dom.getElementsByTagName('a');
					var result = [];
					for (var i = 0; i < nodes.length; i++) {
						var item = nodes.item(i);
						var a = item.getAttribute("href");
						if (Engine.util.String.endsWith(a, '.html')) {
							a = Engine.util.String.removeFromEnd(a, '.html');
							result.push(a);
						}
					}
					if (callback) {
						callback(result);
					}
				}
			});
		} else {
			return result;
		}
	}
});