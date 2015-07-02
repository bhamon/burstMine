/*
	Burst mine
	Distributed graphical plotter and miner for Burst.
	Author: Cryo
	Bitcoin: 138gMBhCrNkbaiTCmUhP9HLU9xwn5QKZgD
	Burst: BURST-YA29-QCEW-QXC3-BKXDL
*/

var lib = {
	deps:{
		joi:require('joi')
	},
	ErrorRest:require('../ErrorRest')
};

var SETS = ['params', 'query', 'body'];

module.exports = function(p_request, p_response, p_next) {
	p_request.validate = function(p_schema) {
		var value = {};
		SETS.forEach(function(p_set) {
			value[p_set] = p_request[p_set];
		});

		var result = lib.deps.joi.validate(value, p_schema, {
			abortEarly:false,
			allowUnknown:true,
			presence:'required'
		});

		if(result.error) {
			throw new lib.ErrorRest(409, 'validation', 'Invalid input parameters', result.error.details);
		}

		SETS.forEach(function(p_set) {
			var value = result.value[p_set];
			var request = p_request[p_set];
			for(var key in value) {
				request[key] = value[key];
			}
		});
	};

	return p_next();
};