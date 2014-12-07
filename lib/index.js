var lib = {
	node:{
		path:require('path'),
		fs:require('fs')
	},
	q:require('q')
};

var context = {
	config:{}
};

lib.q.nfcall(lib.node.fs.readdir, lib.node.path.join(__dirname, 'init'))
.then(function(p_files) {
	var handlers = [];
	var promise = lib.q.when(context);
	for(var i = 0 ; i < p_files.length ; ++i) {
		var handler = require(lib.node.path.join(__dirname, 'init', p_files[i]));
		handlers.push(handler);
		promise = handler.init(promise, context);
	}

	promise = promise.fail(function(p_error) {
		if(context.log) {
			context.log.error({err:p_error}, 'Exception caught by the init chain');
		} else {
			console.log('[ERROR] Exception caught by the init chain');
			console.log(p_error.stack);
		}
	});

	for(var i = handlers.length - 1 ; i >= 0 ; --i) {
		var handler = handlers[i];
		if(handler.cleanup) {
			promise = handler.cleanup(promise, context);
			promise = promise.fail(function(p_error) {
				if(context.log) {
					context.log.error({err:p_error}, 'Exception caught by the cleanup chain');
				} else {
					console.log('[ERROR] Exception caught by the cleanup chain');
					console.log(p_error.stack);
				}
			});
		}
	}
})
.fail(function(p_error) {
	console.log('[ERROR] Unable to retrieve init handlers');
	console.log(p_error.stack);
});