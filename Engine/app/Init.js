Ext.define('Engine.Init',{
    singleton: true,
    requires: [],
    constructor: function(config){
        this.initConfig(config);
        this.callParent(config);
        
        Ext.tip.QuickTipManager.init();

        // Ext.supports.LocalStorage will be supported in 4.1.2
        // So delete the following line when it's there.
        Ext.supports.LocalStorage = 'localStorage' in window && window['localStorage'] !== null;

    }
});