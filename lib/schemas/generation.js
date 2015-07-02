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
	generation {
		plugin:'',
		type:'',
		status:'success',
		creationDate:new Date(),
		modificationDate:new Date(),
		params:{},
		log:[]
	}
*/

module.exports.init = function(p_db) {
	return lib.deps.q.ninvoke(p_db, 'collection', 'generation')
	.then(function(p_dbCollectionGeneration) {
		return lib.deps.q.all([
			lib.deps.q.ninvoke(p_dbCollectionGeneration, 'ensureIndex', {status:1}),
			lib.deps.q.ninvoke(p_dbCollectionGeneration, 'ensureIndex', {plugin:1, type:1})
		]);
	});
};