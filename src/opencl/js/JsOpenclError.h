#ifndef CRYO_OPENCL_JS_JS_OPENCL_ERROR_H
#define CRYO_OPENCL_JS_JS_OPENCL_ERROR_H

#include <v8.h>
#include <node.h>

namespace cryo {
namespace opencl {
namespace js {

class JsOpenclError {
	public:
		static v8::Handle<v8::Value> New(const cryo::opencl::OpenclError& p_error);
};

}}}

#endif
