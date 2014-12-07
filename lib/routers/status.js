module.exports.init = function(p_app) {
	p_app.get('/api/status', module.exports.status);
};

module.exports.status = function(p_request, p_response, p_next) {
	p_response.send({
		version:p_request.context.config.info.version
	});
};