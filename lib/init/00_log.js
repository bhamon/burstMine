var lib = {
	bunyan:require('bunyan')
};

module.exports.init = function(p_promise, p_context) {
	return p_promise
	.then(function() {
		p_context.config.log = require('../../config/log');
		p_context.log = lib.bunyan.createLogger({
			name:p_context.config.log.name,
			serializers:{
				req:lib.bunyan.stdSerializers.req,
				res:lib.bunyan.stdSerializers.res,
				err:lib.bunyan.stdSerializers.err
			},
			streams:p_context.config.log.streams
		});

		p_context.log.on('error', function(p_error, p_stream) {
			console.log('[ERROR] Unable to write to log stream', p_error);
		});
	});
};