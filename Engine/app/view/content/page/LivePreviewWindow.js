Ext.define('Engine.view.content.page.LivePreviewWindow', {
	extend: 'Ext.window.Window',
	requires: ['livePreviewComponent'],
	autoShow: true,
	cls: 'code-window',
	layout: 'fit',
	items: [{
		xtype: 'livepreviewcomponent'
	}]
})