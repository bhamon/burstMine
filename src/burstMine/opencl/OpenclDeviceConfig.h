/*
	Burst mine
	Distributed graphical plotter and miner for Burst.
	Author: Cryo
	Bitcoin: 138gMBhCrNkbaiTCmUhP9HLU9xwn5QKZgD
	Burst: BURST-YA29-QCEW-QXC3-BKXDL
*/

#ifndef CRYO_BURST_MINE_OPENCL_OPENCL_DEVICE_CONFIG_H
#define CRYO_BURST_MINE_OPENCL_OPENCL_DEVICE_CONFIG_H

#include <string>
#include <vector>
#include <exception>

namespace cryo {
namespace burstMine {
namespace opencl {

class OpenclDeviceConfig {
	private:
		std::size_t m_platform;
		std::size_t m_device;
		std::size_t m_globalWorkSize;
		std::size_t m_localWorkSize;
		unsigned int m_hashesNumber;

	public:
		OpenclDeviceConfig(std::size_t p_platform, std::size_t p_device, std::size_t p_globalWorkSize, std::size_t p_localWorkSize, unsigned int p_hashesNumber);
		OpenclDeviceConfig(const OpenclDeviceConfig& p_other);
		virtual ~OpenclDeviceConfig() throw ();

		OpenclDeviceConfig& operator=(const OpenclDeviceConfig& p_other);

		inline std::size_t getPlatform() const;
		inline std::size_t getDevice() const;
		inline std::size_t getGlobalWorkSize() const;
		inline std::size_t getLocalWorkSize() const;
		inline unsigned int getHashesNumber() const;
		inline void setGlobalWorkSize(std::size_t p_globalWorkSize);
		inline void setLocalWorkSize(std::size_t p_localWorkSize);
		inline void setHashesNumber(unsigned int p_hashesNumber);
		inline std::size_t& globalWorkSize();
		inline std::size_t& localWorkSize();
		inline unsigned int& hashesNumber();

		inline unsigned long long getBufferSize() const;

		void normalize();
};

}}}

#include "constants.h"

namespace cryo {
namespace burstMine {
namespace opencl {

inline std::size_t OpenclDeviceConfig::getPlatform() const {
	return m_platform;
}

inline std::size_t OpenclDeviceConfig::getDevice() const {
	return m_device;
}

inline std::size_t OpenclDeviceConfig::getGlobalWorkSize() const {
	return m_globalWorkSize;
}

inline std::size_t OpenclDeviceConfig::getLocalWorkSize() const {
	return m_localWorkSize;
}

inline unsigned int OpenclDeviceConfig::getHashesNumber() const {
	return m_hashesNumber;
}

inline void OpenclDeviceConfig::setGlobalWorkSize(std::size_t p_globalWorkSize) {
	m_globalWorkSize = p_globalWorkSize;
}

inline void OpenclDeviceConfig::setLocalWorkSize(std::size_t p_localWorkSize) {
	m_localWorkSize = p_localWorkSize;
}

inline std::size_t& OpenclDeviceConfig::globalWorkSize() {
	return m_globalWorkSize;
}

inline std::size_t& OpenclDeviceConfig::localWorkSize() {
	return m_localWorkSize;
}

inline unsigned int& OpenclDeviceConfig::hashesNumber() {
	return m_hashesNumber;
}

inline void OpenclDeviceConfig::setHashesNumber(unsigned int p_hashesNumber) {
	m_hashesNumber = p_hashesNumber;
}

inline unsigned long long OpenclDeviceConfig::getBufferSize() const {
	return m_globalWorkSize * GEN_SIZE;
}

}}}

#endif
