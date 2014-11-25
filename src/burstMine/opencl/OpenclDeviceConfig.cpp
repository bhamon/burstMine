#include <stdexcept>
#include <algorithm>
#include <memory>

#include "OpenclDeviceConfig.h"

namespace cryo {
namespace burstMine {
namespace opencl {

OpenclDeviceConfig::OpenclDeviceConfig(std::size_t p_platform, std::size_t p_device, std::size_t p_globalWorkSize, std::size_t p_localWorkSize, unsigned int p_hashesNumber)
: m_platform(p_platform), m_device(p_device), m_globalWorkSize(p_globalWorkSize), m_localWorkSize(p_localWorkSize), m_hashesNumber(p_hashesNumber) {
}

OpenclDeviceConfig::OpenclDeviceConfig(const OpenclDeviceConfig& p_other)
: m_platform(p_other.m_platform), m_device(p_other.m_device), m_globalWorkSize(p_other.m_globalWorkSize), m_localWorkSize(p_other.m_localWorkSize), m_hashesNumber(p_other.m_hashesNumber) {
}

OpenclDeviceConfig::~OpenclDeviceConfig() throw () {
}

OpenclDeviceConfig& OpenclDeviceConfig::operator=(const OpenclDeviceConfig& p_other) {
	m_platform = p_other.m_platform;
	m_device = p_other.m_device;
	m_globalWorkSize = p_other.m_globalWorkSize;
	m_localWorkSize = p_other.m_localWorkSize;
	m_hashesNumber = p_other.m_hashesNumber;

	return *this;
}

void OpenclDeviceConfig::normalize() {
	if(m_localWorkSize > m_globalWorkSize) {
		m_localWorkSize = m_globalWorkSize;
	}

	if(m_globalWorkSize % m_localWorkSize != 0) {
		m_localWorkSize = std::max((std::size_t)1, m_localWorkSize - m_globalWorkSize % m_localWorkSize);
	}

	if(m_hashesNumber == 0) {
		m_hashesNumber = 1;
	} else if(m_hashesNumber > PLOT_SIZE / HASH_SIZE) {
		m_hashesNumber = PLOT_SIZE / HASH_SIZE;
	}
}

}}}
