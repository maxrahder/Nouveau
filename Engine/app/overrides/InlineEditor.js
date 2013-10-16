Ext.define('Engine.overrides.InlineEditor', {
    override: 'Docs.view.examples.InlineEditor',
    /*this is a fix for a JSDuck bug, that scrolls the code to the bottom of the iframe,
    * it adds an additional outerCt element above it that contains information of the overall code height, margins etc. */
    layout: 'fit',

    initCodeMirror: function(cmp) {
        if (!this.codemirror) {
            this.codemirror = CodeMirror(this.body, {
                mode:  "javascript",
                indentUnit: 4,
                value: this.value,
                lineNumbers: true,
                theme: Engine.Global.theme,
                extraKeys: {
                    "Tab": "indentMore",
                    "Shift-Tab": "indentLess"
                },
                onChange: Ext.Function.bind(function(e) {
                    this.fireEvent("change");
                }, this)
            });
            this.fireEvent("init");
        }
    },
});
