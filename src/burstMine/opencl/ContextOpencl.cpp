/*
	Burst mine
	Distributed graphical plotter and miner for Burst.
	Author: Cryo
	Bitcoin: 138gMBhCrNkbaiTCmUhP9HLU9xwn5QKZgD
	Burst: BURST-YA29-QCEW-QXC3-BKXDL
*/

#include "constants.h"
#include "Context.h"

namespace cryo {
namespace burstMine {
namespace opencl {

Context::Context(const std::shared_ptr<OpenclDeviceConfig>& p_config, const std::shared_ptr<cryo::opencl::OpenclDevice>& p_device) throw (std::exception, cryo::opencl::OpenclError)
: m_config(p_config), m_device(p_device) {
	m_bufferCpu = new unsigned char[m_config->getBufferSize()];

	cl_int error;

	m_context = clCreateContext(0, 1, &m_device->getHandle(), NULL, NULL, &error);
	if(error != CL_SUCCESS) {
		throw OpenclError(error, "Unable to create the OpenCL context");
	}

	m_commandQueue = clCreateCommandQueue(m_context, m_device->getHandle(), 0, &error);
	if(error != CL_SUCCESS) {
		throw OpenclError(error, "Unable to create the OpenCL command queue");
	}

	m_bufferDevice = clCreateBuffer(m_context, CL_MEM_READ_WRITE, sizeof(unsigned char) * m_config->getGlobalWorkSize() * GEN_SIZE, 0, &error);
	if(error != CL_SUCCESS) {
		throw OpenclError(error, "Unable to create the OpenCL GPU buffer");
	}

	std::string source(loadSource(KERNEL_PATH + "/nonce.cl"));
	const char* sources[] = {source.c_str()};
	std::size_t sourcesLength[] = {source.length()};
	m_program = clCreateProgramWithSource(m_context, 1, sources, sourcesLength, &error);
	if(error != CL_SUCCESS) {
		throw OpenclError(error, "Unable to create the OpenCL program");
	}

	std::string includePath("-I " + KERNEL_PATH);
	error = clBuildProgram(m_program, 1, &m_device->getHandle(), includePath.c_str(), 0, 0);
	if(error != CL_SUCCESS) {
		std::size_t logSize;
		cl_int subError = clGetProgramBuildInfo(m_program, m_device->getHandle(), CL_PROGRAM_BUILD_LOG, 0, 0, &logSize);
		if(subError != CL_SUCCESS) {
			throw OpenclError(subError, "Unable to retrieve the OpenCL build info size");
		}

		std::unique_ptr<char[]> log(new char[logSize]);
		subError = clGetProgramBuildInfo(m_program, m_device->getHandle(), CL_PROGRAM_BUILD_LOG, logSize, (void*)log.get(), 0);
		if(subError != CL_SUCCESS) {
			throw OpenclError(subError, "Unable to retrieve the OpenCL build info");
		}

		std::ostringstream message;
		message << "Unable to build the OpenCL program" << std::endl;
		message << log.get();

		throw OpenclError(error, message.str());
	}

	m_kernels[0] = clCreateKernel(m_program, "nonce_step1", &error);
	if(error != CL_SUCCESS) {
		throw OpenclError(error, "Unable to create the OpenCL step1 kernel");
	}

	error = clSetKernelArg(m_kernels[0], 0, sizeof(cl_mem), (void*)&m_bufferDevice);
	if(error != CL_SUCCESS) {
		throw OpenclError(error, "Unable to set the OpenCL step1 kernel arguments");
	}

	m_kernels[1] = clCreateKernel(m_program, "nonce_step2", &error);
	if(error != CL_SUCCESS) {
		throw OpenclError(error, "Unable to create the OpenCL step2 kernel");
	}

	error = clSetKernelArg(m_kernels[1], 0, sizeof(cl_mem), (void*)&m_bufferDevice);
	if(error != CL_SUCCESS) {
		throw OpenclError(error, "Unable to set the OpenCL step2 kernel arguments");
	}

	m_kernels[2] = clCreateKernel(m_program, "nonce_step3", &error);
	if(error != CL_SUCCESS) {
		throw OpenclError(error, "Unable to create the OpenCL step3 kernel");
	}

	error = clSetKernelArg(m_kernels[2], 0, sizeof(cl_mem), (void*)&m_bufferDevice);
	if(error != CL_SUCCESS) {
		throw OpenclError(error, "Unable to set the OpenCL step3 kernel arguments");
	}
}

Context::Context(const Context& p_other) {
}

Context::~Context() {
}

Context& Context::operator=(const Context& p_other) {
	return *this;
}

void generatePlots(unsigned long long p_address, unsigned long long p_offset, unsigned int p_nb) throw (std::exception, OpenclError) {
}

}}}
