Ext.define('Engine.view.Viewport', {
	extend: 'Ext.container.Viewport',
	requires: [
		'Engine.view.content.Panel',
		'Engine.view.EditToolbar',
		'Ext.layout.container.Border',
		'Engine.view.content.Flow'
	],
	layout: 'fit',
	cls: 'training',
	border: false,
	items: [{
		xtype: 'panel',
		layout: 'border',
		itemId: 'mainPanel',
		style: 'background-color: #aaa',
		border: false,
		dockedItems: [{
			xtype: 'edittoolbar'
		}],
		items: [{
			xtype: 'training_tree',
			store: 'Topics',

			collapsible: true,
			titleCollapse: true,
			hideCollapseTool: true,
			animCollapse: true,
			split: true,
			collapseMode: 'mini',

			title: 'Topics',

			width: 250,
			maxWidth: 250,
			region: 'west'

		}, {
			xtype: 'training_content',
			region: 'center'
		}]
	}]
});