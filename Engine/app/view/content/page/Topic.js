Ext.define('Engine.view.content.page.Topic', {
	extend: 'Ext.Component',

	requires: ['Engine.util.Time', 'Ext.XTemplate'],

	xtype: 'training_contenttopic',

	tpl: Ext.create('Ext.XTemplate',

		'<div class="topic">',
		'<div class="head">',

		'<tpl for=".">',
		'{[this.topicLine(xindex, values)]}',
		'</tpl>',

		'</div>',

		'<div class="footer">',
		Engine.Global.copyrightNotice,
		'</div>',

		'</div>', {
			topicLine: function(count, topic) {
				var tag = (count === 1) ? 'h1>' : 'h2>';
				return '<' + tag + topic + '</' + tag;
			}
		}),

	updateContent: function(node) {
		if (node.isTopic()) {
			this.update(node.getTopicArray());
		}
	}


});