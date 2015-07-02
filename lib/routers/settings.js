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
	util:{
		db:require('../util/db')
	}
};

module.exports.init = function(p_api) {
	var router = lib.deps.express.Router({caseSensitive:true});
	router.get('/', module.exports.view);
	router.post('/', module.exports.modify);

	p_api.use('/settings', router);
};

module.exports.view = function(p_request, p_response, p_next) {
	lib.deps.q.ninvoke(p_request.context.db, 'collection', 'setting')
	.then(function(p_dbCollectionSetting) {
		var cursor = p_dbCollectionSetting.find({
			key:{$in:['pluginsRepository', 'smtpHost', 'smtpPort', 'senderEmail']}
		});

		var settings = {};
		return lib.util.db.each(cursor)
		.progress(function(p_dbSetting) {
			settings[p_dbSetting.key] = p_dbSetting.value;
		})
		.then(function() {
			return p_response.send(settings);
		});
	})
	.fail(function(p_error) {
		return p_next(p_error);
	});
};

module.exports.modify = function(p_request, p_response, p_next) {
	p_request.validate({
		body:{
			pluginsRepository:lib.deps.joi.string().optional().string().min(1).max(100),
			smtpHost:lib.deps.joi.string().optional().min(1).max(100).hostname(),
			smtpPort:lib.deps.joi.number().optional().integer().min(1).max(65535),
			senderEmail:lib.deps.joi.string().optional().min(1).max(100).email()
		}
	});

	var settings = [];
	if(p_request.body.pluginsRepository) { settings.push({key:'pluginsRepository', value:p_request.body.pluginsRepository}); }
	if(p_request.body.smtpHost) { settings.push({key:'smtpHost', value:p_request.body.smtpHost}); }
	if(p_request.body.smtpPort) { settings.push({key:'smtpPort', value:p_request.body.smtpPort}); }
	if(p_request.body.senderEmail) { settings.push({key:'senderEmail', value:p_request.body.senderEmail}); }
	if(settings.length == 0) {
		return p_response.status(200).end();
	}

	lib.deps.q.ninvoke(p_request.context.db, 'collection', 'setting')
	.then(function(p_dbCollectionSetting) {
		var promises = [];
		for(var i = 0 ; i < settings.length ; ++i) {
			var setting = settings[i];
			promises.push(lib.deps.q.ninvoke(
				p_dbCollectionSetting,
				'update',
				{key:setting.key},
				{
					$set:{value:setting.value}
				}
			));
		}

		return lib.deps.q.all(promises);
	})
	.then(function() {
		return p_response.status(200).end();
	})
	.fail(function(p_error) {
		return p_next(p_error);
	});
};