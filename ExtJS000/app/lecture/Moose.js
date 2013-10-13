// Used as dynamic loading example for the Class System lecture.
Ext.define('Engine.lecture.Moose', {
	extend: 'Engine.lecture.Mammal',
	statics: {
		GENUS: 'Alces',
		SPECIES: 'alces',
		SCIENTIFICNAME: 'Alces alces'
	},
	config: {
		name: 'Bullwinkle'
	}
});