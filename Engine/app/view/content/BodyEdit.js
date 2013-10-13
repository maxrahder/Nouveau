Ext.define('Engine.view.content.BodyEdit', {
	extend : 'Ext.form.field.HtmlEditor',
	enableAlignments : false,
	enableColors : false,
	enableFont : false,
	enableFontSize : false,
	enableFormat : false,
	enableLinks : false,
	alias : 'widget.training_contentbodyedit',
	cls : 'body',
	updateContent: function(data){
		this.setValue(data.html);
	}
});
