/*
	Burst mine
	Distributed graphical plotter and miner for Burst.
	Author: Cryo
	Bitcoin: 138gMBhCrNkbaiTCmUhP9HLU9xwn5QKZgD
	Burst: BURST-YA29-QCEW-QXC3-BKXDL
*/

var lib = {
	node:{
		path:require('path')
	}
};

module.exports.cacheSize = 1000;
module.exports.cacheMaxObjSize = 1024;
module.exports.path = lib.node.path.resolve(__dirname, '..', 'db');