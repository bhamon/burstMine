#include "OpenclContext.h"

namespace cryo {
namespace opencl {

OpenclContext::OpenclContext(const cl_context& p_handle)
: m_handle(p_handle) {
}

OpenclContext::OpenclContext(const OpenclContext& p_other)
: m_handle(p_other.m_handle) {
}

OpenclContext::~OpenclContext() throw () {
}

OpenclContext& OpenclContext::operator=(const OpenclContext& p_other) {
	m_handle = p_other.m_handle;

	return *this;
}

OpenclCommandQueue OpenclContext::createCommandQueue(const OpenclDevice& p_device) const throw (OpenclError) {
	cl_int error;
	cl_command_queue commandQueue(clCreateCommandQueue(m_handle, p_device->getHandle(), 0, &error));
	if(error != CL_SUCCESS) {
		throw OpenclError(error, "Unable to create the OpenCL command queue");
	}

	return OpenclCommandQueue(commandQueue);
}

OpenclBuffer OpenclContext::createBuffer(OpenclMemFlag p_flags, std::size_t p_size, void* p_hostPointer) const throw (OpenclError) {
	cl_int error;
	cl_mem buffer(clCreateBuffer(m_handle, p_flags, p_size, p_hostPointer, &error));
	if(error != CL_SUCCESS) {
		throw OpenclError(error, "Unable to create the OpenCL buffer");
	}

	return OpenclBuffer(buffer);
}

}}
