Ext.define('Engine.overrides.InlineEditor', {
    override: 'Docs.view.examples.InlineEditor',
    /*this is a fix for a JSDuck bug, that scrolls the code to the bottom of the iframe,
    * it adds an additional outerCt element above it that contains information of the overall code height, margins etc. */
    layout: 'fit',


    initComponent: function() {
        this.callParent(arguments);
        this.addEvents(
            /**
             * @event
             * Fired after CodeMirror initialized.
             */
            "init",
            /**
             * @event
             * Fired when CodeMirror onChange is called.
             */
            "change"
        );
        this.on("afterlayout", this.initCodeMirror, this);
    },

    initCodeMirror: function(cmp) {
        var me = this;
        if (!this.codemirror) {
            this.codemirror = CodeMirror(me.body, {
                mode:  me.mode,
                indentUnit: 4,
                value: me.value,
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
