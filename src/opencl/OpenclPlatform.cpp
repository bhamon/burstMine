#include "OpenclPlatform.h"

namespace cryo {
namespace opencl {

OpenclPlatform::OpenclPlatform(std::unique_ptr<cl_platform_id>& p_handle)
: m_handle(std::move(p_handle)) {
}

OpenclPlatform::~OpenclPlatform() throw () {
}

std::string OpenclPlatform::getName() const throw (OpenclError) {
	return getInfoString(CL_PLATFORM_NAME);
}

std::string OpenclPlatform::getVendor() const throw (OpenclError) {
	return getInfoString(CL_PLATFORM_VENDOR);
}

std::string OpenclPlatform::getVersion() const throw (OpenclError) {
	return getInfoString(CL_PLATFORM_VERSION);
}

std::string OpenclPlatform::getInfoString(const cl_platform_info& p_paramName) const throw (OpenclError) {
	cl_int error;
	std::size_t size = 0;
	error = clGetPlatformInfo(*m_handle, p_paramName, 0, 0, &size);
	if(error != CL_SUCCESS) {
		throw OpenclError(error, "Unable to retrieve info size");
	}

	std::unique_ptr<char[]> buffer(new char[size]);
	error = clGetPlatformInfo(*m_handle, p_paramName, size, (void*)buffer.get(), 0);
	if(error != CL_SUCCESS) {
		throw OpenclError(error, "Unable to retrieve info value");
	}

	return std::string(buffer.get());
}

std::vector<std::shared_ptr<OpenclPlatform>> OpenclPlatform::list() throw (OpenclError) {
	std::vector<std::shared_ptr<OpenclPlatform>> list;
	cl_int error;

	cl_uint platformsNumber = 0;
	error = clGetPlatformIDs(0, 0, &platformsNumber);
	if(error != CL_SUCCESS) {
		throw OpenclError(error, "Unable to retrieve the OpenCL platforms number");
	}

	std::unique_ptr<cl_platform_id[]> platforms(new cl_platform_id[platformsNumber]);
	error = clGetPlatformIDs(platformsNumber, platforms.get(), 0);
	if(error != CL_SUCCESS) {
		throw OpenclError(error, "Unable to retrieve the OpenCL platforms");
	}

	for(cl_uint i = 0 ; i < platformsNumber ; ++i) {
		std::unique_ptr<cl_platform_id> platform(new cl_platform_id(platforms[i]));
		list.push_back(std::shared_ptr<OpenclPlatform>(new OpenclPlatform(platform)));
	}

	return list;
}

}}
