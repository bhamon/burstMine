#ifndef CRYO_OPENCL_CONTEXT_H
#define CRYO_OPENCL_CONTEXT_H

#include <memory>
#include <CL/cl.h>

#include "OpenclError.h"

namespace cryo {

enum OpenclMemFlag {
	ReadWrite = CL_MEM_READ_WRITE,
	ReadOnly = CL_MEM_READ_ONLY,
	WriteOnly = CL_MEM_WRITE_ONLY,
	UseHostPointer = CL_MEM_USE_HOST_PTR,
	AllocHostPointer = CL_MEM_ALLOC_HOST_PTR,
	CopyHostPointer = CL_MEM_COPY_HOST_PTR
};

class OpenclContext {
	private:
		cl_context m_context;

	public:
		OpenclContext(const cl_context& p_handle);
		OpenclContext(const OpenclContext& p_other);
		virtual ~OpenclContext() throw ();

		OpenclContext& operator=(const OpenclContext& p_other);

		inline const cl_context& getHandle() const;

		std::unique_ptr<OpenclCommandQueue> createCommandQueue(const OpenclDevice& p_device) const throw (OpenclError);
		std::unique_ptr<OpenclBuffer> createBuffer(OpenclMemFlag p_flags, std::size_t p_size, void* p_hostPointer = 0) const throw (OpenclError);
		std::unique_ptr<OpenclProgram> createProgram(std::string p_file, std::string p_includePath = "") const throw (OpenclError);
};

}

namespace cryo {

inline const cl_platform_id& OpenclContext::getHandle() const {
	return m_handle;
}

}

#endif
