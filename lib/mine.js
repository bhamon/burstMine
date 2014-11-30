var lib = {
	node:{
		path:require('path')
	},
	express:require('express'),
	burstMine:{
		generators:{
			opencl:require('../build/Release/generator_opencl')
		}
	}
};

try {
/*
	var platforms = lib.burstMine.generators.opencl.listPlatforms();
	for(var i = 0 ; i < platforms.length ; ++i) {
		console.log(platforms[i]);

		var devices = lib.burstMine.generators.opencl.listDevices(i);
		console.log(devices[i]);
	}
*/
	var context = new lib.burstMine.generators.opencl.createContext({
		platform:0,
		device:0,
		globalWorkSize:128,
		localWorkSize:2,
		hashesNumber:8192,
		kernelsPath:lib.node.path.resolve(__dirname, 'kernels')
	});

	console.log(context);

	context.computePlots({
		address:123456,
		offset:0,
		workSize:128
	}, function(p_error) {
		if(p_error) {
			console.log(p_error.stack);
		} else {
			console.log('generated!');
		}

		context.close();
	});
} catch(p_ex) {
	console.log(p_ex);
	console.log(p_ex.stack);
}