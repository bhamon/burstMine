var lib = {
	q:require('q')
};

/*
	mine {
		name:'mine 1',
		url:'http://localhost:8000/api'
	}
*/

module.exports.init = function(p_promise, p_db) {
	return p_promise
	.then(function() {
		return lib.q.ninvoke(p_db, 'collection', 'mine');
	});
};