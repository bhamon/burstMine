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
		express:require('express')
	},
	util:{
		server:require('../util/server')
	}
};

var PLUGINS_PATH = lib.node.path.resolve(__dirname, '../plugins');

var loadComponents = function(p_path) {
	var defer = lib.deps.q.defer();
	var components = [];

	lib.deps.q.nfcall(lib.node.fs.readdir, p_path)
	.invoke('forEach', function(p_file) {
		var component = require(lib.node.path.join(p_path, p_file));
		component.type = lib.node.path.basename(p_file, lib.node.path.extname(p_file));

		defer.notify(component);
		components.push(component);
	})
	.then(function() {
		defer.resolve(components);
	})
	.fail(function(p_error) {
		if(p_error.code == 'ENOENT') {
			defer.resolve([]);
		} else {
			defer.reject(p_error);
		}
	});

	return defer.promise;
};

module.exports.init = function(p_context) {
	p_context.config.plugins = require('../../config/plugins');

	p_context.plugins = {};

	return lib.deps.q.nfcall(lib.node.fs.readdir, PLUGINS_PATH)
	.then(function(p_files) {
		return lib.deps.q.all(p_files.map(function(p_file) {
			var path = lib.node.path.join(PLUGINS_PATH, p_file);
			var plugin = require(path);

			return lib.deps.q.when(plugin.init())
			.then(function() {
				return lib.deps.q.nfcall(lib.node.fs.readFile, lib.node.path.join(path, 'package.json'))
				.then(function(p_content) {
					var pkg = JSON.parse(p_content);
					plugin.type = pkg.name.replace(/^burstMine-plugin-/, '');
					plugin.version = pkg.version;
					plugin.description = pkg.description;

					p_context.log.info('Initializing [%s] plugin', plugin.type);

					return lib.deps.q.all([
						lib.deps.q.all(['generators', 'strategies', 'plotsWrappers'].map(function(p_category) {
							plugin[p_category] = {};
							return loadComponents(lib.node.path.join(path, 'lib', p_category))
							.progress(function(p_component) {
								p_component.plugin = plugin;
								plugin[p_category][p_component.type] = p_component;
							});
						})),
						lib.util.server.loadRouters(lib.node.path.join(path, 'lib', 'routers'))
						.then(function(p_api) {
							p_context.server.api.use(p_context.config.plugins.apiPath + '/' + plugin.type, p_api);
						})
						.fail(function(p_error) {
							if(p_error.code != 'ENOENT') {
								return lib.deps.q.reject(p_error);
							}
						})
						.then(function() {
							p_context.server.public.use(
								p_context.config.plugins.publicPath + '/' + plugin.type,
								lib.deps.express.static(lib.node.path.join(path, 'lib', 'public'))
							);
						})
					]);
				});
			})
			.then(function() {
				p_context.plugins[plugin.type] = plugin;
			});
		}));
	});
};