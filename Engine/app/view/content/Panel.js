Ext.define('Engine.view.content.Panel', {
    extend: 'Ext.panel.Panel',
    xtype: 'slide',
    requires: [
        'Engine.view.content.Toolbar',
        'Engine.view.content.page.Body',
        'Engine.view.content.page.Title',
        'Engine.view.content.page.Topic'
    ],

    cls: 'content',
    border: false,
    //autoScroll: true,
    config: {
        slideWidth: 1024,
        slideHeight: 768,
        slideMargin: 15
    },

    id: 'content',
    layout: 'card',

    items: [{
        xtype: 'training_contentbody'
    }, {
        xtype: 'training_contenttopic'
    }, {
        xtype: 'training_titlepage'
    }],

    dockedItems: [{
        xtype: 'contenttoolbar',
        dock: 'top'
    }],

    updateActiveItem: function(record, config) {
        // console.log(record.getTopicArray());
        this.record = record; // Save for save to know fileId
        var data = {
            type: record.isLab() ? 'lab' : (record.isSlide() ? 'slide' : 'topic'),
            topic: record.getTopicText(),
            subtopic: record.getSubTopicText(),
            topics: record.getTopicArray(),
            title: record.getSlideText(),
            duration: record.getDuration(),
            body: ''
        };
        Ext.apply(data, config);
        var card = null;
        if (record.isTitle()) {
            card = this.down('training_titlepage');
        } else if (record.isTopic()) {
            card = this.down('training_contenttopic');
        } else if (record.isSlide()) {
            card = this.down('training_contentbody');
        }
        this.updateBreadcrumb(record);
        card.updateContent(data);
        Engine.util.Presentation.enterSlide(card.getEl().dom);
        this.getLayout().setActiveItem(card);
    },
    updateBreadcrumb: function(record) {
        this.down('contenttoolbar').setRecord(record);
    },
    getBreadcrumb: function(){
        return this.down('contenttoolbar').getBreadcrumb();
    },
    showNode: function(record, bodyHtml) {
        this.updateActiveItem(record, {
            body: bodyHtml
        });
    }
});