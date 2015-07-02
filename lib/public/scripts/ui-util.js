angular
.module('ui.util', [])
.filter('unit', function() {
	return function(p_input, p_units, p_labels, p_separator, p_keepZeros) {
		if(!Array.isArray(p_units)) {
			throw new Error('Invalid [units] parameter');
		} else if(!Array.isArray(p_labels)) {
			throw new Error('Invalid [labels] parameter');
		} else if(p_units.length != p_labels.length) {
			throw new Error('Units and labels array lengths must match');
		} else if(p_units.length == 0) {
			throw new Error('Not enough units');
		}

		p_input = p_input || 0;
		p_separator = p_separator || ' ';
		p_keepZeros = p_keepZeros || false;

		p_input = parseInt(p_input / p_units[0]);
		if(p_input == 0) {
			return p_input + p_labels[0];
		}

		var parts = [];
		p_units.slice(1).forEach(function(p_unit) {
			parts.push(p_input % p_unit);
			p_input = parseInt(p_input / p_unit);
		});

		parts.push(p_input);

		var strings = [];
		parts.forEach(function(p_part, p_index) {
			if(p_part > 0 || p_keepZeros) {
				strings.unshift(p_part + p_labels[p_index]);
			}
		});

		return strings.join(p_separator);
	};
});