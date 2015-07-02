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

var context = {
	config:{}
};

var INIT_PATH = lib.node.path.join(__dirname, 'init');

lib.deps.q.nfcall(lib.node.fs.readdir, INIT_PATH)
.fail(function(p_error) {
	console.log('[ERROR] Unable to retrieve init handlers');
	console.log(p_error.stack);
})
.then(function(p_files) {
	var handlers = [];
	var promise = p_files.reduce(function(p_promise, p_file) {
		return p_promise.then(function() {
			var handler = require(lib.node.path.join(INIT_PATH, p_file));
			handlers.push(handler);
			return handler.init(context);
		});
	}, lib.deps.q.when());

	return promise
	.then(function() {
		var defer = lib.deps.q.defer();

		context.log.info('Press CTRL+C or send SIGINT to the process to exit');
		process.once('SIGINT', function() {
			context.log.info('Exiting...');
			context.log.info('Press CTRL+C or send SIGINT to the process again to force exit');
			defer.resolve();
		});

		process.once('uncaughtException', function(p_error) {
			defer.reject(p_error);
		});

		return defer.promise;
	})
	.fail(function(p_error) {
		if(context.log) {
			context.log.error({err:p_error}, 'Exception caught by the init chain');
		} else {
			console.log('[ERROR] Exception caught by the init chain');
			console.log(p_error.stack);
		}
	})
	.then(function() {
		return handlers.reverse().reduce(function(p_promise, p_handler) {
			if(!p_handler.cleanup) {
				return p_promise;
			}

			return p_promise
			.then(function() {
				return p_handler.cleanup(context);
			})
			.fail(function(p_error) {
				if(context.log) {
					context.log.error({err:p_error}, 'Exception caught by the cleanup chain');
				} else {
					console.log('[ERROR] Exception caught by the cleanup chain');
					console.log(p_error.stack);
				}
			});
		}, lib.deps.q.when());
	});
})
.done();