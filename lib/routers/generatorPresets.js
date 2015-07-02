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
	router.delete('/:id', module.exports.remove);

	p_api.use('/generatorPresets', router);
};

module.exports.list = function(p_request, p_response, p_next) {
	lib.deps.q.ninvoke(p_request.context.db, 'collection', 'generatorPreset')
	.then(function(p_dbCollectionGeneratorPreset) {
		var generatorPresets = [];
		return lib.util.db.each(p_dbCollectionGeneratorPreset.find({}))
		.progress(function(p_dbGeneratorPreset) {
			generatorPresets.push({
				id:p_dbGeneratorPreset._id.toString(),
				plugin:p_dbGeneratorPreset.plugin,
				type:p_dbGeneratorPreset.type,
				name:p_dbGeneratorPreset.name,
				description:p_dbGeneratorPreset.description
			});
		})
		.then(function() {
			p_response.send(generatorPresets);
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
			name:lib.deps.joi.string().regex(/^[a-zA-Z0-9 .#-]{1,50}$/),
			description:lib.deps.joi.string().min(1),
			params:lib.deps.joi.object()
		}
	});

	var plugin = p_request.context.plugins[p_request.body.plugin];
	if(!plugin) {
		throw new lib.ErrorRest(404, 'plugin.notFound', 'Plugin not found');
	}

	var generator = plugin.generators[p_request.body.type];
	if(!generator) {
		throw new lib.ErrorRest(404, 'plugin.generator.notFound', 'Plugin generator not found');
	}

	var generatorPreset = {
		plugin:plugin.type,
		type:generator.type,
		name:p_request.body.name,
		description:p_request.body.description
	};

	generatorPreset.params = generator.parseParams(generatorPreset, p_request.body.params);

	return lib.deps.q.ninvoke(p_request.context.db, 'collection', 'generatorPreset')
	.then(function(p_dbCollectionGeneratorPreset) {
		return lib.deps.q.ninvoke(p_dbCollectionGeneratorPreset, 'insert', generatorPreset)
		.then(function(p_dbGeneratorPresets) {
			var dbGeneratorPreset = p_dbGeneratorPresets[0];
			p_response.send({
				id:dbGeneratorPreset._id.toString()
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

	lib.deps.q.ninvoke(p_request.context.db, 'collection', 'generatorPreset')
	.then(function(p_dbCollectionGeneratorPreset) {
		return lib.deps.q.ninvoke(p_dbCollectionGeneratorPreset, 'findOne', {
			_id:new p_request.context.db.ObjectID(p_request.params.id)
		})
		.then(function(p_dbGeneratorPreset) {
			if(!p_dbGeneratorPreset) {
				throw new lib.reminder.ErrorRest(404, 'generatorPreset.notFound', 'Generator preset not found');
			}

			return lib.deps.q.ninvoke(p_dbCollectionGeneratorPreset, 'remove', {
				_id:p_dbGeneratorPreset._id
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