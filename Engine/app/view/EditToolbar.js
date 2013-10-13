Ext.define('Engine.view.EditToolbar', {
    extend: 'Ext.toolbar.Toolbar',
    requires: ['Ext.toolbar.TextItem'],
    xtype: 'edittoolbar',
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
        icon: 'resources/images/folder_add.png',
        itemId: 'addFolder',
        tooltip: 'Add a new folder as the sibling of the selected folder',
        scale: 'small'
    }, {
        icon: 'resources/images/page_add.png',
        itemId: 'addPage',
        tooltip: 'Add a new page as the sibling of the selected page',
        scale: 'small'
    }, '', '', {
        icon: 'resources/images/delete.png',
        itemId: 'deleteNode',
        tooltip: 'Delete the selected item',
        scale: 'small'
    }, '', '-', '', {
        icon: 'resources/images/link.png',
        itemId: 'link',
        tooltip: 'Get the link to this page'
        // }, '', '-', '' , {
        //     icon : 'resources/images/settings2.png',
        //     itemId : 'options',
        //     tooltip : 'Set options'
    }, '', '->', {
        xtype: 'tbtext',
        itemId: 'filePathLabel'
    }, '']
});