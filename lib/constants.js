/*
	Burst mine
	Distributed graphical plotter and miner for Burst.
	Author: Cryo
	Bitcoin: 138gMBhCrNkbaiTCmUhP9HLU9xwn5QKZgD
	Burst: BURST-YA29-QCEW-QXC3-BKXDL
*/

module.exports.HASH_SIZE = 32;
module.exports.HASHES_PER_SCOOP = 2;
module.exports.SCOOP_SIZE = module.exports.HASHES_PER_SCOOP * module.exports.HASH_SIZE;
module.exports.SCOOPS_PER_PLOT = 4096;
module.exports.PLOT_SIZE = module.exports.SCOOPS_PER_PLOT * module.exports.SCOOP_SIZE;
module.exports.HASH_CAP = 4096;