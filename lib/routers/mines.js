var lib = {
	node:{
		path:require('path'),
		fs:require('fs')
	},
	q:require('q'),
	express:require('express'),
	burstMine:{
		ErrorRest:require('../ErrorRest')
	}
};

module.exports.init = function(p_app) {
	var router = lib.express.Router({
		caseSensitive:true
	});

	router.get('/', module.exports.list);
	router.post('/', module.exports.add);
	router.get('/:id', module.exports.view);
	router.delete('/:id', module.exports.remove);

	p_app.use('/api/mines', router);
};

module.exports.list = function(p_request, p_response, p_next) {
	lib.q.ninvoke(p_request.context.db, 'collection', 'mine')
	.then(function(p_collection) {
		return lib.q.ninvoke(p_collection.find({}), 'toArray');
	})
	.then(function(p_mines) {
		var mines = [];
		for(var i = 0 ; i < p_mines.length ; ++i) {
			var mine = p_mines[i];
			mines.push({
				id:mine._id.toString(),
				name:mine.name,
				url:mine.url
			});
		}

		p_response.send(mines);
	})
	.done();
};

module.exports.add = function(p_request, p_response, p_next) {
	p_request.checkBody('name').matches(/[A-Za-z0-9_ -]{4,50}/);
	p_request.checkBody('url').isURL();
	p_request.checkValidation();

	lib.q.ninvoke(p_request.context.db, 'collection', 'mine')
	.then(function(p_collection) {
		return lib.q.ninvoke(p_collection, 'insert', {
			name:p_request.body.name,
			url:p_request.body.url
		});
	})
	.then(function(p_mines) {
		var mine = p_mines[0];
		p_response.send({
			id:mine._id.toString()
		});
	})
	.done();
};

module.exports.view = function(p_request, p_response, p_next) {
	p_request.checkParams('id').isHexadecimal();
	p_request.checkValidation();

	lib.q.ninvoke(p_request.context.db, 'collection', 'mine')
	.then(function(p_collection) {
		return lib.q.ninvoke(p_collection, 'findOne', {
			_id:new p_request.context.tingoDb.ObjectID(p_request.params.id)
		});
	})
	.then(function(p_mine) {
		if(!p_mine) {
			throw new lib.burstMine.ErrorRest(404, 'endpoint.notFound', 'Endpoint not found');
		}

		p_response.send({
			id:p_mine._id.toString(),
			name:p_mine.name,
			url:p_mine.url
		});
	})
	.done();
};

module.exports.remove = function(p_request, p_response, p_next) {
	p_request.checkParams('id').isHexadecimal();
	p_request.checkValidation();

	lib.q.ninvoke(p_request.context.db, 'collection', 'mine')
	.then(function(p_collection) {
		return [
			p_collection,
			lib.q.ninvoke(p_collection, 'findOne', {
				_id:new p_request.context.tingoDb.ObjectID(p_request.params.id)
			})
		];
	})
	.spread(function(p_collection, p_mine) {
		if(!p_mine) {
			throw new lib.burstMine.ErrorRest(404, 'mine.notFound', 'Mine not found');
		}

		return lib.q.ninvoke(p_collection, 'remove', {
			_id:new p_request.context.tingoDb.ObjectID(p_request.params.id)
		});
	})
	.then(function() {
		p_response.status(200).end();
	})
	.done();
};