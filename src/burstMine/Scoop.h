/*
	Burst mine
	Distributed graphical plotter and miner for Burst.
	Author: Cryo
	Bitcoin: 138gMBhCrNkbaiTCmUhP9HLU9xwn5QKZgD
	Burst: BURST-YA29-QCEW-QXC3-BKXDL
*/

#ifndef CRYO_BURST_MINE_SCOOP_H
#define CRYO_BURST_MINE_SCOOP_H

#include "constants.h"

namespace cryo {
namespace burstMine {

struct Scoop {
	unsigned char data[SCOOP_SIZE];
};

}}

#endif
