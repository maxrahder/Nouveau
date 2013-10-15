Ext.Loader.setPath('Docs', '../jsduck/template/app');
Ext.define('Engine.Application', {
	extend: 'Ext.app.Application',

	requires: [
		'Engine.overrides.InlineWrap',


		'Engine.view.Viewport',
		'Engine.Global',
		'Engine.util.Time',
		'Engine.util.Presentation',
		'Engine.util.String',
		'Engine.controller.Tree',
		'Engine.controller.Edit'
	],

	controllers: [
		'Engine.controller.Tree',
		'Engine.controller.Edit'
	],

	launch: function() {
		Docs.data = {};
		Ext.create('Engine.view.Viewport');
	}

});