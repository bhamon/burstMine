module.exports = function(p_name, p_object) {
	return function(p_request, p_response, p_next) {
		p_request[p_name] = p_object;
		return p_next();
	};
};