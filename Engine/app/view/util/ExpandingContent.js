Ext
	.define(
		'Engine.view.util.ExpandingContent', {
			extend: 'Ext.Component',
			config: {
				title: '',
				expanded: false,
				content: '',
				expanderElement: null
			},
			titleTag: 'div',
			titleCls: 'training-expandingcontent-title',
			contentTag: 'div',
			contentCls: 'training-expandingcontent-content',
			initComponent: function() {
				var t = Ext.DomHelper.createTemplate({
					children: [{
						tag: this.titleTag,
						expandingContentTitle: true,
						cls: this.titleCls,
						html: '<span class="training-expandingcontent-expander {expanded}"></span>{title}'
					}, {
						tag: this.contentTag,
						expandingContentContent: true,
						cls: this.contentCls,
						html: '{content}'
					}]
				});
				var ee = this.getExpanderElement();
				if (ee) {
					this.setTitle(ee.getAttribute('caption'));
					this.setContent(ee.getHTML());
					ee.setHTML('');
					this.renderTo = ee;
					ee.removeCls('x-hidden');
				}
				this.tpl = t;
				this.callParent();
			},
			getTitleElement: function() {
				return this.el.down('*[expandingContentTitle]');
			},
			onRender: function() {
				var me = this;
				this.callParent();
				this.update({
					title: this.getTitle(),
					content: this.getContent(),
					expanded: (this.getExpanded() ? 'expanded' : '')
				});
				this.titleElement = this.getTitleElement();
				this.contentElement = this.el.down('*[expandingContentContent]');

				if (!this.getExpanded()) {
					me.contentElement.setStyle('display', 'none');
				}
				this.titleElement.on('click', function(event, target) {
					var el = me.titleElement.down('span');
					el.toggleCls('expanded');
					me.setExpanded(!me.getExpanded());
					if (me.getExpanded()) {
						me.contentElement.slideIn('t', {
							listeners: {
								afteranimate: function(element) {
									//me.contentElement.removeCls('collapsed');
								}
							}
						});
					} else {
						me.contentElement.slideOut('t', {
							remove: true,
							listeners: {
								afteranimate: function() {
									me.contentElement.setStyle('display', 'none');
								}
							}
						});
					}
				});
			}
		});