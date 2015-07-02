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
		q:require('q')
	}
};

module.exports.loadSchemas = function(p_db, p_path) {
	return lib.deps.q.nfcall(lib.node.fs.readdir, p_path)
	.then(function(p_files) {
		return lib.deps.q.all(p_files.map(function(p_file) {
			var schema = require(lib.node.path.join(p_path, p_file));
			return schema.init(p_db);
		}));
	});
};

module.exports.each = function(p_cursor) {
	var defer = lib.deps.q.defer();

	p_cursor.each(function(p_error, p_document) {
		if(p_error) {
			defer.reject();
		} else if(p_document === null) {
			defer.resolve();
		} else {
			defer.notify(p_document);
		}
	});

	return defer.promise;
};