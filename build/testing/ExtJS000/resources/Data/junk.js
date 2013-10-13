Ext.define('MyApp.model.Person', {
    extend: 'Ext.data.Model',
    fields: ['first', 'last']
});
Ext.define('MyApp.store.Persons', {
    extend: 'Ext.data.Store',
    model: 'MyApp.model.Person',
    autoLoad: true,
    proxy: {
        type: 'ajax',
        url: '../Data/json/theBeatles.json'
    }
});

var store = Ext.create('MyApp.store.Persons');

Ext.create('Ext.form.Panel', {
    buttons: [{
        text: 'Submit',
        handler: function(button){
            button.up('form').submit({
                url: '../Data/successWithData.html',
                success: function(form, action){
                    store.loadData(action.result.data);
                }
            });
        }
    }],
    items: [{
        xtype: 'grid',
        store: store,
        columns: [{
            text: 'First',
            dataIndex: 'first'
        }, {
            text: 'Last',
            dataIndex: 'last'
        }]
    }],
    width: 200,
    layout: 'fit',
    renderTo: Ext.getBody()
});