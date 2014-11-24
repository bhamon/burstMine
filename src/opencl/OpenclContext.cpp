#include <stdexcept>
#include <sstream>
#include <fstream>
#include <streambuf>

#include "OpenclContext.h"

namespace cryo {
namespace opencl {

std::unique_ptr<OpenclContext> OpenclContext::create(const std::vector<std::shared_ptr<OpenclDevice>>& p_devices) {
	cl_int error;
	std::unique_ptr<cl_device_id[]> devices(new cl_device_id[p_devices.size()]);
	for(std::size_t i = 0 ; i < p_devices.size() ; ++i) {
		devices[i] = p_devices[i]->getHandle();
	}

	std::unique_ptr<cl_context> context(new cl_context);
	*context = clCreateContext(0, p_devices.size(), devices.get(), 0, 0, &error);
	if(error != CL_SUCCESS) {
		throw OpenclError(error, "Unable to create the OpenCL context");
	}

	return std::unique_ptr<OpenclContext>(new OpenclContext(context));
}

std::unique_ptr<OpenclContext> OpenclContext::create(const std::shared_ptr<OpenclDevice>& p_device) {
	std::vector<std::shared_ptr<OpenclDevice>> devices;
	devices.push_back(device);
	return create(devices);
}

OpenclContext::OpenclContext(std::unique_ptr<cl_context>& p_handle)
: m_handle(std::move(p_handle)) {
}

OpenclContext::~OpenclContext() throw () {
	clReleaseContext(*m_handle);
}

std::unique_ptr<OpenclCommandQueue> OpenclContext::createCommandQueue(const std::shared_ptr<OpenclDevice>& p_device) const throw (OpenclError) {
	cl_int error;
	std::unique_ptr<cl_command_queue> commandQueue(new cl_command_queue);
	*commandQueue = clCreateCommandQueue(*m_handle, p_device->getHandle(), 0, &error);
	if(error != CL_SUCCESS) {
		throw OpenclError(error, "Unable to create the OpenCL command queue");
	}

	return std::unique_ptr<OpenclCommandQueue>(new OpenclCommandQueue(commandQueue));
}

std::unique_ptr<OpenclBuffer> OpenclContext::createBuffer(OpenclMemFlag p_flags, std::size_t p_size, void* p_hostPointer) const throw (OpenclError) {
	cl_int error;
	std::unique_ptr<cl_mem> buffer(new cl_mem);
	*buffer = clCreateBuffer(*m_handle, p_flags, p_size, p_hostPointer, &error);
	if(error != CL_SUCCESS) {
		throw OpenclError(error, "Unable to create the OpenCL buffer");
	}

	return std::unique_ptr<OpenclBuffer>(new OpenclBuffer(buffer));
}

std::unique_ptr<OpenclProgram> OpenclContext::createProgram(const std::shared_ptr<OpenclDevice>& p_device, std::string p_file, std::string p_includePath) const throw (OpenclError) {
	cl_int error;
	std::string source(loadSource(p_file));
	const char* sources[] = {source.c_str()};
	std::size_t sourcesLength[] = {source.length()};
	std::unique_ptr<cl_program> program(new cl_program);
	*program = clCreateProgramWithSource(*m_handle, 1, sources, sourcesLength, &error);
	if(error != CL_SUCCESS) {
		throw OpenclError(error, "Unable to create the OpenCL program");
	}

	std::string includePath("-I " + p_includePath);
	error = clBuildProgram(*program, 1, &p_device->getHandle(), includePath.c_str(), 0, 0);
	if(error != CL_SUCCESS) {
		std::size_t logSize;
		cl_int subError = clGetProgramBuildInfo(*program, p_device->getHandle(), CL_PROGRAM_BUILD_LOG, 0, 0, &logSize);
		if(subError != CL_SUCCESS) {
			throw OpenclError(subError, "Unable to retrieve the OpenCL build info size");
		}

		std::unique_ptr<char[]> log(new char[logSize]);
		subError = clGetProgramBuildInfo(*program, p_device->getHandle(), CL_PROGRAM_BUILD_LOG, logSize, (void*)log.get(), 0);
		if(subError != CL_SUCCESS) {
			throw OpenclError(subError, "Unable to retrieve the OpenCL build info");
		}

		std::ostringstream message;
		message << "Unable to build the OpenCL program" << std::endl;
		message << log.get();

		throw OpenclError(error, message.str());
	}

	return std::unique_ptr<OpenclProgram>(new OpenclProgram(program));
}

std::string OpenclContext::loadSource(const std::string& p_file) const throw (std::exception) {
	std::ifstream stream(p_file, std::ios::in);
	if(!stream) {
		throw std::runtime_error("Unable to open the source file");
	}

	std::string str;

	stream.seekg(0, std::ios::end);
	str.reserve(stream.tellg());
	stream.seekg(0, std::ios::beg);

	str.assign(std::istreambuf_iterator<char>(stream), std::istreambuf_iterator<char>());

	return str;
}

}}
