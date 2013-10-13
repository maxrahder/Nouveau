Ext.define('Engine.view.util.TreeOutlineFormats', {
    singleton : true,
    constructor : function(config) {
        this.initConfig(config);

        var romanOnes = [ '', 'i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii', 'ix' ];
        var romanTens = [ '', 'x', 'xx', 'xxx', 'xl', 'l', 'lx', 'lxx', 'lxxx', 'xc' ];
        var romanHundreds = [ '', 'c', 'cc', 'ccc', 'cd', 'd', 'dc', 'dcc', 'dcc', 'cm' ];
        this.romanNumerals = [ romanOnes, romanTens, romanHundreds ];
        
        // This is the sequence of applying the numbering.
        // When running toNumber(index, depth), depth determines
        // the sequence number. Depth also determines how the
        // number alternates from lower-case to upper-case.
        this.sequence = [this.alpha, this.numeric];

        this.callParent(arguments);
    },
    
    /**
     * Converts indexes to a Roman numeral Limitation: 999 items. 
     * roman(1) > i
     * roman(11) >  xi
     */
    roman : function(idx, lowerCase) {
        var buf = [];
        var strArr = new String(idx).split('');
        strArr.reverse();
        for ( var i = 0; i < strArr.length; i++) {
            buf.unshift(this.romanNumerals[i][strArr[i]]);
        }
        var result = buf.join('');
        return (lowerCase?result:result.toUpperCase());
    },

    /**
     * Converts 0-based index to 1-based index
     */
    numeric : function(idx) {
        return idx;
    },
    
    
    
    /**
     * Return the outline number for the specified value at the specified level.
     * Depending on the 
     * @param index
     * @param level
     */
    toNumber : function(value, level){
        var alternates = this.sequence.length;
        // Which function are we using?
        var f = this.sequence[ (level % alternates) ];
        // UC?
        var uc = ( (Math.ceil(level/alternates) % alternates) == 0 ); 
        return f(value, uc);
    },

    /**
     * Converts indexes to a lower-case letter, after reaching z it will cycle
     * and append the next letter. Limitation: None Ex: 
     * 1 -> a 
     * 12 -> l 
     * 28 -> ab
     */
    alpha : function(idx, lowerCase) {
        var buf = [];
        idx--;
        var ln = Math.ceil((idx + 1) / 26);
        for ( var i = 0; i < ln; i++) {
            var digit = (idx % 26);
            idx -= digit;
            buf.unshift(String.fromCharCode(digit + 97));
        }
        var result = buf.join('');
        return lowerCase?result:result.toUpperCase();
    },
    
    /**
     * Retrieves value of a user-defined array to generate custom outlining. If
     * there are not enough elements it will cycle and append.
     */
    indexed : function(idx, arr) {
        var buf = [];
        var arrLn = arr.length;
        var ln = Math.ceil((idx + 1) / arrLn);
        for ( var i = 0; i < ln; i++) {
            var modIdx = (idx % arrLn);
            idx -= modIdx;
            buf.unshift(arr[modIdx]);
        }
        return buf.join('');
    }
});

