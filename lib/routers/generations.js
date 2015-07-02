/*
	Burst mine
	Distributed graphical plotter and miner for Burst.
	Author: Cryo
	Bitcoin: 138gMBhCrNkbaiTCmUhP9HLU9xwn5QKZgD
	Burst: BURST-YA29-QCEW-QXC3-BKXDL
*/

var lib = {
	deps:{
		q:require('q'),
		joi:require('joi'),
		express:require('express')
	},
	ErrorRest:require('../ErrorRest'),
	util:{
		db:require('../util/db')
	}
};

module.exports.init = function(p_api) {
	var router = lib.deps.express.Router({caseSensitive:true});
	router.get('/', module.exports.list);
	router.post('/', module.exports.create);
	router.get('/:id', module.exports.view);
	router.delete('/:id', module.exports.remove);

	p_api.use('/generations', router);
};

module.exports.list = function(p_request, p_response, p_next) {
	lib.deps.q.ninvoke(p_request.context.db, 'collection', 'generation')
	.then(function(p_dbCollectionGeneration) {
		var generations = [];
		return lib.util.db.each(p_dbCollectionGeneration.find({}))
		.progress(function(p_dbGeneration) {
			generations.push({
				id:p_dbGeneration._id.toString(),
				plugin:p_dbGeneration.plugin,
				type:p_dbGeneration.type,
				status:p_dbGeneration.status,
				creationDate:p_dbGeneration.creationDate,
				modificationDate:p_dbGeneration.modificationDate
			});
		})
		.then(function() {
			p_response.send(generations);
		});
	})
	.fail(function(p_error) {
		return p_next(p_error);
	});
};

module.exports.create = function(p_request, p_response, p_next) {
	p_request.validate({
		body:{
			plugin:lib.deps.joi.string().regex(/^[a-zA-Z0-9-]{1,50}$/),
			type:lib.deps.joi.string().regex(/^[a-zA-Z0-9-]{1,50}$/),
			plots:lib.deps.joi.array().min(1).items(lib.deps.joi.object().keys({
				plugin:lib.deps.joi.string().regex(/^[a-zA-Z0-9-]{1,50}$/),
				type:lib.deps.joi.string().regex(/^[a-zA-Z0-9-]{1,50}$/),
				address:lib.deps.joi.number().integer().min(1),
				offset:lib.deps.joi.number().integer().min(0),
				number:lib.deps.joi.number().integer().min(1),
				params:lib.deps.joi.object()
			})),
			params:lib.deps.joi.object()
		}
	});

	var plugin = p_request.context.plugins[p_request.body.plugin];
	if(!plugin) {
		throw new lib.ErrorRest(404, 'plugin.notFound', 'Plugin not found');
	}

	var strategy = plugin.strategies[p_request.body.type];
	if(!strategy) {
		throw new lib.ErrorRest(404, 'plugin.strategy.notFound', 'Plugin strategy not found');
	}

	var generation = {
		plugin:plugin.type,
		type:strategy.type,
		status:'pending',
		creationDate:new Date(),
		modificationDate:new Date(),
		log:[]
	};

	generation.params = strategy.parseParams(generation, p_request.body.params);

	var plots = p_request.body.plots.map(function(p_plots) {
		var plugin = p_request.context.plugins[p_plots.plugin];
		if(!plugin) {
			throw new lib.ErrorRest(404, 'plugin.notFound', 'Plugin not found');
		}

		var plotsWrapper = plugin.plotsWrappers[p_plots.type];
		if(!plotsWrapper) {
			throw new lib.ErrorRest(404, 'plugin.plotsWrapper.notFound', 'Plugin plots wrapper not found');
		}

		var plots = {
			plugin:plugin.type,
			type:plotsWrapper.type,
			status:'generating',
			address:p_plots.address,
			offset:p_plots.offset,
			number:p_plots.number,
			progress:0
		};

		plots.params = plotsWrapper.parseParams(plots, p_plots.params);

		return plots;
	});

	return lib.deps.q.all([
		lib.deps.q.ninvoke(p_request.context.db, 'collection', 'generation'),
		lib.deps.q.ninvoke(p_request.context.db, 'collection', 'plots')
	])
	.spread(function(p_dbCollectionGeneration, p_dbCollectionPlots) {
		return lib.deps.q.ninvoke(p_dbCollectionGeneration, 'insert', generation)
		.then(function(p_dbGenerations) {
			var dbGeneration = p_dbGenerations[0];

			return lib.deps.q.all(plots.map(function(p_plots) {
				p_plots.generation = dbGeneration._id;

				return lib.deps.q.ninvoke(p_dbCollectionPlots, 'insert', p_plots);
			}))
			.then(function() {
				p_response.send({
					id:dbGeneration._id.toString()
				});
			});
		});
	})
	.fail(function(p_error) {
		return p_next(p_error);
	});
};

module.exports.view = function(p_request, p_response, p_next) {
	p_request.validate({
		params:{
			id:lib.deps.joi.string().regex(/^[a-z0-9]{1,100}$/)
		}
	});

	lib.deps.q.ninvoke(p_request.context.db, 'collection', 'generation')
	.then(function(p_dbCollectionGeneration) {
		return lib.deps.q.ninvoke(p_dbCollectionGeneration, 'findOne', {
			_id:new p_request.context.db.ObjectID(p_request.params.id)
		})
		.then(function(p_dbGeneration) {
			if(!p_dbGeneration) {
				throw new lib.reminder.ErrorRest(404, 'generation.notFound', 'Generation not found');
			}

			p_response.send({
				id:p_dbGeneration._id.toString(),
				plugin:p_dbGeneration.plugin,
				type:p_dbGeneration.type,
				status:p_dbGeneration.status,
				creationDate:p_dbGeneration.creationDate,
				modificationDate:p_dbGeneration.modificationDate,
				params:p_dbGeneration.params
			});
		});
	})
	.fail(function(p_error) {
		return p_next(p_error);
	});
};

module.exports.remove = function(p_request, p_response, p_next) {
	p_request.validate({
		params:{
			id:lib.deps.joi.string().regex(/^[a-z0-9]{1,100}$/)
		}
	});

	lib.deps.q.ninvoke(p_request.context.db, 'collection', 'generation')
	.then(function(p_dbCollectionGeneration) {
		return lib.deps.q.ninvoke(p_dbCollectionGeneration, 'findOne', {
			_id:new p_request.context.db.ObjectID(p_request.params.id)
		})
		.then(function(p_dbGeneration) {
			if(!p_dbGeneration) {
				throw new lib.reminder.ErrorRest(404, 'generation.notFound', 'Generation not found');
			}

			var generation = p_request.context.generations[p_dbGeneration._id.toString()];
			if(generation) {
				generation.interrupt();
			}

			return lib.deps.q.ninvoke(p_dbCollectionGeneration, 'remove', {
				_id:p_dbGeneration._id
			});
		});
	})
	.then(function() {
		p_response.status(200).end();
	})
	.fail(function(p_error) {
		return p_next(p_error);
	});
};