Ext.define('Engine.view.content.page.Topic', {
	extend: 'Ext.Component',

	requires: ['Engine.util.Time', 'Ext.XTemplate'],

	xtype: 'training_contenttopic',

	tpl: [
		'<div class="topic">' 
		+ '<div class="head">' 
		+ '<h1>{[values.topics[0]]}</h1>' 
		+ '{[ values.topics[1] ? "<h2>" + values.topics[1] + "</h2>" : "" ]}' 
		+ '{[ values.topics[2] ? "<h2>" + values.topics[2] + "</h2>" : "" ]}' 
		+ '<h3>{title}</h3>' 
		+ '</div>' 
		+ '<div class="body">{body}</div>' 
		+ '</div>'
		],

	initComponent: function() {
		// var f = function(duration, delimiter) {
		// 	return Engine.util.Time.minutesToHoursString(duration, delimiter);
		// };
		// var tpl = this.getTemplate('topic') + '<div class="footer" >' + Engine.Global.copyrightNotice + ' <small>Ref: {[this.toDurationString(values.duration, "-")]}</small></div>';
		// this.tpl = Ext.create('Ext.XTemplate', tpl, {
		// 	toDurationString: f
		// });
		this.callParent();
	},
	updateContent: function(data) {
		this.update(data);
	}


});