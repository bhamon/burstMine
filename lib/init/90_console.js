var lib = {
	node:{
		util:require('util'),
		repl:require('repl')
	},
	q:require('q')
};

module.exports.init = function(p_promise, p_context) {
	return p_promise
	.then(function() {
		var defer = lib.q.defer();

		console.log(p_context.config.info.name + ' v' + p_context.config.info.version);
		console.log('----');

		var repl = lib.node.repl.start({
			prompt:'> ',
			input:process.stdin,
			output:process.stdout
		});

		repl.context.context = p_context;

		repl.on('exit', function() {
			console.log('----');
			console.log('Bye!');
			defer.resolve(p_context);
		});

		return defer.promise;
	});
};