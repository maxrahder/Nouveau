Ext.define('Engine.overrides.InlineWrap', {
	override: 'Docs.view.examples.InlineWrap',
	requires: ['Engine.overrides.InlineToolbar'],

    /**
     * Wraps pre into initial inline example.
     * @param {HTMLElement} pre
     */
    constructor: function(pre) {
        this.pre = pre;

        var options = this.parseOptions(pre.className);
        this.initToolbar();
        this.replacePre(options);
    },

    initToolbar: function() {
        var div = document.createElement("div");
        this.pre.parentNode.insertBefore(div, this.pre);

        //load a customized toolbar instead
        this.tb = Ext.create("Engine.overrides.InlineToolbar", {
            renderTo: div
        });
    },  
    
    replacePre: function(options) {
        var div = document.createElement("div");
        this.pre.parentNode.replaceChild(div, this.pre);

        //we need to fix the Inline example, to meets its height
        Ext.create('Docs.view.examples.Inline', {
            renderTo: div,
            value: Ext.String.htmlDecode(Ext.util.Format.stripTags(this.pre.innerHTML)),
            options: options,
            toolbar: this.tb
        });
    }

});