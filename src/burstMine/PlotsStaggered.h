/*
	Burst mine
	Distributed graphical plotter and miner for Burst.
	Author: Cryo
	Bitcoin: 138gMBhCrNkbaiTCmUhP9HLU9xwn5QKZgD
	Burst: BURST-YA29-QCEW-QXC3-BKXDL
*/

#ifndef CRYO_BURST_MINE_PLOTS_STAGGERED_H
#define CRYO_BURST_MINE_PLOTS_STAGGERED_H

#include <cstddef>

#include "Plots.h"

namespace cryo {
namespace burstMine {

class PlotsStaggered : public Plots {
	private:
		std::size_t m_staggerSize;

	public:
		PlotsStaggered(unsigned long long p_address, unsigned long long p_offset, unsigned int p_number, std::size_t p_staggerSize);
		PlotsStaggered(const Plots& p_plots, std::size_t p_staggerSize);
		virtual ~PlotsStaggered();

		PlotsStaggered& operator=(const PlotsStaggered& p_other);

		inline std::size_t getStaggerSize() const;
		inline void setStaggerSize(std::size_t p_staggerSize);
};

}}

namespace cryo {
namespace burstMine {

std::size_t PlotsStaggered::getStaggerSize() const {
	return m_staggerSize;
}

void PlotsStaggered::setStaggerSize(std::size_t p_staggerSize) {
	m_staggerSize = p_staggerSize;
}

}}

#endif
