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
		express:require('express')
	}
};

module.exports.loadRouters = function(p_path) {
	return lib.deps.q.nfcall(lib.node.fs.readdir, p_path)
	.then(function(p_files) {
		var api = lib.deps.express.Router({caseSensitive:true});
		p_files.forEach(function(p_file) {
			var router = require(lib.node.path.join(p_path, p_file));
			router.init(api);
		});

		return api;
	});
};