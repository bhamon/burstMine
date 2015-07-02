/*
	Burst mine
	Distributed graphical plotter and miner for Burst.
	Author: Cryo
	Bitcoin: 138gMBhCrNkbaiTCmUhP9HLU9xwn5QKZgD
	Burst: BURST-YA29-QCEW-QXC3-BKXDL
*/

var lib = {
	deps:{
		joi:require('joi'),
		express:require('express')
	}
};

module.exports.init = function(p_api) {
	var router = lib.deps.express.Router({caseSensitive:true});
	router.get('/', module.exports.list);
	router.get('/:type/generators', module.exports.listGenerators);
	router.get('/:type/strategies', module.exports.listStrategies);
	router.get('/:type/plotsWrappers', module.exports.listPlotsWrappers);

	p_api.use('/plugins', router);
};

module.exports.list = function(p_request, p_response, p_next) {
	var plugins = [];
	for(var type in p_request.context.plugins) {
		var plugin = p_request.context.plugins[type];
		plugins.push({
			type:plugin.type,
			description:plugin.description,
			version:plugin.version
		});
	}

	return p_response.send(plugins);
};

var listComponents = function(p_type) {
	return function(p_request, p_response, p_next) {
		p_request.validate({
			params:{
				type:lib.deps.joi.valid(Object.keys(p_request.context.plugins))
			}
		});

		var plugin = p_request.context.plugins[p_request.params.type];
		var pluginComponents = plugin[p_type];
		var components = [];
		for(var componentType in pluginComponents) {
			var component = pluginComponents[componentType];
			components.push({
				type:component.type,
				description:component.description,
				version:component.version
			});
		}

		return p_response.send(components);
	};
};

module.exports.listGenerators = listComponents('generators');
module.exports.listStrategies = listComponents('strategies');
module.exports.listPlotsWrappers = listComponents('plotsWrappers');