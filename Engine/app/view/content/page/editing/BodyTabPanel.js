Ext.define('Engine.view.content.editing.BodyEdit', {
	extend : 'Ext.form.field.HtmlEditor',
	enableAlignments : false,
	enableColors : false,
	enableFont : false,
	enableFontSize : false,
	enableFormat : false,
	enableLinks : true,
	alias : 'widget.training_contentbodyedit',
	cls : 'body',
	updateContent: function(data){
		this.setValue(data.html);
	}
});
