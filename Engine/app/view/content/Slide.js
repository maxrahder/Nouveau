/**
 * There are two cards: plain content and the border, with the code on top
 */
Ext.define('Engine.view.content.Slide', {
	extend : 'Engine.view.content.Base',
	xtype : 'training_topic',
	layout : 'card',
	initComponent : function() {
		var content = {};
		this.callParent();
	},
	items : [ {
		xtype : 'component'
	}, {} ]
});
