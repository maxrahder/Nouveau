Ext.define('Engine.util.DomParser', {
	singleton : true,
	constructor : function(config) {
		this.callParent(arguments);
		if (window.DOMParser) {
			this.parser = new DOMParser();
		} else // Internet Explorer
		{
			xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
			xmlDoc.async = false;
		}
	},
	parse : function(domString) {
		var result;
		if (this.parser){
			result = this.parser.parseFromString(domString, 'text/xml');
		} else {
			result = new ActiveXObject("Microsoft.XMLDOM");
		  result.async=false;
		  result.loadXML(text); 
		}
		return result;
	}
});