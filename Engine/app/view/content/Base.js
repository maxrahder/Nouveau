Ext.define('Engine.view.content.Base', {
	
	getTemplate : function(type) {
		var s = 
			  '<div class="' + type + '">' 
				+ '<div class="head">'
				+   '<h1>{[values.topics[0]]}</h1>' 
				+   '{[ values.topics[1] ? "<h2>" + values.topics[1] + "</h2>" : "" ]}'
				+   '{[ values.topics[2] ? "<h2>" + values.topics[2] + "</h2>" : "" ]}' 
				+   '<h3>{title}</h3>' 
			  +   '</div>'
			  +   '<div class="body">{body}</div>' 
		  + '</div>';
		return s;
	},
	
	// Abstract
	updateContent : function() {
		content.log('Error: updateContent() in abstract class. The subclass needs to implement this method.');
	}
	
});