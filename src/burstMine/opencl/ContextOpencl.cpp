/*
	Burst mine
	Distributed graphical plotter and miner for Burst.
	Author: Cryo
	Bitcoin: 138gMBhCrNkbaiTCmUhP9HLU9xwn5QKZgD
	Burst: BURST-YA29-QCEW-QXC3-BKXDL
*/

#include <vector>
#include <stdexcept>

#include "constants.h"
#include "ContextOpencl.h"

namespace cryo {
namespace burstMine {
namespace opencl {

ContextOpencl::ContextOpencl(const std::shared_ptr<OpenclDeviceConfig>& p_config) throw (std::exception, cryo::opencl::OpenclError)
: m_config(p_config) {
	m_config->normalize();
	if(m_config->getGlobalWorkSize() == 0) {
		throw std::runtime_error("Global work size can't be null");
	} else if(m_config->getLocalWorkSize() == 0) {
		throw std::runtime_error("Local work size can't be null");
	}

	m_bufferCpu = std::unique_ptr<unsigned char[]>(new unsigned char[m_config->getGlobalWorkSize() * cryo::burstMine::PLOT_SIZE]);

	std::vector<std::shared_ptr<cryo::opencl::OpenclPlatform>> platforms(cryo::opencl::OpenclPlatform::list());
	if(p_config->getPlatform() >= platforms.size()) {
		throw std::runtime_error("Invalid platform index");
	}

	m_platform = platforms[p_config->getPlatform()];

	std::vector<std::shared_ptr<cryo::opencl::OpenclDevice>> devices(cryo::opencl::OpenclDevice::list(m_platform));
	if(p_config->getDevice() >= devices.size()) {
		throw std::runtime_error("Invalid device index");
	}

	m_device = devices[p_config->getDevice()];
	m_context = cryo::opencl::OpenclContext::create(m_device);
	m_commandQueue = m_context->createCommandQueue(m_device);
	m_bufferDevice = m_context->createBuffer(cryo::opencl::OpenclMemFlag::ReadWrite, m_config->getGlobalWorkSize() * GEN_SIZE);
	m_program = m_context->createProgram(m_device, KERNEL_PATH + "/nonce.cl", KERNEL_PATH);

	m_kernels.push_back(m_program->createKernel("nonce_step1"));
	m_kernels.push_back(m_program->createKernel("nonce_step2"));
	m_kernels.push_back(m_program->createKernel("nonce_step3"));

	m_kernels[0]->setArgument(0, sizeof(cl_mem), (void*)&m_bufferDevice->getHandle());
	m_kernels[1]->setArgument(0, sizeof(cl_mem), (void*)&m_bufferDevice->getHandle());
	m_kernels[2]->setArgument(0, sizeof(cl_mem), (void*)&m_bufferDevice->getHandle());
}

ContextOpencl::~ContextOpencl() {
}

void ContextOpencl::computePlots(unsigned long long p_address, unsigned long long p_offset, unsigned int p_workSize) throw (std::exception, cryo::opencl::OpenclError) {
	if(p_workSize > m_config->getGlobalWorkSize()) {
		throw std::runtime_error("Global work size too low for the requested work size");
	}

	m_kernels[0]->setArgument(1, sizeof(unsigned int), static_cast<void*>(&p_workSize));
	m_kernels[0]->setArgument(2, sizeof(unsigned long long), static_cast<void*>(&p_address));
	m_kernels[0]->setArgument(3, sizeof(unsigned long long), static_cast<void*>(&p_offset));

	m_commandQueue->enqueueNDRangeKernel(m_kernels[0], m_config->getGlobalWorkSize(), m_config->getLocalWorkSize());

	unsigned int hashesNumber = m_config->getHashesNumber();
	unsigned int hashesSize = hashesNumber * cryo::burstMine::HASH_SIZE;
	for(unsigned int i = 0 ; i < cryo::burstMine::PLOT_SIZE ; i += hashesSize) {
		unsigned int hashesOffset = cryo::burstMine::PLOT_SIZE - i;

		m_kernels[1]->setArgument(1, sizeof(unsigned int), static_cast<void*>(&p_workSize));
		m_kernels[1]->setArgument(2, sizeof(unsigned long long), static_cast<void*>(&p_offset));
		m_kernels[1]->setArgument(3, sizeof(unsigned int), static_cast<void*>(&hashesOffset));
		m_kernels[1]->setArgument(4, sizeof(unsigned int), static_cast<void*>(&hashesNumber));

		m_commandQueue->enqueueNDRangeKernel(m_kernels[1], m_config->getGlobalWorkSize(), m_config->getLocalWorkSize());
//		m_commandQueue->finish();
	}

	m_kernels[2]->setArgument(1, sizeof(unsigned int), static_cast<void*>(&p_workSize));

	m_commandQueue->enqueueNDRangeKernel(m_kernels[2], m_config->getGlobalWorkSize(), m_config->getLocalWorkSize());
// useful???
//	m_commandQueue->finish();
}

void ContextOpencl::bufferPlots(unsigned int p_workSize) throw (std::exception, cryo::opencl::OpenclError) {
	if(p_workSize > m_config->getGlobalWorkSize()) {
		throw std::runtime_error("Global work size too low for the requested work size");
	}

// TEST
m_commandQueue->finish();
// TEST

	std::size_t offsetGpu = 0;
	std::size_t offsetCpu = 0;
	for(unsigned int i = 0 ; i < p_workSize ; ++i, offsetGpu += GEN_SIZE, offsetCpu += PLOT_SIZE) {
		m_commandQueue->enqueueReadBuffer(m_bufferDevice, sizeof(unsigned char) * offsetGpu, sizeof(unsigned char) * PLOT_SIZE, m_bufferCpu.get() + offsetCpu);
	}

// TEST
m_commandQueue->finish();
// TEST
}

}}}
