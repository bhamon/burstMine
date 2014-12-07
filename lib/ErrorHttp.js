var lib = {
	node:{
		util:require('util')
	}
};

var ErrorHttp = function ErrorHttp(p_statusCode, p_message) {
	Error.call(this, p_message);
	Error.captureStackTrace(this, this.constructor);

	this.name = this.constructor.name;
	this.statusCode = p_statusCode;
	this.message = p_message || '';
};

lib.node.util.inherits(ErrorHttp, Error);

module.exports = ErrorHttp;