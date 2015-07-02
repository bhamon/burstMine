/*
	Burst mine
	Distributed graphical plotter and miner for Burst.
	Author: Cryo
	Bitcoin: 138gMBhCrNkbaiTCmUhP9HLU9xwn5QKZgD
	Burst: BURST-YA29-QCEW-QXC3-BKXDL
*/

var lib = {
	node:{
		util:require('util')
	},
	ErrorHttp:require('./ErrorHttp')
};

var ErrorRest = function ErrorRest(p_statusCode, p_type, p_message, p_details) {
	lib.ErrorHttp.call(this, p_statusCode, p_message);

	this.type = p_type;
	this.details = p_details;
};

lib.node.util.inherits(ErrorRest, lib.ErrorHttp);

module.exports = ErrorRest;