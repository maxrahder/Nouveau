Ext.define('Engine.view.content.Panel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.training_content',
    requires: [
        'Engine.view.content.Header',
        'Engine.view.content.Body',
        'Engine.view.content.Title',
        'Engine.view.content.BodyEdit',
        'Engine.view.content.Topic',
        'Engine.view.content.Slide'
    ],
    cls: 'content',
    border: false,
    autoScroll: true,
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

    initComponent: function() {
        this.dockedItems = [{
            xtype: 'toolbar',
            dock: 'top',
            items: [{
                    xtype: 'tbtext',
                    crumb: true
                },
                '->', {
                    cls: 'font-size',
                    iconCls: 'font-less',
                    tooltip: 'Decrease Font Size',
                    handler: Ext.Function.bind(this.changeSize, this, [-10])
                }, {
                    cls: 'font-size',
                    iconCls: 'font-more',
                    tooltip: 'Increase Font Size',
                    handler: Ext.Function.bind(this.changeSize, this, [10])
                }
            ]
        }];

        this.callParent();
    },

    changeSize: function(val) {
        var rule = Ext.util.CSS.getRule('#content', true);
        var size = parseInt(rule.style.getPropertyValue('font-size'));
        if (!this.fontSize) {
            this.fontSize = size;
        }
        Ext.util.CSS.updateRule('#content', 'fontSize', size + val + '%');
    },

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
    getBreadcrumb: function(record) {
        // <div class="crumb">topic > subtopic > ... > title </div>
        var breadcrumbDelimiter = '>';
        var s = '';
        Ext.Array.forEach(record.getTopicArray(), function(topic) {
            s += topic + breadcrumbDelimiter;
        });
        s += record.getSlideText();
        s = Engine.util.String.removeFromEnd(s, breadcrumbDelimiter);
        return s;
    },
    // private
    updateBreadcrumb: function(record) {
        this.down('toolbar *[crumb]').setText(this.getBreadcrumb(record));
    },
    showNode: function(record, bodyHtml) {
        this.updateActiveItem(record, {
            body: bodyHtml
        });
    }
});