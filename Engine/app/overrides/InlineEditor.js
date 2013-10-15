Ext.define('Engine.overrides.InlineEditor', {
    override: 'Docs.view.examples.InlineEditor',
    /*this is a fix for a JSDuck bug, that scrolls the code to the bottom of the iframe,
    * it adds an additional outerCt element above it that contains information of the overall code height, margins etc. */
    layout: 'fit'
});
