/**
 * Toolbar for inline examples.
 */
Ext.define('Engine.overrides.InlineToolbar', {
    extend: 'Ext.toolbar.Toolbar',
    componentCls: 'inline-example-tb',
    height: 35,

    settings: {},

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

        var items = [];

        items.push({
                glyph: '67@Nouveau',
                padding: 2,
                margin: '0 3px 0 0',
                text: 'Code Editor',
                handler: this.createEventFirerer("code")
            });

        if(!this.settings.readonly){
            items.push({
                glyph: '80@Nouveau',
                padding: 2,
                margin: '0 3px 0 0',
                text: 'Preview',
                handler: this.createEventFirerer("preview")
            });
        }
            
        items.push(
            "->",
            {

                margin: '0 10px 0 0',
                padding: 2,
                glyph: '56@Nouveau',
                text: 'Toggle Theme',
                handler: this.createEventFirerer("themetoggle")
            }
        );

        this.items = items;
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
