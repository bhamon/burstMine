/*
	Burst mine
	Distributed graphical plotter and miner for Burst.
	Author: Cryo
	Bitcoin: 138gMBhCrNkbaiTCmUhP9HLU9xwn5QKZgD
	Burst: BURST-YA29-QCEW-QXC3-BKXDL
*/

#ifndef CRYO_BURST_MINE_OPENCL_CONTEXT_OPENCL_H
#define CRYO_BURST_MINE_OPENCL_CONTEXT_OPENCL_H

#include <exception>
#include <CL/CL.h>

#include "../../opencl/OpenclError.h"
#include "../../opencl/OpenclDevice.h"
#include "OpenclDeviceConfig.h"

namespace cryo {
namespace burstMine {
namespace opencl {

class ContextOpencl {
	private:
		std::shared_ptr<OpenclDeviceConfig> m_config;
		std::shared_ptr<cryo::opencl::OpenclDevice> m_device;
		unsigned char* m_bufferCpu;
		cl_context m_context;
		cl_command_queue m_commandQueue;
		cl_mem m_bufferDevice;
		cl_program m_program;
		cl_kernel m_kernels[3];

	public:
		ContextOpencl(const std::shared_ptr<OpenclDeviceConfig>& p_config, const std::shared_ptr<cryo::opencl::OpenclDevice>& p_device) throw (std::exception, cryo::opencl::OpenclError);
		ContextOpencl(const ContextOpencl& p_other) = delete;
		virtual ~ContextOpencl();

		ContextOpencl& operator=(const ContextOpencl& p_other) = delete;

		void generatePlots(unsigned long long p_address, unsigned long long p_offset, unsigned int p_nb) throw (std::exception, cryo::opencl::OpenclError);
};

}}}

#endif
