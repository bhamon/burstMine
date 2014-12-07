var lib = {
	node:{
		path:require('path')
	}
};

module.exports = {
	cacheSize:1000,
	cacheMaxObjSize:1024,
	path:lib.node.path.resolve(__dirname, '../db')
};