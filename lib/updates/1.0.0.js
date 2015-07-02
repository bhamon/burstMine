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
	}
};

module.exports.process = function(p_context) {
	return lib.deps.q.ninvoke(p_context.db, 'collection', 'setting')
	.then(function(p_dbCollectionSetting) {
		return lib.deps.q.ninvoke(p_dbCollectionSetting, 'insert', [
			{
				key:'pluginsRepository',
				value:'http://localhost/plugins'
			}, {
				key:'smtpHost',
				value:'localhost'
			}, {
				key:'smtpPort',
				value:25
			}, {
				key:'senderEmail',
				value:'sender@domain.com'
			}
		]);
	});
};