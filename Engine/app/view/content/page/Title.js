Ext.define('Engine.view.content.page.Title', {
	extend: 'Ext.Component',

	xtype: 'training_titlepage',

	cls: 'title topic',

	html: '<div class="head"><h1>Sencha Ext JS</h1></div><div class="footer">' + Engine.Global.copyrightNotice + '</div>',

	updateContent: function(node) {

	}

});