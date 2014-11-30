/*
	Burst mine
	Distributed graphical plotter and miner for Burst.
	Author: Cryo
	Bitcoin: 138gMBhCrNkbaiTCmUhP9HLU9xwn5QKZgD
	Burst: BURST-YA29-QCEW-QXC3-BKXDL
*/

#ifndef CRYO_BURST_MINE_GENERATORS_OPENCL_CONTEXT_OPENCL_CONFIG_H
#define CRYO_BURST_MINE_GENERATORS_OPENCL_CONTEXT_OPENCL_CONFIG_H

#include <string>
#include <vector>
#include <exception>

namespace cryo {
namespace burstMine {
namespace generators {
namespace opencl {

class ContextOpenclConfig {
	private:
		std::size_t m_platform;
		std::size_t m_device;
		std::size_t m_globalWorkSize;
		std::size_t m_localWorkSize;
		unsigned int m_hashesNumber;
		std::string m_kernelsPath;

	public:
		ContextOpenclConfig(std::size_t p_platform, std::size_t p_device, std::size_t p_globalWorkSize, std::size_t p_localWorkSize, unsigned int p_hashesNumber, const std::string p_kernelsPath);
		ContextOpenclConfig(const ContextOpenclConfig& p_other);
		virtual ~ContextOpenclConfig() throw ();

		ContextOpenclConfig& operator=(const ContextOpenclConfig& p_other);

		inline std::size_t getPlatform() const;
		inline std::size_t getDevice() const;
		inline std::size_t getGlobalWorkSize() const;
		inline std::size_t getLocalWorkSize() const;
		inline unsigned int getHashesNumber() const;
		inline const std::string& getKernelsPath() const;
		inline void setGlobalWorkSize(std::size_t p_globalWorkSize);
		inline void setLocalWorkSize(std::size_t p_localWorkSize);
		inline void setHashesNumber(unsigned int p_hashesNumber);
		inline void setKernelsPath(const std::string& p_kernelPath);
		inline std::size_t& globalWorkSize();
		inline std::size_t& localWorkSize();
		inline unsigned int& hashesNumber();

		inline unsigned long long getBufferSize() const;

		void normalize();
};

}}}}

#include "constants.h"

namespace cryo {
namespace burstMine {
namespace generators {
namespace opencl {

inline std::size_t ContextOpenclConfig::getPlatform() const {
	return m_platform;
}

inline std::size_t ContextOpenclConfig::getDevice() const {
	return m_device;
}

inline std::size_t ContextOpenclConfig::getGlobalWorkSize() const {
	return m_globalWorkSize;
}

inline std::size_t ContextOpenclConfig::getLocalWorkSize() const {
	return m_localWorkSize;
}

inline unsigned int ContextOpenclConfig::getHashesNumber() const {
	return m_hashesNumber;
}

inline const std::string& ContextOpenclConfig::getKernelsPath() const {
	return m_kernelsPath;
}

inline void ContextOpenclConfig::setGlobalWorkSize(std::size_t p_globalWorkSize) {
	m_globalWorkSize = p_globalWorkSize;
}

inline void ContextOpenclConfig::setLocalWorkSize(std::size_t p_localWorkSize) {
	m_localWorkSize = p_localWorkSize;
}

inline void ContextOpenclConfig::setKernelsPath(const std::string& p_kernelsPath) {
	m_kernelsPath = p_kernelsPath;
}

inline std::size_t& ContextOpenclConfig::globalWorkSize() {
	return m_globalWorkSize;
}

inline std::size_t& ContextOpenclConfig::localWorkSize() {
	return m_localWorkSize;
}

inline unsigned int& ContextOpenclConfig::hashesNumber() {
	return m_hashesNumber;
}

inline void ContextOpenclConfig::setHashesNumber(unsigned int p_hashesNumber) {
	m_hashesNumber = p_hashesNumber;
}

inline unsigned long long ContextOpenclConfig::getBufferSize() const {
	return m_globalWorkSize * GEN_SIZE;
}

}}}}

#endif
