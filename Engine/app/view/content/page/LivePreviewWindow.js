Ext.define('Engine.view.content.page.LivePreviewWindow', {
	extend: 'Ext.window.Window',
	requires: ['Engine.view.content.page.LivePreviewComponent'],
	autoShow: true,
	cls: 'code-window',
	layout: 'fit',
	items: [{
		xtype: 'livepreviewcomponent'
	}]
})