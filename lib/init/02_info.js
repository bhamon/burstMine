/*
	Burst mine
	Distributed graphical plotter and miner for Burst.
	Author: Cryo
	Bitcoin: 138gMBhCrNkbaiTCmUhP9HLU9xwn5QKZgD
	Burst: BURST-YA29-QCEW-QXC3-BKXDL
*/

var lib = {
	node:{
		os:require('os'),
		path:require('path'),
		fs:require('fs')
	},
	deps:{
		q:require('q')
	}
};

var PACKAGE_PATH = lib.node.path.resolve(__dirname, '../../package.json');

var getPublicAddress = function() {
	var interfaces = lib.node.os.networkInterfaces();
	for(var name in interfaces) {
		var addresses = interfaces[name];
		for(var i = 0 ; i < addresses.length ; ++i) {
			var address = addresses[i];
			if(!address.internal && address.family == 'IPv4') {
				return address.address;
			}
		}
	}

	throw new Error('No public address found');
};

module.exports.init = function(p_context) {
	return lib.deps.q.nfcall(lib.node.fs.readFile, PACKAGE_PATH)
	.then(function(p_content) {
		var pkg = JSON.parse(p_content);

		p_context.config.info = {};
		p_context.config.info.name = pkg.name;
		p_context.config.info.version = pkg.version;
		p_context.config.info.host = getPublicAddress();

		p_context.log.info(
			'%s v%s (%s)',
			p_context.config.info.name,
			p_context.config.info.version,
			p_context.config.info.host
		);
	});
};