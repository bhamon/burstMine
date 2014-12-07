var lib = {
	node:{
		util:require('util')
	},
	burstMine:{
		ErrorHttp:require('./ErrorHttp')
	}
};

var ErrorRest = function ErrorRest(p_statusCode, p_type, p_message, p_details) {
	lib.burstMine.ErrorHttp.call(this, p_statusCode, p_message);

	this.type = p_type;
	this.details = p_details;
};

lib.node.util.inherits(ErrorRest, lib.burstMine.ErrorHttp);

module.exports = ErrorRest;