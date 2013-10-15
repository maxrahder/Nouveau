Ext.define('Engine.overrides.InlineWrap', {
	override: 'Docs.view.examples.InlineWrap',
	requires: ['Engine.overrides.InlineToolbar'],

    initToolbar: function() {
        var div = document.createElement("div");
        this.pre.parentNode.insertBefore(div, this.pre);

        this.tb = Ext.create("Engine.overrides.InlineToolbar", {
            renderTo: div
        });
    }  
    
});