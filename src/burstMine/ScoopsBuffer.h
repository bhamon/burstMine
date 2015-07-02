/*
	Burst mine
	Distributed graphical plotter and miner for Burst.
	Author: Cryo
	Bitcoin: 138gMBhCrNkbaiTCmUhP9HLU9xwn5QKZgD
	Burst: BURST-YA29-QCEW-QXC3-BKXDL
*/

#ifndef CRYO_BURST_MINE_SCOOPS_BUFFER_H
#define CRYO_BURST_MINE_SCOOPS_BUFFER_H

#include <memory>
#include <exception>
#include "Scoop.h"

namespace cryo {
namespace burstMine {

class ScoopsBuffer {
	private:
		std::size_t m_size;
		std::shared_ptr<Scoop> m_scoops;

	public:
		ScoopsBuffer(std::size_t p_size) throw (std::exception);
		ScoopsBuffer(const ScoopsBuffer& p_other);
		virtual ~ScoopsBuffer();

		ScoopsBuffer& operator=(const ScoopsBuffer& p_other);

		inline std::size_t getSize() const;
		inline Scoop& operator[](std::size_t p_index);
		inline const Scoop& operator[](std::size_t p_index) const;

		void copy(std::size_t p_sourceStart, ScoopsBuffer& p_target, std::size_t p_targetStart, std::size_t p_nb = 1);
};

}}

namespace cryo {
namespace burstMine {

std::size_t ScoopsBuffer::getSize() const {
	return m_size;
}

Scoop& ScoopsBuffer::operator[](std::size_t p_index) {
	return m_scoops.get()[p_index];
}

const Scoop& ScoopsBuffer::operator[](std::size_t p_index) const {
	return m_scoops.get()[p_index];
}

}}

#endif
