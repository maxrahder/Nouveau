Ext.define('Engine.view.content.page.ContentPanel', {
	extend: 'Ext.panel.Panel',
	xtype: 'contentpanel',
	config: {
		node: null
	},
	layout: 'border',
	items: [{

		xtype: 'panel',
		layout: 'fit',
		region: 'north',
		itemId: 'dockedLivePreview',
		cls: 'code-preview',
		collapsible: true,
		animCollapse: true,
		split: true,
		collapseMode: 'mini',
		header: false,

		dock: 'top'
	}, {
		region: 'center',
		cls: 'slide-center',
		xtype: 'component',
		padding: '0px 8px 8px 8px',
		autoScroll: true,
		itemId: 'content'
	}]

});