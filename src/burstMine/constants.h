/*
	Burst mine
	Distributed graphical plotter and miner for Burst.
	Author: Cryo
	Bitcoin: 138gMBhCrNkbaiTCmUhP9HLU9xwn5QKZgD
	Burst: BURST-YA29-QCEW-QXC3-BKXDL
*/

#ifndef CRYO_BURST_MINE_CONSTANTS_H
#define CRYO_BURST_MINE_CONSTANTS_H

namespace cryo {
namespace burstMine {

const unsigned int HASH_SIZE = 32;
const unsigned int HASHES_PER_SCOOP = 2;
const unsigned int SCOOP_SIZE = HASHES_PER_SCOOP * HASH_SIZE;
const unsigned int SCOOPS_PER_PLOT = 4096;
const unsigned int PLOT_SIZE = SCOOPS_PER_PLOT * SCOOP_SIZE;
const unsigned int HASH_CAP = 4096;

}}

#endif
