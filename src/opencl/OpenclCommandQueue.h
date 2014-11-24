#ifndef CRYO_OPENCL_COMMAND_QUEUE_H
#define CRYO_OPENCL_COMMAND_QUEUE_H

#include <memory>
#include <CL/cl.h>

namespace cryo {
namespace opencl {

class OpenclCommandQueue {
	private:
		std::unique_ptr<cl_command_queue> m_handle;

	public:
		OpenclCommandQueue(std::unique_ptr<cl_command_queue>& p_handle);
		OpenclCommandQueue(const OpenclCommandQueue& p_other) = delete;
		virtual ~OpenclCommandQueue() throw ();

		OpenclCommandQueue& operator=(const OpenclCommandQueue& p_other) = delete;

		inline const cl_command_queue& getHandle() const;
};

}}

namespace cryo {
namespace opencl {

inline const cl_command_queue& OpenclCommandQueue::getHandle() const {
	return *m_handle;
}

}}

#endif
