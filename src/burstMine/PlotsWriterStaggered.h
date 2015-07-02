/*
	Burst mine
	Distributed graphical plotter and miner for Burst.
	Author: Cryo
	Bitcoin: 138gMBhCrNkbaiTCmUhP9HLU9xwn5QKZgD
	Burst: BURST-YA29-QCEW-QXC3-BKXDL
*/

#ifndef CRYO_BURST_MINE_PLOTS_WRITER_STAGGERED_H
#define CRYO_BURST_MINE_PLOTS_WRITER_STAGGERED_H

#include "ScoopsBuffer.h"

namespace cryo {
namespace burstMine {

class PlotsWriterStaggered {
	protected:
		std::size_t m_staggerSize;
		ScoopsBuffer m_buffer;
		std::size_t m_offset;

	public:
		PlotsWriterStaggered(std::size_t p_staggerSize);
		virtual ~PlotsWriterStaggered();

		PlotsWriterStaggered& operator=(const PlotsWriterStaggered& p_other);

		inline std::size_t getStaggerSize() const;

		virtual void writePlots(ScoopsBuffer& p_buffer, std::size_t p_size);

	protected:
		virtual void flushBuffer() = 0;
};

}}

namespace cryo {
namespace burstMine {

std::size_t PlotsWriterStaggered::getStaggerSize() const {
	return m_staggerSize;
}

}}

#endif
