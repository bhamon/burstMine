/*
	Burst mine
	Distributed graphical plotter and miner for Burst.
	Author: Cryo
	Bitcoin: 138gMBhCrNkbaiTCmUhP9HLU9xwn5QKZgD
	Burst: BURST-YA29-QCEW-QXC3-BKXDL
*/

var lib = {
	node:{
		path:require('path'),
		fs:require('fs')
	},
	deps:{
		q:require('q'),
		tingoDb:require('tingodb')
	},
	util:{
		db:require('../util/db')
	}
};

var SCHEMAS_PATH = lib.node.path.resolve(__dirname, '../schemas');

module.exports.init = function(p_context) {
	p_context.config.db = require('../../config/db');

	var tingoDb = lib.deps.tingoDb({
		cacheSize:p_context.config.db.cacheSize,
		cacheMaxObjSize:p_context.config.db.cacheMaxObjectSize
	});

	p_context.db = new tingoDb.Db(p_context.config.db.path, {w:1});
	p_context.db.ObjectID = tingoDb.ObjectID;

	return lib.deps.q.ninvoke(p_context.db, 'open')
	.then(function() {
		return lib.util.db.loadSchemas(p_context.db, SCHEMAS_PATH);
	});
};

module.exports.cleanup = function(p_context) {
	if(p_context.db) {
		p_context.log.info('Closing database...');
		return lib.deps.q.ninvoke(p_context.db, 'close');
	}
};