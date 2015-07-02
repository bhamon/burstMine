/*
	Burst mine
	Distributed graphical plotter and miner for Burst.
	Author: Cryo
	Bitcoin: 138gMBhCrNkbaiTCmUhP9HLU9xwn5QKZgD
	Burst: BURST-YA29-QCEW-QXC3-BKXDL
*/

#include <algorithm>
#include "ScoopsBuffer.h"

namespace cryo {
namespace burstMine {

ScoopsBuffer::ScoopsBuffer(std::size_t p_size)
: m_size(p_size), m_scoops(new Scoop[p_size], std::default_delete<Scoop[]>()) {
}

ScoopsBuffer::ScoopsBuffer(const ScoopsBuffer& p_other) {
	*this = p_other;
}

ScoopsBuffer::~ScoopsBuffer() {
}

ScoopsBuffer& ScoopsBuffer::operator=(const ScoopsBuffer& p_other) {
	m_size = p_other.m_size;
	m_scoops = p_other.m_scoops;

	return *this;
}

void ScoopsBuffer::copy(std::size_t p_sourceStart, ScoopsBuffer& p_target, std::size_t p_targetStart, std::size_t p_nb) {
	std::copy_n(&m_scoops.get()[p_sourceStart], p_nb, &p_target.m_scoops.get()[p_targetStart]);
}

}}
