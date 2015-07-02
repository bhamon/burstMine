/*
	Burst mine
	Distributed graphical plotter and miner for Burst.
	Author: Cryo
	Bitcoin: 138gMBhCrNkbaiTCmUhP9HLU9xwn5QKZgD
	Burst: BURST-YA29-QCEW-QXC3-BKXDL
*/

#ifndef CRYO_BURST_MINE_GENERATOR_H
#define CRYO_BURST_MINE_GENERATOR_H

#include <exception>

#include "GenerationWork.h"
#include "ScoopsBuffer.h"

namespace cryo {
namespace burstMine {

class Generator {
	public:
		Generator() throw (std::exception);
		Generator(const Generator& p_other);
		virtual ~Generator();

		Generator& operator=(const Generator& p_other);

		virtual unsigned int getMaxWorkSize() const = 0;
		virtual void computePlots(const GenerationWork& p_work, ScoopsBuffer& p_buffer) throw (std::exception) = 0;
};

}}

#endif
