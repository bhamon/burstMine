/*
	Burst mine
	Distributed graphical plotter and miner for Burst.
	Author: Cryo
	Bitcoin: 138gMBhCrNkbaiTCmUhP9HLU9xwn5QKZgD
	Burst: BURST-YA29-QCEW-QXC3-BKXDL
*/

#ifndef CRYO_BURST_MINE_GENERATORS_GENERATION_WORK_H
#define CRYO_BURST_MINE_GENERATORS_GENERATION_WORK_H

namespace cryo {
namespace burstMine {
namespace generators {

class GenerationWork {
	private:
		unsigned long long m_address;
		unsigned long long m_offset;
		unsigned m_workSize;

	public:
		GenerationWork(unsigned long long p_address, unsigned long long p_offset, unsigned int p_workSize);
		GenerationWork(const GenerationWork& p_other);
		virtual ~GenerationWork() throw ();

		GenerationWork& operator=(const GenerationWork& p_other);

		inline unsigned long long getAddress() const;
		inline unsigned long long getOffset() const;
		inline unsigned int getWorkSize() const;
};

}}}

namespace cryo {
namespace burstMine {
namespace generators {

unsigned long long GenerationWork::getAddress() const {
	return m_address;
}

unsigned long long GenerationWork::getOffset() const {
	return m_offset;
}

unsigned int GenerationWork::getWorkSize() const {
	return m_workSize;
}

}}}

#endif
