#include "OpenclCommandQueue.h"

namespace cryo {
namespace opencl {

OpenclCommandQueue::OpenclCommandQueue(std::unique_ptr<cl_command_queue>& p_handle)
: m_handle(std::move(p_handle)) {
}

OpenclCommandQueue::~OpenclCommandQueue() throw () {
	clReleaseCommandQueue(*m_handle);
}

}}
