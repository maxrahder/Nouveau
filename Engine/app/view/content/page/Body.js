Ext.define('Engine.view.content.page.Body', {
	extend: 'Ext.container.Container',
	xtype: 'training_contentbody',
	requires: [
		//'Docs.view.examples.InlineWrap',
		'Ext.tab.Panel',
		'Engine.view.util.ExpandingContent',
		'Engine.view.content.page.LivePreviewComponent',
		'Engine.view.content.page.ContentPanel'
	],

	cls: 'body',
	config: {
		editing: false
	},
	initComponent: function() {

		this.template = Ext.create('Ext.XTemplate',
			'<div class="{type}">',
			'<div class="head">',
			'<h1>{[values.topics[0]]}</h1>',
			'{[ values.subtopic ? "<h3>" + values.subtopic + "</h3>" : "" ]}',
			'<tpl if="this.isLab(title)">',
			"<h2 class='lab'>{title}</h2>",
			'<tpl else>',
			"<h2 class='slide'>{title}</h2>",
			'</tpl>',
			'</div>',
			'<div class="body">{body}</div>',
			'</div>',
			'<span class="branding"></span>', {
				isLab: function(title) {
					return title.indexOf('Lab:') !== -1;
				}
			});

		var me = this;
		var content = {
			xtype: 'panel',
			layout: 'border',
			itemId: 'contentPanel',
			items: [{

				xtype: 'panel',
				layout: 'fit',
				region: 'north',
				itemId: 'dockedLivePreview',
				cls: 'code-preview',
				collapsible: true,
				animCollapse: true,
				split: true,
				collapseMode: 'mini',
				header: false,

				dock: 'top'
			}, {
				region: 'center',
				cls: 'slide-center',
				xtype: 'component',
				padding: '0px 8px 8px 8px',
				autoScroll: true,
				itemId: 'content'
			}]

		};

		this.layout = 'fit';
		if (this.getEditing()) {
			this.items = [{
				xtype: 'tabpanel',
				deferredRender: false,
				items: [{
					xtype: 'panel',
					layout: 'fit',
					title: 'Preview',
					// Tag for handler
					isContent: true,
					items: [content]
				}, {
					xtype: 'panel',
					layout: 'fit',
					title: 'Edit',
					items: [{
						xtype: 'textarea',
						name: 'content',
						autoScroll: true,
						value: ''
					}]
				}],
				listeners: {
					tabchange: function(tabPanel, newCard, oldCard) {
						if (newCard.isContent) {
							// Going from edit to preview...
							var textArea = me.down('textarea');
							if (textArea.getValue() != textArea.originalValue) {
								me.fireEvent('save', me, textArea.getValue());
							}
							newCard.setTitle('Preview');
						} else {
							oldCard.setTitle('Preview (Save)');
						}
					}
				}
			}];
		} else {
			this.items = [content];
		}
		this.callParent();
	},
	getContentElement: function() {
		return this.down('#content').getEl();
	},

	updateContent: function(data) {

		var me = this;

		this.template.overwrite(this.getContentElement(), data);

		// Attempt to get past some subtle timing issues where the
		// code preview wasn't showing consistently.
		Ext.Function.defer(function() {
				if (me.getEditing()) {
					var textArea = me.down('textarea');
					textArea.originalValue = data.body;
					textArea.setValue(data.body);
				}

				var dlp = me.down('#dockedLivePreview');
				if (dlp) {
					dlp.removeAll();
					dlp.hide();
				}

				var preDocked = Ext.query('pre.docked');
				if (preDocked[0]) {
					preDocked = preDocked[0];
					// var p = Ext.get(preDocked);

					// p.addCls('code');
					// p.remove();
					// var c = Ext.create('Ext.Component', {
					// 	xtype: 'component',
					// 	cls: 'code-preview',
					// 	height: 300,
					// 	html: preDocked.outerHTML
					// });
					// // c.on('render', function(component) {
					// // 	var composite = Ext.query('pre.docked');
					// // 	Ext.create("Docs.view.examples.InlineWrap", composite[0]);
					// // });
					// dlp.add(c);
					// dlp.show();

					Ext.create('Ext.window.Window', {
						autoShow: true,
						layout: 'fit',
						height: 300,
						width: 500,
						cls: 'code-window',
						glyph: '76@Nouveau',
						title: 'Lab editor',
						contentEl: preDocked
					});
					
					Ext.create('Engine.view.content.page.LivePreviewComponent', {
						pre: preDocked
					});

				}

				Ext.Array.each(Ext.query('pre.runnable'), function(pre) {
					var p = Ext.get(pre);
					p.addCls('code');
					// This shows Live Preview for divs *other* than the 
					// one docked at the top.
					if (!p.hasCls('docked')) {
						// var d = Ext.create("Docs.view.examples.InlineWrap", pre);
						// d.dockedLab = true;

						Ext.create('Engine.view.content.page.LivePreviewComponent', {
							pre: pre
						});

					}
				});

				Ext.Array.each(Ext.query('div[type=expander]'), function(element) {
					Ext.create('Engine.view.util.ExpandingContent', {
						expanderElement: Ext.get(element),
						titleTag: 'h1',
						contentTag: 'div',
						cls: 'expander'
					});
				});
			},
			40);

	}

});