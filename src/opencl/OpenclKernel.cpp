#include "OpenclKernel.h"

namespace cryo {
namespace opencl {

OpenclKernel::OpenclKernel(std::unique_ptr<cl_kernel>& p_handle)
: m_handle(std::move(p_handle)) {
}

OpenclKernel::~OpenclKernel() throw () {
	clReleaseKernel(*m_handle);
}

void OpenclKernel::setKernelArgument(unsigned int p_index, std::size_t p_size, void* p_value) throw (OpenclError) {
	cl_int error = clSetKernelArg(*m_handle, p_index, p_size, p_value);
	if(error != CL_SUCCESS) {
		throw OpenclError(error, "Unable to set the OpenCL kernel argument");
	}
}

}}