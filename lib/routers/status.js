/*
	Burst mine
	Distributed graphical plotter and miner for Burst.
	Author: Cryo
	Bitcoin: 138gMBhCrNkbaiTCmUhP9HLU9xwn5QKZgD
	Burst: BURST-YA29-QCEW-QXC3-BKXDL
*/

module.exports.init = function(p_api) {
	p_api.get('/status', module.exports.status);
};

module.exports.status = function(p_request, p_response, p_next) {
	p_response.send({
		version:p_request.context.config.info.version
	});
};