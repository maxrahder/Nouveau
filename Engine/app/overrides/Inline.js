/**
 * Inline example tab panel. Allows code to be demonstrated and edited inline.
 */
Ext.define('Engine.overrides.Inline', {
    override: 'Docs.view.examples.Inline',

    // Make too long examples scrollable
    maxCodeHeight: 500,

    initToolbarEvents: function() {
        this.toolbar.on("buttonclick", function(name) {
            if (name === "code") {
                this.showCode();
            }
            else if (name === "preview") {
                this.showPreview();
            }
            else if (name === "themetoggle"){
                if(Engine.Global.theme === "eclipse") {
                    Engine.Global.theme = "monokai";
                } else {
                    Engine.Global.theme = "eclipse";
                }
                this.editor.codemirror.setOption("theme", Engine.Global.theme);
            }
            else if (name === "copy") {
                this.showCode();
                this.editor.selectAll();
            }
        }, this);
    },

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
