/*
	Burst mine
	Distributed graphical plotter and miner for Burst.
	Author: Cryo
	Bitcoin: 138gMBhCrNkbaiTCmUhP9HLU9xwn5QKZgD
	Burst: BURST-YA29-QCEW-QXC3-BKXDL
*/

#include "Plots.h"

namespace cryo {
namespace burstMine {

Plots::Plots(unsigned long long p_address, unsigned long long p_offset, unsigned int p_number)
: m_address(p_address), m_offset(p_offset), m_number(p_number) {
}

Plots::~Plots() {
}

Plots& Plots::operator=(const Plots& p_other) {
	m_address = p_other.m_address;
	m_offset = p_other.m_offset;
	m_number = p_other.m_number;

	return *this;
}

}}
