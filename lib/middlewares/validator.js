var lib = {
	app:{
		ErrorRest:require('../ErrorRest')
	}
};

module.exports = function(p_request, p_response, p_next) {
	p_request.checkValidation = function() {
		var errors = p_request.validationErrors();
		if(errors) {
			throw new lib.app.ErrorRest(409, 'validation', 'Invalid input parameters', errors);
		}
	};

	return p_next();
};