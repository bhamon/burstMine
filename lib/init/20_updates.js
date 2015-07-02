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
		semver:require('semver')
	}
};

var UPDATES_PATH = lib.node.path.resolve(__dirname, '../updates');

module.exports.init = function(p_context) {
	return lib.deps.q.ninvoke(p_context.db, 'collection', 'setting')
	.then(function(p_dbCollectionSetting) {
		return lib.deps.q.ninvoke(p_dbCollectionSetting, 'findOne', {
			key:'version'
		})
		.then(function(p_dbVersion) {
			if(!p_dbVersion) {
				p_dbVersion = {
					key:'version',
					value:'0.0.0'
				};

				return lib.deps.q.ninvoke(p_dbCollectionSetting, 'insert', p_dbVersion)
				.then(function() {
					return p_dbVersion;
				});
			}

			return p_dbVersion;
		})
		.then(function(p_dbVersion) {
			return lib.deps.q.nfcall(lib.node.fs.readdir, UPDATES_PATH)
			.then(function(p_files) {
				return p_files
				.map(function(p_file) {
					var ext = lib.node.path.extname(p_file);
					return lib.node.path.basename(p_file, ext);
				})
				.filter(function(p_version) {
					return lib.deps.semver.gt(p_version, p_dbVersion.value);
				})
				.sort(function(p_first, p_second) {
					return lib.deps.semver.lt(p_first, p_second) ? -1 : 1;
				})
				.reduce(function(p_promise, p_version) {
					return p_promise
					.then(function() {
						p_context.log.info('Updating database to version [%s]...', p_version);

						var update = require(lib.node.path.join(UPDATES_PATH, p_version));
						return lib.deps.q.when(update.process(p_context))
						.then(function() {
							return lib.deps.q.ninvoke(p_dbCollectionSetting, 'update', {
								key:'version'
							}, {
								$set:{value:p_version}
							})
						});
					});
				}, lib.deps.q.when());
			});
		});
	});
};