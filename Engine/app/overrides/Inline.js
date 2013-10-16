/**
 * Inline example tab panel. Allows code to be demonstrated and edited inline.
 */
Ext.define('Engine.overrides.Inline', {
    override: 'Docs.view.examples.Inline',

    // Make too long examples scrollable
    maxCodeHeight: 500,

    // Syncs the height with number of lines in code example.
    updateHeight: function() {
        var previewHeight = this.preview.getHeight();
        var editorHeight = this.editor.getHeight();
        var toolbarHeight = 45;
        
        if(!editorHeight > 0) editorHeight = 0;
        if(!previewHeight > 0) previewHeight = 0;

        if(previewHeight+toolbarHeight > editorHeight+toolbarHeight){
            this.setHeight(previewHeight+toolbarHeight);
        } else {
            this.setHeight(editorHeight+toolbarHeight);
            //this.setHeight(Ext.Number.constrain(editorHeight+toolbarHeight, 0, this.maxCodeHeight));
        }

    }

});
