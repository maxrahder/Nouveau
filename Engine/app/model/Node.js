Ext.define('Engine.model.Node', {
	extend: 'Ext.util.Observable',
	config: {
		record: null
	},
	updateRecord: function(record) {

	},
	isSlide: function() {
		return this.getRecord().isLeaf();
	}

})