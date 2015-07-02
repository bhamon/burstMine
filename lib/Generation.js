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
		joi:require('joi')
	},
	util:{
		db:require('./util/db')
	},
	ErrorRest:require('./ErrorRest'),
	Plots:require('./Plots')
};

var Generation = function Generation(p_dbGeneration) {
	Object.defineProperty(this, '_interrupt', {value:false});
	Object.defineProperty(this, 'id', {enumerable:true, value:p_dbGeneration._id.toString()});
	Object.defineProperty(this, 'plugin', {enumerable:true, value:p_dbGeneration.plugin});
	Object.defineProperty(this, 'type', {enumerable:true, value:p_dbGeneration.type});
	Object.defineProperty(this, 'status', {enumerable:true, writable:true, value:p_dbGeneration.status});
	Object.defineProperty(this, 'creationDate', {enumerable:true, value:p_dbGeneration.creationDate});
	Object.defineProperty(this, 'modificationDate', {enumerable:true, writable:true, value:p_dbGeneration.modificationDate});
	Object.defineProperty(this, 'params', {enumerable:true, value:p_dbGeneration.params});
	Object.defineProperty(this, 'log', {enumerable:true, writable:true, value:p_dbGeneration.log});
};

Generation.prototype.setStatus = function(p_context, p_status) {
	var result = lib.deps.joi.validate(p_status, lib.deps.joi.valid(['pending', 'paused', 'generating', 'success', 'error']), {
		abortEarly:false,
		presence:'required'
	});

	if(result.error) {
		return lib.deps.q.reject(new lib.ErrorRest(409, 'validation', 'Validation error', result.error.details));
	}

	var self = this;
	var modificationDate = new Date();
	return lib.deps.q.ninvoke(p_context.db, 'collection', 'generation')
	.then(function(p_dbCollectionGeneration) {
		return lib.deps.q.ninvoke(p_dbCollectionGeneration, 'update', {
			_id:new p_context.db.ObjectID(self.id)
		}, {
			$set:{
				status:result.value,
				modificationDate:modificationDate
			}
		});
	})
	.then(function() {
		self.status = result.value;
		self.modificationDate = modificationDate;
	});
};

Generation.prototype.addLogEntry = function(p_context, p_entry) {
	var result = lib.deps.joi.validate(p_entry, {
		level:lib.deps.joi.valid(['error', 'warning', 'info', 'debug']),
		step:lib.deps.joi.string().min(1).max(50).regex(/^[a-zA-Z0-9.]+$/),
		message:lib.deps.joi.string().min(1),
		details:lib.deps.joi.object().optional()
	}, {
		abortEarly:false,
		presence:'required'
	});

	if(result.error) {
		return lib.deps.q.reject(new lib.ErrorRest(409, 'validation', 'Validation error', result.error.details));
	}

	var self = this;
	var modificationDate = new Date();
	var log = result.value;
	log.date = modificationDate;

	return lib.deps.q.ninvoke(this.p_context.db, 'collection', 'generation')
	.then(function(p_dbCollectionGeneration) {
		return lib.deps.q.ninvoke(p_dbCollectionGeneration, 'update', {
			_id:new p_context.db.ObjectID(self.id)
		}, {
			$set:{modificationDate:modificationDate},
			$push:{log:log}
		});
	})
	.then(function() {
		self.modificationDate = modificationDate;
		self.log.push(log);
	});
};

Generation.prototype.getPlots = function(p_context) {
	var self = this;
	return lib.deps.q.ninvoke(p_context.db, 'collection', 'plots')
	.then(function(p_dbCollectionPlots) {
		var plots = [];
		return lib.util.db.each(p_dbCollectionPlots.find({
			generation:new p_context.db.ObjectID(self.id)
		}))
		.progress(function(p_dbPlots) {
			plots.push(new lib.Plots(p_dbPlots));
		})
		.then(function() {
			return plots;
		});
	});
};

Generation.prototype.isInterrupted = function() {
	return this._interrupt;
};

Generation.prototype.interrupt = function() {
	this._interrupt = true;
};

module.exports = Generation;