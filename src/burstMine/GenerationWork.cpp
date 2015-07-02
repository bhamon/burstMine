/*
	Burst mine
	Distributed graphical plotter and miner for Burst.
	Author: Cryo
	Bitcoin: 138gMBhCrNkbaiTCmUhP9HLU9xwn5QKZgD
	Burst: BURST-YA29-QCEW-QXC3-BKXDL
*/

#include "GenerationWork.h"

namespace cryo {
namespace burstMine {

GenerationWork::GenerationWork(unsigned long long p_address, unsigned long long p_offset, unsigned int p_size)
: m_address(p_address), m_offset(p_offset), m_size(p_size) {
}

GenerationWork::GenerationWork(const GenerationWork& p_other)
: m_address(p_other.m_address), m_offset(p_other.m_offset), m_size(p_other.m_size) {
}

GenerationWork::~GenerationWork() throw () {
}

GenerationWork& GenerationWork::operator=(const GenerationWork& p_other) {
	if(this == &p_other) {
		return *this;
	}

	m_address = p_other.m_address;
	m_offset = p_other.m_offset;
	m_size = p_other.m_size;

	return *this;
}

}}
