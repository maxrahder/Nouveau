Ext.define('Engine.view.content.Header', {
	extend : 'Ext.Component',
	alias : 'widget.training_contentheader',
	cls : 'header',
	style: 'margin: 0 0 8px 0',
	height: 100,
	border: false,
	tpl : Ext.create('Ext.Template', '<h1>{topic}</h1>'),
	tplTopic : Ext.create('Ext.Template', '<h1>{topic}</h1>'),
	tplTopicSubtopic : Ext.create('Ext.Template', '<h1>{topic}</h1><h2>{subtopic}</h2>'),
	updateContent: function(data){
		if (data.subtopic){
			this.tplTopicSubtopic.overwrite(this.getEl(), data);
			this.setHeight(100);
		} else {
			this.tplTopic.overwrite(this.getEl(), data);
			this.setHeight(60);
		}
	}
});