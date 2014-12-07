var lib = {
	node:{
		path:require('path'),
		fs:require('fs'),
		http:require('http')
	},
	q:require('q'),
	express:require('express'),
	bodyParser:require('body-parser'),
	cors:require('cors'),
	expressValidator:require('express-validator'),
	burstMine:{
		ErrorHttp:require('../ErrorHttp'),
		ErrorRest:require('../ErrorRest'),
		middlewares:{
			attach:require('../middlewares/attach'),
			validator:require('../middlewares/validator')
		}
	}
};

module.exports.ROUTERS_PATH = lib.node.path.resolve(__dirname, '../routers');
module.exports.COMMON_PATH = lib.node.path.resolve(__dirname, '../common');
module.exports.PUBLIC_PATH = lib.node.path.resolve(__dirname, '../public');

module.exports.init = function(p_promise, p_context) {
	return p_promise
	.then(function() {
		p_context.config.server = require('../../config/server');

		return lib.q.nfcall(lib.node.fs.readdir, module.exports.ROUTERS_PATH);
	})
	.then(function(p_files) {
		var app = lib.express();
		app.enable('case sensitive routing');
		app.use(lib.bodyParser.json());
		app.use(lib.cors());
		app.use(lib.expressValidator());
		app.use(lib.burstMine.middlewares.attach('context', p_context));
		app.use(lib.burstMine.middlewares.validator);

		app.options('*');

		for(var i = 0 ; i < p_files.length ; ++i) {
			var router = require(lib.node.path.join(module.exports.ROUTERS_PATH, p_files[i]));
			router.init(app);
		}

		app.use('/common', lib.express.static(module.exports.COMMON_PATH));
		app.use(lib.express.static(module.exports.PUBLIC_PATH));

		app.use(function(p_request, p_response, p_next) {
			p_response.sendFile(lib.node.path.join(module.exports.PUBLIC_PATH, 'index.html'));
		});

		app.use(function(p_error, p_request, p_response, p_next) {
			switch(p_error.name) {
				case 'ErrorRest':
					p_response.status(p_error.statusCode);
					p_response.send({
						type:p_error.type,
						message:p_error.message,
						details:p_error.details
					});
				break;
				case 'ErrorHttp':
					p_response.status(p_error.statusCode);
					p_response.send({
						type:'raw',
						message:p_error.message
					});
				break;
				default:
					p_context.log.error(p_error);

					p_response.status(500);
					p_response.send({
						type:'internal',
						message:p_error.message
					});
			}
		});

		var defer = lib.q.defer();

		p_context.server = lib.node.http.createServer(app);
		p_context.server.on('error', defer.reject.bind(defer));
		p_context.server.on('listening', defer.resolve.bind(defer));
		p_context.server.listen(p_context.config.server.port, p_context.config.server.host);

		return defer.promise;
	})
	.then(function() {
		p_context.log.info('Server bound to %s:%d', p_context.config.server.host, p_context.config.server.port);
	});
};

module.exports.cleanup = function(p_promise, p_context) {
	return p_promise
	.then(function() {
		if(p_context.server) {
			p_context.server.close();
		}
	});
};