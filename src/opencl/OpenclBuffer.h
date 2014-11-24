#ifndef CRYO_OPENCL_BUFFER_H
#define CRYO_OPENCL_BUFFER_H

#include <memory>
#include <CL/cl.h>

namespace cryo {
namespace opencl {

class OpenclBuffer {
	private:
		std::unique_ptr<cl_mem> m_handle;

	public:
		OpenclBuffer(std::unique_ptr<cl_mem>& p_handle);
		OpenclBuffer(const OpenclBuffer& p_other) = delete;
		virtual ~OpenclBuffer() throw ();

		OpenclBuffer& operator=(const OpenclBuffer& p_other) = delete;

		inline const cl_mem& getHandle() const;
};

}}

namespace cryo {
namespace opencl {

inline const cl_mem& OpenclBuffer::getHandle() const {
	return *m_handle;
}

}}

#endif
