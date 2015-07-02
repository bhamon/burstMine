/*
	Burst mine
	Distributed graphical plotter and miner for Burst.
	Author: Cryo
	Bitcoin: 138gMBhCrNkbaiTCmUhP9HLU9xwn5QKZgD
	Burst: BURST-YA29-QCEW-QXC3-BKXDL
*/

module.exports = function(p_name, p_object) {
	return function(p_request, p_response, p_next) {
		p_request[p_name] = p_object;
		return p_next();
	};
};