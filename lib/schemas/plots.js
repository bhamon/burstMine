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
	plots {
		plugin:'',
		type:'',
		status:'generated',
		address:123456,
		offset:0,
		number:2000,
		params:{}
	}
*/

module.exports.init = function(p_db) {
	return lib.deps.q.ninvoke(p_db, 'collection', 'plots')
	.then(function(p_dbCollectionPlots) {
		return lib.deps.q.all([
			lib.deps.q.ninvoke(p_dbCollectionPlots, 'ensureIndex', {status:1}),
			lib.deps.q.ninvoke(p_dbCollectionPlots, 'ensureIndex', {plugin:1, type:1})
		]);
	});
};