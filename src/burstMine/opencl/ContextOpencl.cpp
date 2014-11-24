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
#include "Context.h"

namespace cryo {
namespace burstMine {
namespace opencl {

Context::Context(const std::shared_ptr<OpenclDeviceConfig>& p_config) throw (std::exception, cryo::opencl::OpenclError)
: m_config(p_config) {
	m_config->normalize();
	if(m_config->getGobalWorkSize() == 0) {
		throw std::runtime_error("Global work size can't be null");
	} else if(m_config->getLocalWorkSize() == 0) {
		throw std::runtime_error("Local work size can't be null");
	}

	m_bufferCpu = new unsigned char[m_config->getGlobalWorkSize() * cryo::burstMine::PLOT_SIZE];

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

	m_kernels[0] = m_program->createKernel("nonce_step1");
	m_kernels[0]->setArgument(0, sizeof(cl_mem), &m_bufferDevice->getHandle());

	m_kernels[1] = m_program->createKernel("nonce_step2");
	m_kernels[1]->setArgument(0, sizeof(cl_mem), &m_bufferDevice->getHandle());

	m_kernels[2] = m_program->createKernel("nonce_step3");
	m_kernels[2]->setArgument(0, sizeof(cl_mem), &m_bufferDevice->getHandle());
}

Context::~Context() {
}

void generatePlots(unsigned long long p_address, unsigned long long p_offset, unsigned int p_nb) throw (std::exception, OpenclError) {
}

}}}
