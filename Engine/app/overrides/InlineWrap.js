Ext.define('Engine.overrides.InlineWrap', {
	override: 'Docs.view.examples.InlineWrap',
	requires: ['Engine.overrides.InlineToolbar'],
    cls: 'wrap',

    /**
     * Wraps pre into initial inline example.
     * @param {HTMLElement} pre
     */
    constructor: function(pre) {
        this.pre = pre;

        var options = this.parseOptions(pre.className);

        this.initToolbar(options);

        //Lee: always load CodeMirror, therefore comment these lines
        //if (options.preview) {
            this.replacePre(options);
        // } else {
        //     this.tb.on("buttonclick", function(name) {
                // switch to code or preview depending on which button clicked.
        //        options.preview = (name === "preview");
        //        this.replacePre(options);
        //    }, this, {single: true});
        //}
    },


    // Parses options from HTML class attribute
    parseOptions: function(text) {
        var options = {};
        Ext.Array.forEach(text.split(/ +/), function(cls) {
            if (cls === "phone" || cls === "miniphone" || cls === "tablet") {
                options.device = cls;
            }
            else if (cls === "landscape" || cls === "portrait") {
                options.orientation = cls;
            }
            else if(cls === "css" || cls === "html" || cls === "sass" || cls === "xml") {
                options.mode = cls;
                options.readonly = true;
            }
            else if(cls === "readonly"){
                options.readonly = true;
            }
            else if(cls === "javascript"){
                options.mode = cls;
            }
            else {
                options[cls] = true;
            }
        });
        return options;
    },

    initToolbar: function(options) {
        var div = document.createElement("div");
        div.className = "toolbar-wrapper";
        this.pre.parentNode.insertBefore(div, this.pre);
        var opt = options;

        //load a customized toolbar instead
        this.tb = Ext.create("Engine.overrides.InlineToolbar", {
            renderTo: div,
            settings: opt //Lee: pass in options
        });
    },  
    
    replacePre: function(options) {
        var div = document.createElement("div");
        div.className = "code-wrapper";
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