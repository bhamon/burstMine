#include "OpenclBuffer.h"

namespace cryo {
namespace opencl {

OpenclBuffer::OpenclBuffer(std::unique_ptr<cl_mem>& p_handle)
: m_handle(std::move(p_handle)) {
}

OpenclBuffer::~OpenclBuffer() throw () {
	clReleaseMemObject(*m_handle);
}

}}
