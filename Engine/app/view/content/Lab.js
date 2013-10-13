/**
 * Labs can be in edit mode, thus showing a tab panel with Preview and Edit panels.
 * Labs can also optionally have a docked Docs.view.examples.InlineWrap with the 
 * live preview example the students edit. 
 */
Ext.define('Engine.view.content.Lab', {
	extend : 'Ext.container.Container',
	mixins : ['Engine.view.content.Base'],
	
	initComponent : function(){
		
		this.tpl = this.getTemplate('lab');
		

		var plainPanel = {
				
		};
		
		var panelWithEditor = {
				xtype: 'panel',
				layout: 'border',
				items: [{xtype: 'panel'}]
		};
		
		this.callParent();
		
	}
});