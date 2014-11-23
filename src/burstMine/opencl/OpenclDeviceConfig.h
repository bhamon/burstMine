/*
	Burst mine
	Distributed graphical plotter and miner for Burst.
	Author: Cryo
	Bitcoin: 138gMBhCrNkbaiTCmUhP9HLU9xwn5QKZgD
	Burst: BURST-YA29-QCEW-QXC3-BKXDL
*/

#ifndef CRYO_BURST_MINE_OPENCL_DEVICE_CONFIG_H
#define CRYO_BURST_MINE_OPENCL_DEVICE_CONFIG_H

#include <string>
#include <vector>
#include <exception>

namespace cryo {
namespace burstMine {
namespace opencl {

class DeviceConfig {
	private:
		std::size_t m_platform;
		std::size_t m_device;
		std::size_t m_globalWorkSize;
		std::size_t m_localWorkSize;
		unsigned int m_hashesNumber;

	public:
		DeviceConfig(std::size_t p_platform, std::size_t p_device, std::size_t p_globalWorkSize, std::size_t p_localWorkSize, unsigned int p_hashesNumber);
		DeviceConfig(const DeviceConfig& p_other);

		virtual ~DeviceConfig() throw ();

		DeviceConfig& operator=(const DeviceConfig& p_other);

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

}}

#include "constants.h"

namespace cryo {
namespace burstMine {

inline std::size_t DeviceConfig::getPlatform() const {
	return m_platform;
}

inline std::size_t DeviceConfig::getDevice() const {
	return m_device;
}

inline std::size_t DeviceConfig::getGlobalWorkSize() const {
	return m_globalWorkSize;
}

inline std::size_t DeviceConfig::getLocalWorkSize() const {
	return m_localWorkSize;
}

inline unsigned int DeviceConfig::getHashesNumber() const {
	return m_hashesNumber;
}

inline void DeviceConfig::setGlobalWorkSize(std::size_t p_globalWorkSize) {
	m_globalWorkSize = p_globalWorkSize;
}

inline void DeviceConfig::setLocalWorkSize(std::size_t p_localWorkSize) {
	m_localWorkSize = p_localWorkSize;
}

inline std::size_t& DeviceConfig::globalWorkSize() {
	return m_globalWorkSize;
}

inline std::size_t& DeviceConfig::localWorkSize() {
	return m_localWorkSize;
}

inline unsigned int& DeviceConfig::hashesNumber() {
	return m_hashesNumber;
}

inline void DeviceConfig::setHashesNumber(unsigned int p_hashesNumber) {
	m_hashesNumber = p_hashesNumber;
}

inline unsigned long long DeviceConfig::getBufferSize() const {
	return m_globalWorkSize * cryo::burstMine::GEN_SIZE;
}

}}

#endif
