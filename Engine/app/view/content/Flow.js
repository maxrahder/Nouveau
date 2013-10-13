Ext.define('Engine.view.content.Flow', {
	extend : 'Ext.panel.Panel',
	xtype : 'training_flow',
	requires : [ 'Ext.view.View' ],
	config : {
		store : null
	},
	tbar : [ 'Filter: ', {
		xtype : 'textfield'
	} ],
	layout : 'fit',
	tools : [ {
		type : 'print'
	} ],
	initComponent : function() {
		this.setStore(Ext.StoreManager.get(this.getStore()));
//		var dv = Ext.create('Ext.view.View', {
//			xtype : 'dataview',
//			tpl : '<tpl for="."><div class="flowitem">{text}</div></tpl>',
//			itemSelector : 'div.flowitem',
//			store : this.getStore()
//		});
//		
//		this.add(dv);
		this.callParent();
	}
});