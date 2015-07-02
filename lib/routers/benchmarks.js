/*
	Burst mine
	Distributed graphical plotter and miner for Burst.
	Author: Cryo
	Bitcoin: 138gMBhCrNkbaiTCmUhP9HLU9xwn5QKZgD
	Burst: BURST-YA29-QCEW-QXC3-BKXDL
*/

var lib = {
	deps:{
		q:require('q'),
		joi:require('joi'),
		express:require('express')
	},
	ErrorRest:require('../ErrorRest'),
	util:{
		db:require('../util/db')
	}
};

module.exports.init = function(p_api) {
	var router = lib.deps.express.Router({caseSensitive:true});
	router.get('/generation', module.exports.generation.view);
	router.put('/generation', module.exports.generation.start);
	router.delete('/generation', module.exports.generation.stop);

	p_api.use('/benchmarks', router);
};

module.exports.generation = {};

module.exports.generation.view = function(p_request, p_response, p_next) {
	var benchmark = p_request.context.benchmarks.generation;
	if(!benchmark) {
		throw new lib.ErrorRest(404, 'benchmark.notFound', 'Benchmark not found');
	}

	return p_request.send({
		//TODO
		// creationDate:
		// modificationDate:
		// log:
	});
};

module.exports.generation.start = function(p_request, p_response, p_next) {
};

module.exports.generation.stop = function(p_request, p_response, p_next) {
};