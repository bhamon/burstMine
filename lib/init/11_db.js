var lib = {
	node:{
		path:require('path'),
		fs:require('fs')
	},
	q:require('q'),
	tingoDb:require('tingodb')
};

module.exports.SCHEMAS_PATH = lib.node.path.resolve(__dirname, '../schemas');

module.exports.init = function(p_promise, p_context) {
	return p_promise
	.then(function() {
		p_context.config.db = require('../../config/db');

		p_context.tingoDb = lib.tingoDb({
			cacheSize:p_context.config.db.cacheSize,
			cacheMaxObjSize:p_context.config.db.cacheMaxObjectSize
		});

		p_context.db = new p_context.tingoDb.Db(p_context.config.db.path, {w:1});

		return lib.q.ninvoke(p_context.db, 'open');
	})
	.then(function() {
		return lib.q.nfcall(lib.node.fs.readdir, module.exports.SCHEMAS_PATH);
	})
	.then(function(p_files) {
		var promise = lib.q.when();
		for(var i = 0 ; i < p_files.length ; ++i) {
			var schema = require(lib.node.path.join(module.exports.SCHEMAS_PATH, p_files[i]));
			promise = schema.init(promise, p_context.db);
		}

		return promise;
	});
};

module.exports.cleanup = function(p_promise, p_context) {
	return p_promise
	.then(function() {
		if(p_context.db) {
			return lib.q.ninvoke(p_context.db, 'close');
		}
	});
};