module.exports.init = function(p_promise, p_context) {
	return p_promise
	.then(function() {
		p_context.config.info = require('../info');
		p_context.log.info('%s v%s', p_context.config.info.name, p_context.config.info.version);
	});
};