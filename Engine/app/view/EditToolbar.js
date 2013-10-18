Ext.define('Engine.view.EditToolbar', {
    extend: 'Ext.toolbar.Toolbar',
    requires: ['Ext.toolbar.TextItem'],
    xtype: 'edittoolbar',

    config: {
        store: ''
    },

    initComponent: function() {
        var store = this.getStore();
        if (Ext.isString(store)) {
            store = Ext.getStore(store);
            this.setStore(store);
        }
        Engine.model.Node.on('change', this.onNodeChange, this);
        this.callParent();
    },

    onNodeChange: function(node) {
        this.down('#nodeText').setValue(node.getTitle());

        var s = node.isSlide()?node.getRecord().getFilePath():'';
        this.down('#filePathLabel').setText(s);

    },


    dock: 'top',
    editor: true, // tags that this is used for editing
    hidden: true,
    bodyPadding: 2,
    items: [{
            xtype: 'textfield',
            fieldLabel: 'Title',
            labelWidth: 30,
            itemId: 'nodeText',
            width: 220,
            validateOnChange: true
        }, {
            xtype: 'numberfield',
            fieldLabel: 'Duration',
            labelWidth: 48,
            width: 84,
            itemId: 'nodeDuration',
            minValue: 0,
            hideTrigger: true,
            validateOnChange: true
        },
        '', '-', '', {
            glyph: '110@Nouveau',
            itemId: 'addFolder',
            tooltip: 'Add a new folder as the sibling of the selected folder',
            scale: 'small'
        }, {
            glyph: '78@Nouveau',
            itemId: 'addPage',
            tooltip: 'Add a new page as the sibling of the selected page',
            scale: 'small'
        }, '', '', {
            glyph: '68@Nouveau',
            itemId: 'deleteNode',
            tooltip: 'Delete the selected item',
            scale: 'small'
        }, '', '-', '', {
            glyph: '72@Nouveau',
            itemId: 'link'
        }, '', '->', {
            xtype: 'tbtext',
            itemId: 'filePathLabel'
        }, ''
    ]
});