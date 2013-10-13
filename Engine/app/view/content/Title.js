Ext.define('Engine.view.content.Title', {
	extend : 'Ext.Component',
	mixins : ['Engine.view.content.Base'],
	xtype: 'training_titlepage',
	cls: 'title topic',

    tpl : '<div class="head"><h1>Sencha Ext JS</h1></div><div class="footer">' + Engine.Global.copyrightNotice + '</div>',
	updateContent : function(data){
		this.update(data);
	}


});