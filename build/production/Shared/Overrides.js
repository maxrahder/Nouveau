Ext.define('Engine.overrides.InlinePreview', {
	override: 'Docs.view.examples.InlinePreview',

	// Nouveau Addition
	iFrameUrlExtJs: '../Shared/LivePreviewSupport/extjs/eg-iframe.html',
	iFrameUrlTouch: '../Shared/LivePreviewSupport/touch/eg-iframe.html',

	getHtml: function() {
		var me = this;
		if (Docs.data.touchExamplesUi) {
			return Ext.create('Docs.view.examples.Device', {

				url: me.iFrameUrlTouch,

				id: this.iframeId,
				device: this.options.device,
				orientation: this.options.orientation
			}).toHtml();
		} else {
			// frameBorder=0 is needed to hide the border in IE8
			var tpl = new Ext.XTemplate(
				'<iframe id="{id}" style="width: 100%; height: 100%; min-height: 500px; border: 0" frameBorder="0"></iframe>'
			);
			return tpl.apply({
				id: this.iframeId
			});
		}
	},
	update: function(code) {
		var me = this;

		var options = this.options;
		var iframe = Ext.get(this.iframeId);
		var callback = Ext.Function.bind(this.iframeCallback, this);

		if (iframe) {
			// Something is not quite ready when onload fires.
			// I'm unsure what I should wait for. So I'm currently adding just this nasty delay.
			// 1 ms works in Chrome, Firefox wants something bigger. Works in IE too.
			iframe.on('load', function() {
				Ext.Function.defer(function() {
					// Append newline to code, otherwise we might result in syntax error as
					// eval() doesn't like when code ends with line-comment.
					iframe.dom.contentWindow.loadInlineExample(code + "\n", options, callback);
				}, 100);
			}, this, {
				single: true
			});

			if (Docs.data.touchExamplesUi) {
				iframe.dom.src = me.iFrameUrlTouch;
			} else {
				iframe.dom.src = me.iFrameUrlExtJs;
			}
		}
	},
});