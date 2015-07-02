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
	router.post('/', module.exports.import);
	router.delete('/:id', module.exports.remove);

	p_api.use('/plots', router);
};

module.exports.list = function(p_request, p_response, p_next) {
	lib.deps.q.ninvoke(p_request.context.db, 'collection', 'plots')
	.then(function(p_dbCollectionPlots) {
		var plots = [];
		return lib.util.db.each(p_dbCollectionPlots.find({}))
		.progress(function(p_dbPlots) {
			plots.push({
				id:p_dbPlots._id.toString(),
				plugin:p_dbPlots.plugin,
				type:p_dbPlots.type,
				address:p_dbPlots.address,
				offset:p_dbPlots.offset,
				number:p_dbPlots.number,
				status:p_dbPlots.status
			});
		})
		.then(function() {
			p_response.send(plots);
		});
	})
	.fail(function(p_error) {
		return p_next(p_error);
	});
};

module.exports.import = function(p_request, p_response, p_next) {
throw new lib.ErrorRest(500, 'api.notImplemented', 'Not implemented yet');
/*
	p_request.validate({
		body:{
			path:lib.deps.joi.string().min(1).max(100),
			address:lib.deps.joi.number().integer().min(0),
			offset:lib.deps.joi.number().integer().min(0),
			nonces:lib.deps.joi.number().integer().min(0),
			staggerSize:lib.deps.joi.number().integer().min(0)
		}
	});

	var parts = [p_request.body.address, p_request.body.offset, p_request.body.nonces, p_request.body.staggerSize];
	var fullPath = lib.node.path.resolve(p_request.body.path, parts.join('_'));
	var plotsFile = {
		path:lib.node.path.dirname(fullPath),
		address:p_request.body.address,
		offset:p_request.body.offset,
		nonces:p_request.body.nonces,
		staggerSize:p_request.body.staggerSize,
		status:'generated'
	};

	if(plotsFile.nonces % plotsFile.staggerSize) {
		throw new lib.ErrorRest(409, 'plotsFile.invalidNonces', 'Nonces number must be a multiple of staggerSize');
	}

	lib.deps.q.nfcall(lib.node.fs.stat, fullPath)
	.fail(function(p_error) {
		throw new lib.ErrorRest(404, 'plotsFile.notFound', 'Plots file not found', p_error);
	})
	.then(function(p_stat) {
		var expected = plotsFile.nonces * 4096 * 64;
		if(p_stat.size != expected) {
			throw new lib.ErrorRest(409, 'plotsFile.invalidSize', 'Invalid plots file size');
		}

		return lib.deps.q.ninvoke(p_request.context.db, 'collection', 'plotsFile')
	})
	.then(function(p_dbCollectionPlots) {
		return lib.deps.q.ninvoke(p_dbCollectionPlots, 'insert', plotsFile)
		.then(function(p_dbPlotsFiles) {
			var dbPlotsFile = p_dbPlotsFiles[0];
			p_response.send({
				id:dbPlotsFile._id.toString()
			});
		});
	})
	.fail(function(p_error) {
		return p_next(p_error);
	});
*/
};

module.exports.remove = function(p_request, p_response, p_next) {
	p_request.validate({
		params:{
			id:lib.deps.joi.string().regex(/^[a-z0-9]{1,100}$/)
		}
	});

	lib.deps.q.ninvoke(p_request.context.db, 'collection', 'plots')
	.then(function(p_dbCollectionPlots) {
		return lib.deps.q.ninvoke(p_dbCollectionPlots, 'findOne', {
			_id:new p_request.context.db.ObjectID(p_request.params.id)
		})
		.then(function(p_dbPlots) {
			if(!p_dbPlots) {
				throw new lib.reminder.ErrorRest(404, 'plots.notFound', 'Plots not found');
			}

			return lib.deps.q.ninvoke(p_dbCollectionPlots, 'remove', {
				_id:p_dbPlots._id
			});
// TODO: delegate removal to plugin
/*
			var parts = [p_dbPlots.address, p_dbPlots.offset, p_dbPlots.nonces, p_dbPlots.staggerSize];
			var fullPath = lib.node.path.join(p_dbPlots.path, parts.join('_'));
			return lib.deps.q.nfcall(lib.node.fs.unlink, fullPath)
			.fail(function(p_error) {
				p_request.context.log.warn({err:p_error}, 'Unable to remove the plots file');
			})
			.then(function() {
				return lib.deps.q.ninvoke(p_dbCollectionPlots, 'remove', {
					_id:p_dbPlots._id
				});
			});
*/
		});
	})
	.then(function() {
		p_response.status(200).end();
	})
	.fail(function(p_error) {
		return p_next(p_error);
	});
};