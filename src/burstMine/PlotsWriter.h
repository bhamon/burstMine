/*
	Burst mine
	Distributed graphical plotter and miner for Burst.
	Author: Cryo
	Bitcoin: 138gMBhCrNkbaiTCmUhP9HLU9xwn5QKZgD
	Burst: BURST-YA29-QCEW-QXC3-BKXDL
*/

#ifndef CRYO_BURST_MINE_PLOTS_WRITER_H
#define CRYO_BURST_MINE_PLOTS_WRITER_H

#include "ScoopsBuffer.h"

namespace cryo {
namespace burstMine {

class PlotsWriter {
	public:
		PlotsWriter();
		virtual ~PlotsWriter();

		PlotsWriter& operator=(const PlotsWriter& p_other);

		virtual void writePlots(ScoopsBuffer& p_buffer, std::size_t p_size) = 0;
};

}}

#endif
