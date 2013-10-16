Ext.define('Engine.view.content.page.LivePreviewWindow', {
	extend: 'Ext.window.Window',
	requires: ['livePreviewComponent'],
	autoShow: true,
	layout: 'fit',
	items: [{
		xtype: 'livepreviewcomponent'
	}]
})