/*
	Burst mine
	Distributed graphical plotter and miner for Burst.
	Author: Cryo
	Bitcoin: 138gMBhCrNkbaiTCmUhP9HLU9xwn5QKZgD
	Burst: BURST-YA29-QCEW-QXC3-BKXDL
*/

#include "PlotsStaggered.h"

namespace cryo {
namespace burstMine {

PlotsStaggered::PlotsStaggered(unsigned long long p_address, unsigned long long p_offset, unsigned int p_number, std::size_t p_staggerSize)
: Plots(p_address, p_offset, p_number), m_staggerSize(p_staggerSize) {
}

PlotsStaggered::PlotsStaggered(const Plots& p_plots, std::size_t p_staggerSize)
: Plots(p_plots), m_staggerSize(p_staggerSize) {
}

PlotsStaggered::~PlotsStaggered() {
}

PlotsStaggered& PlotsStaggered::operator=(const PlotsStaggered& p_other) {
	Plots::operator=(p_other);

	m_staggerSize = p_other.m_staggerSize;

	return *this;
}

}}
