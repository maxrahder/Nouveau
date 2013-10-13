Ext.define('Engine.view.content.Topic', {
	extend: 'Ext.Component',
	requires: ['Engine.util.Time', 'Ext.XTemplate'],
	mixins: ['Engine.view.content.Base'],
	xtype: 'training_contenttopic',
	initComponent: function() {
		var f = function(duration, delimiter) {
			return Engine.util.Time.minutesToHoursString(duration, delimiter);
		};
		var tpl = this.getTemplate('topic') + '<div class="footer" >' + Engine.Global.copyrightNotice + ' <small>Ref: {[this.toDurationString(values.duration, "-")]}</small></div>';
		this.tpl = Ext.create('Ext.XTemplate', tpl, {
			toDurationString: f
		});
		this.callParent();
	},
	updateContent: function(data) {
		this.update(data);
	}


});