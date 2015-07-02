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
	ErrorRest:require('./ErrorRest')
};

var Plots = function Plots(p_dbPlots) {
	Object.defineProperty(this, 'id', {enumerable:true, value:p_dbPlots._id.toString()});
	Object.defineProperty(this, 'plugin', {enumerable:true, value:p_dbPlots.plugin});
	Object.defineProperty(this, 'type', {enumerable:true, value:p_dbPlots.type});
	Object.defineProperty(this, 'status', {enumerable:true, writable:true, value:p_dbPlots.status});
	Object.defineProperty(this, 'address', {enumerable:true, value:p_dbPlots.address});
	Object.defineProperty(this, 'offset', {enumerable:true, value:p_dbPlots.offset});
	Object.defineProperty(this, 'number', {enumerable:true, value:p_dbPlots.number});
	Object.defineProperty(this, 'params', {enumerable:true, writable:true, value:p_dbPlots.params});

	if(p_dbPlots.generation !== undefined && p_dbPlots.progress !== undefined) {
		Object.defineProperty(this, 'generation', {enumerable:true, value:p_dbPlots.generation});
		Object.defineProperty(this, 'progress', {enumerable:true, writable:true, value:p_dbPlots.progress});
	}
};

// TODO: handle status graph properly
// pending -> generating -> generated
//    ^-----------+
Plots.prototype.setStatus = function(p_context, p_status) {
	var result = lib.deps.joi.validate(p_status, lib.deps.joi.valid(['pending', 'generating', 'generated']), {
		abortEarly:false,
		presence:'required'
	});

	if(result.error) {
		return lib.deps.q.reject(new lib.ErrorRest(409, 'validation', 'Validation error', result.error.details));
	}

	var self = this;
	var modificationDate = new Date();
	return lib.deps.q.ninvoke(p_context.db, 'collection', 'plots')
	.then(function(p_dbCollectionPlots) {
		return lib.deps.q.ninvoke(p_dbCollectionPlots, 'update', {
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

Plots.prototype.incrementProgress = function(p_context, p_number) {
	var result = lib.deps.joi.validate(p_number, lib.deps.joi.number().min(1), {
		abortEarly:false,
		presence:'required'
	});

	if(result.error) {
		return lib.deps.q.reject(new lib.ErrorRest(409, 'validation', 'Validation error', result.error.details));
	}

	var self = this;
	var modificationDate = new Date();
	return lib.deps.q.ninvoke(p_context.db, 'collection', 'plots')
	.then(function(p_dbCollectionPlots) {
		return lib.deps.q.ninvoke(p_dbCollectionPlots, 'update', {
			_id:new p_context.db.ObjectID(self.id)
		}, {
			$set:{modificationDate:modificationDate},
			$inc:{progress:result.value}
		});
	})
	.then(function() {
		self.modificationDate = modificationDate;
		self.progress += result.value;
	});
};

module.exports = Plots;