/*
	Burst mine
	Distributed graphical plotter and miner for Burst.
	Author: Cryo
	Bitcoin: 138gMBhCrNkbaiTCmUhP9HLU9xwn5QKZgD
	Burst: BURST-YA29-QCEW-QXC3-BKXDL
*/

var lib = {
	deps:{
		q:require('q')
	},
	util:{
		db:require('../util/db')
	},
	Generation:require('../Generation')
};

var executeGeneration = function(p_context, p_generation) {
	var plugin = p_context.plugins[p_generation.plugin];
	if(!plugin) {
		return p_generation.addLogEntry({
			type:'plugin.notFound',
			message:'Plugin not found'
		})
		.then(function() {
			return p_generation.setStatus('error');
		});
	}

	var strategy = plugin.strategies[p_generation.type];
	if(!strategy) {
		return p_generation.addLogEntry({
			type:'strategy.notFound',
			message:'Strategy not found'
		})
		.then(function() {
			return p_generation.setStatus('error');
		});
	}

	return strategy.create(p_context, p_generation)
	.then(function(p_strategy) {
		return p_strategy.open()
		.then(function() {
			return strategy.generate(p_context, p_generation);
		})
		.finally(function() {
			return p_strategy.close();
		});
	});
};

var generationListThread = function(p_context) {
	return lib.deps.q.ninvoke(p_context.db, 'collection', 'generation')
	.then(function(p_dbCollectionGeneration) {
		return lib.util.db.each(p_dbCollectionGeneration.find({
			status:{$in:['pending', 'paused', 'success', 'error']}
		}))
		.progress(function(p_dbGeneration) {
			var id = p_dbGeneration._id.toString();
			switch(p_dbGeneration.status) {
				case 'pending':
					var generation = new lib.Generation(p_dbGeneration);
					var plugin = p_context.plugins[generation.plugin];
					if(!plugin) {
						return generation.setStatus(p_context, 'error')
						.then(function() {
							return generation.addLogEntry(p_context, {
								level:'error',
								step:'init',
								message:'Plugin not found'
							});
						});
					}

					var strategy = plugin.strategies[generation.type];
					if(!strategy) {
						return generation.setStatus(p_context, 'error')
						.then(function() {
							return generation.addLogEntry(p_context, {
								level:'error',
								step:'init',
								message:'Strategy not found'
							});
						});
					}

					generation.setStatus(p_context, 'generating')
					.then(function() {
						p_context.generations.map[id] = generation;
						process.nextTick(function() {
							strategy.generate(p_context, generation)
							.then(function() {
								return generation.setStatus(p_context, 'success');
							}, function(p_error) {
p_context.log.debug({err:p_error});
								return generation.setStatus(p_context, 'error')
								.then(function() {
									return generation.addLogEntry(p_context, {
										level:'error',
										step:'scheduler',
										message:'Uncaught error while processing the generation task',
										details:{
											error:p_error.stack
										}
									});
								});
							});
						});
					});
				break;
				case 'paused':
					var generation = p_context.generations.map[id];
					if(generation) {
						generation.interrupt();
						delete p_context.generations.map[id];
					}
				break;
				case 'success':
				case 'error':
					var generation = p_context.generations.map[id];
					if(generation) {
						delete p_context.generations.map[id];
					}
				break;
			}
		})
		.then(function() {
			if(p_context.generations.run) {
				p_context.generations.timer = setTimeout(generationListThread, p_context.config.generations.interval, p_context);
			}
		});
	});
};

module.exports.init = function(p_context) {
	p_context.config.generations = require('../../config/generations');
	p_context.generations = {
		run:true,
		timer:null,
		map:{}
	};

	return lib.deps.q.ninvoke(p_context.db, 'collection', 'generation')
	.then(function(p_dbCollectionGeneration) {
		return lib.deps.q.ninvoke(p_dbCollectionGeneration, 'update', {
			status:'generating'
		}, {
			$set:{status:'error'}
		}, {
			multi:true
		});
	})
	.then(function() {
		return generationListThread(p_context);
	});
};

module.exports.cleanup = function(p_context) {
	if(p_context.generations.timer) {
		p_context.log.info('Shutting down generations scheduler...');
		p_context.generations.run = false;
		clearTimeout(p_context.generations.timer);

		p_context.log.info('Interrupting generations...');
		Object.keys(p_context.generations.map).forEach(function(p_id) {
			var generation = p_context.generations.map;
			generation.interrupt();
		});
	}
};