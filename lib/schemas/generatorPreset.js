/*
	Burst mine
	Distributed graphical plotter and miner for Burst.
	Author: Cryo
	Bitcoin: 138gMBhCrNkbaiTCmUhP9HLU9xwn5QKZgD
	Burst: BURST-YA29-QCEW-QXC3-BKXDL
*/

var lib = {
	deps:{
		q:require('q')
	}
};

/*
	generatorPreset {
		plugin:'',
		type:'',
		name:'',
		description:'',
		params:{}
	}
*/

module.exports.init = function(p_db) {
	return lib.deps.q.ninvoke(p_db, 'collection', 'generatorPreset')
	.then(function(p_dbCollectionGeneratorPreset) {
		return lib.deps.q.ninvoke(p_dbCollectionGeneratorPreset, 'ensureIndex', {plugin:1, type:1});
	});
};