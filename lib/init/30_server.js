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
		http:require('http')
	},
	deps:{
		q:require('q'),
		express:require('express'),
		bodyParser:require('body-parser'),
		cors:require('cors')
	},
	ErrorHttp:require('../ErrorHttp'),
	ErrorRest:require('../ErrorRest'),
	util:{
		server:require('../util/server')
	},
	middlewares:{
		attach:require('../middlewares/attach'),
		validator:require('../middlewares/validator')
	}
};

var ROUTERS_PATH = lib.node.path.resolve(__dirname, '../routers');
var PUBLIC_PATH = lib.node.path.resolve(__dirname, '../public');

module.exports.init = function(p_context) {
	p_context.config.server = require('../../config/server');

	var app = lib.deps.express();
	app.enable('case sensitive routing');
	app.use(lib.deps.bodyParser.json());
	app.use(lib.deps.cors());
	app.use(lib.middlewares.attach('context', p_context));
	app.use(lib.middlewares.validator);

	var public = lib.deps.express.Router({caseSensitive:true});
	public.use(lib.deps.express.static(PUBLIC_PATH));

	return lib.util.server.loadRouters(ROUTERS_PATH)
	.then(function(p_api) {
		app.use(p_context.config.server.apiPath, p_api);
		app.use(p_context.config.server.apiPath, function(p_request, p_response, p_next) {
			return p_next(new lib.ErrorRest(404, 'api.notFound', 'API not found'));
		});

		app.use(p_context.config.server.publicPath, public);
		app.use(p_context.config.server.publicPath, function(p_request, p_response, p_next) {
			return p_next(new lib.ErrorHttp(404, 'Not found'));
		});

		app.use('/', function(p_request, p_response, p_next) {
			p_response.sendFile(lib.node.path.join(PUBLIC_PATH, 'index.html'));
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

		var defer = lib.deps.q.defer();

		p_context.server = lib.node.http.createServer(app);
		p_context.server.app = app;
		p_context.server.api = p_api;
		p_context.server.public = public;
		p_context.server.on('error', defer.reject.bind(defer));
		p_context.server.on('listening', defer.resolve.bind(defer));

		p_context.server.sockets = {};
		p_context.server.on('connection', function(p_socket) {
			var key = p_socket.remoteAddress + ':' + p_socket.remotePort;
			p_context.server.sockets[key] = p_socket;

			p_socket.on('close', function() {
				delete p_context.server.sockets[key];
			});
		});

		p_context.server.listen(p_context.config.server.port, p_context.config.server.host);

		return defer.promise;
	})
	.then(function() {
		p_context.log.info('Server bound to %s:%d', p_context.config.server.host, p_context.config.server.port);
	});
};

module.exports.cleanup = function(p_context) {
	if(p_context.server) {
		p_context.log.info('Shutting down server...');

		var defer = lib.deps.q.defer();
		p_context.server.close(function() {
			defer.resolve();
		});

		for(var key in p_context.server.sockets) {
			p_context.server.sockets[key].destroy();
		}

		return defer.promise;
	}
};