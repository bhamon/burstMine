#ifndef CRYO_OPENCL_CONTEXT_H
#define CRYO_OPENCL_CONTEXT_H

#include <memory>
#include <vector>
#include <exception>
#include <CL/cl.h>

#include "OpenclDevice.h"
#include "OpenclCommandQueue.h"
#include "OpenclBuffer.h"
#include "OpenclProgram.h"
#include "OpenclError.h"

namespace cryo {
namespace opencl {

enum OpenclMemFlag {
	ReadWrite = CL_MEM_READ_WRITE,
	ReadOnly = CL_MEM_READ_ONLY,
	WriteOnly = CL_MEM_WRITE_ONLY,
	UseHostPointer = CL_MEM_USE_HOST_PTR,
	AllocHostPointer = CL_MEM_ALLOC_HOST_PTR,
	CopyHostPointer = CL_MEM_COPY_HOST_PTR
};

class OpenclContext {
	public:
		std::unique_ptr<OpenclContext> create(const std::vector<std::shared_ptr<OpenclDevice>>& p_devices);
		std::unique_ptr<OpenclContext> create(const std::shared_ptr<OpenclDevice>& p_device);

	private:
		std::unique_ptr<cl_context> m_handle;

	public:
		OpenclContext(std::unique_ptr<cl_context>& p_handle);
		OpenclContext(const OpenclContext& p_other) = delete;
		virtual ~OpenclContext() throw ();

		OpenclContext& operator=(const OpenclContext& p_other) = delete;

		inline const cl_context& getHandle() const;

		std::unique_ptr<OpenclCommandQueue> createCommandQueue(const std::shared_ptr<OpenclDevice>& p_device) const throw (OpenclError);
		std::unique_ptr<OpenclBuffer> createBuffer(OpenclMemFlag p_flags, std::size_t p_size, void* p_hostPointer = 0) const throw (OpenclError);
		std::unique_ptr<OpenclProgram> createProgram(const std::shared_ptr<OpenclDevice>& p_device, std::string p_file, std::string p_includePath = "") const throw (std::exception, OpenclError);

	private:
		std::string loadSource(const std::string& p_file) const throw (std::exception);
};

}}

namespace cryo {
namespace opencl {

inline const cl_context& OpenclContext::getHandle() const {
	return *m_handle;
}

}}

#endif
