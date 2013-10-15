Ext.define('Engine.view.content.Toolbar', {
    extend: 'Ext.toolbar.Toolbar',
    xtype: 'contenttoolbar',
    cls: 'breadcrumbs',
    config: {
        record: '',
        breadcrumb: '',
        node: ''
    },
    initComponent: function(){
        this.callParent();
    },
    items: [{
            xtype: 'tbtext',
            itemId: 'breadcrumb'
        },
        '->', {
            cls: 'font-size',
            glyph: '45@Nouveau',
            tooltip: 'Decrease Font Size',
            handler: function(button) {
                button.up('contenttoolbar').changeSize(-10);
            }
        }, {
            cls: 'font-size',
            glyph: '43@Nouveau',
            tooltip: 'Increase Font Size',
            handler: function(button) {
                button.up('contenttoolbar').changeSize(10);
            }
        }
    ],

    changeSize: function(val) {
        var rule = Ext.util.CSS.getRule('div.slide .body', true);
        var size = parseInt(rule.style.getPropertyValue('font-size'));
        var lh = parseInt(rule.style.getPropertyValue('line-height'));
        var w = parseInt(rule.style.getPropertyValue('max-width'));

        if (!this.fontSize) {
            this.fontSize = size;
        }

        if (size + val >= 20) Ext.util.CSS.updateRule('div.slide .body', 'fontSize', size + val + 'px');
        if (lh + (val * 1.5) >= 30) Ext.util.CSS.updateRule('div.slide .body', 'lineHeight', lh + (val * 1.5) + 'px');
        if (w + (val * 6) >= 720) Ext.util.CSS.updateRule('div.slide .body', 'maxWidth', w + (val * 6) + 'px');
    },

    updateRecord: function(record, oldValue) {
        if (!record) {
            return;
        }
        // <div class="crumb">topic > subtopic > ... > title </div>
        var breadcrumbDelimiter = ' > ';
        var s = '';
        Ext.Array.forEach(record.getTopicArray(), function(topic) {
            s += topic + breadcrumbDelimiter;
        });
        s += record.getSlideText();
        s = Engine.util.String.removeFromEnd(s, breadcrumbDelimiter);

        this.setBreadcrumb(s);
    },
    updateBreadcrumb: function(string) {
        this.down('#breadcrumb').setText(string);
    }

});