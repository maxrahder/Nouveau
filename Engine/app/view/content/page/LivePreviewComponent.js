Ext.define('Engine.view.content.page.LivePreviewComponent', {
	extend: 'Ext.Component',
	xtype: 'livepreviewcomponent',
	requires: ['Docs.view.examples.InlineWrap'],
	cls: 'code',
	initComponent: function() {
		this.callParent();
		Ext.create('Docs.view.examples.InlineWrap', this.pre);
	}
});