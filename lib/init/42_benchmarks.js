/*
	Burst mine
	Distributed graphical plotter and miner for Burst.
	Author: Cryo
	Bitcoin: 138gMBhCrNkbaiTCmUhP9HLU9xwn5QKZgD
	Burst: BURST-YA29-QCEW-QXC3-BKXDL
*/

module.exports.init = function(p_context) {
	p_context.benchmarks = {
		generator:null
	};
};

module.exports.cleanup = function(p_context) {
	if(!p_context.benchmarks) {
		return;
	}

	if(p_context.benchmarks.generation) {
		clearTimeout(p_context.benchmarks.generation);
		p_context.benchmarks.generation.run = false;
	}
};