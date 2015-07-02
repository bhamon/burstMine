/*
	Burst mine
	Distributed graphical plotter and miner for Burst.
	Author: Cryo
	Bitcoin: 138gMBhCrNkbaiTCmUhP9HLU9xwn5QKZgD
	Burst: BURST-YA29-QCEW-QXC3-BKXDL
*/

#ifndef CRYO_BURST_MINE_PLOTS_H
#define CRYO_BURST_MINE_PLOTS_H

namespace cryo {
namespace burstMine {

class Plots {
	private:
		unsigned long long m_address;
		unsigned long long m_offset;
		unsigned int m_number;

	public:
		Plots(unsigned long long p_address, unsigned long long p_offset, unsigned int p_number);
		virtual ~Plots();

		Plots& operator=(const Plots& p_other);

		inline unsigned long long getAddress() const;
		inline unsigned long long getOffset() const;
		inline unsigned int getNumber() const;
		inline void setAddress(unsigned long long p_address);
		inline void setOffset(unsigned long long p_offset);
		inline void setNumber(unsigned int p_number);
};

}}

namespace cryo {
namespace burstMine {

unsigned long long Plots::getAddress() const {
	return m_address;
}

unsigned long long Plots::getOffset() const {
	return m_offset;
}

unsigned int Plots::getNumber() const {
	return m_number;
}

void Plots::setAddress(unsigned long long p_address) {
	m_address = p_address;
}

void Plots::setOffset(unsigned long long p_offset) {
	m_offset = p_offset;
}

void Plots::setNumber(unsigned int p_number) {
	m_number = p_number;
}

}}

#endif
