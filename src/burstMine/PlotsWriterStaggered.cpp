/*
	Burst mine
	Distributed graphical plotter and miner for Burst.
	Author: Cryo
	Bitcoin: 138gMBhCrNkbaiTCmUhP9HLU9xwn5QKZgD
	Burst: BURST-YA29-QCEW-QXC3-BKXDL
*/

#include "constants.h"
#include "PlotsWriterStaggered.h"

namespace cryo {
namespace burstMine {

PlotsWriterStaggered::PlotsWriterStaggered(std::size_t p_staggerSize)
: m_staggerSize(p_staggerSize), m_buffer(p_staggerSize * SCOOPS_PER_PLOT), m_offset(0) {
}

PlotsWriterStaggered::~PlotsWriterStaggered() {
}

PlotsWriterStaggered& PlotsWriterStaggered::operator=(const PlotsWriterStaggered& p_other) {
	m_staggerSize = p_other.m_staggerSize;
	m_buffer = p_other.m_buffer;
	m_offset = p_other.m_offset;

	return *this;
}

void PlotsWriterStaggered::writePlots(ScoopsBuffer& p_buffer, std::size_t p_size) {
	for(std::size_t i = 0 ; i < p_size ; ++i) {
		for(std::size_t j = 0 ; j < SCOOPS_PER_PLOT ; ++j) {
			m_buffer[m_offset + j * m_staggerSize] = p_buffer[i * SCOOPS_PER_PLOT + j];
		}

		++m_offset;
		if(m_offset == m_staggerSize) {
			m_offset = 0;
			flushBuffer();
		}
	}
}

}}
