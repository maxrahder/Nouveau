/**
 * Toolbar for inline examples.
 */
Ext.define('Engine.overrides.InlineToolbar', {
    extend: 'Ext.toolbar.Toolbar',
    componentCls: 'inline-example-tb',
    height: 30,

    initComponent: function() {
        this.addEvents(
            /**
             * @event
             * Fired when a button on toolbar clicked.
             * @param {String} name  Name of the button.
             * Possible values: "code", "preview", "copy"
             */
            "buttonclick"
        );

        this.items = [
            {
                glyph: '67@Nouveau',
                padding: '0 2px 0 0',
                margin: '0 3px 0 0',
                text: 'Code Editor',
                handler: this.createEventFirerer("code")
            },
            {
                glyph: '80@Nouveau',
                padding: 0,
                margin: '0 3px 0 0',
                text: 'Live Preview',
                handler: this.createEventFirerer("preview")
            },
            "->",
            {

                margin: '0 10px 0 0',
                padding: '0 2px 0 0',
                glyph: '83@Nouveau',
                text: 'Select Code',
                handler: this.createEventFirerer("copy")
            }
        ];

        this.callParent(arguments);
    },

    createEventFirerer: function(name) {
        return Ext.Function.bind(function() {
            this.fireEvent("buttonclick", name);
        }, this);
    },

    activateButton: function(name) {
        Ext.Array.each(this.query('button'), function(b) {
            b.removeCls('active');
        });
        Ext.Array.each(this.query('button[iconCls=' + name + ']'), function(b) {
            b.addCls('active');
        });
    }

});
