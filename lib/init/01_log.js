/*
	Burst mine
	Distributed graphical plotter and miner for Burst.
	Author: Cryo
	Bitcoin: 138gMBhCrNkbaiTCmUhP9HLU9xwn5QKZgD
	Burst: BURST-YA29-QCEW-QXC3-BKXDL
*/

var lib = {
	deps:{
		bunyan:require('bunyan')
	}
};

module.exports.init = function(p_context) {
	p_context.config.log = require('../../config/log');
	p_context.log = lib.deps.bunyan.createLogger({
		name:p_context.config.log.name,
		serializers:{
			req:lib.deps.bunyan.stdSerializers.req,
			res:lib.deps.bunyan.stdSerializers.res,
			err:lib.deps.bunyan.stdSerializers.err
		},
		streams:p_context.config.log.streams
	});

	p_context.log.on('error', function(p_error, p_stream) {
		console.log('[ERROR] Unable to write to log stream', p_error);
	});
};