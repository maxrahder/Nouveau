Ext.define('Engine.util.String', {
    singleton : true,
    endsWith : function(s, suffix) {
        if (s){
            return (s.indexOf(suffix, s.length - suffix.length) !== -1);
        } else {
            return false;
        }
    },
    removeFromEnd : function(s, suffix) {
        if (Engine.util.String.endsWith(s, suffix)){
            return s.substr(0, s.length - suffix.length);
        } else {
            return s;
        }
    }
});