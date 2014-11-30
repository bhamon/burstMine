#ifndef CRYO_OPENCL_JS_JS_OPENCL_PLATFORM_H
#define CRYO_OPENCL_JS_JS_OPENCL_PLATFORM_H

#include <v8.h>
#include <node.h>

#include "../OpenclPlatform.h"

namespace cryo {
namespace opencl {
namespace js {

class JsOpenclPlatform {
	public:
		static v8::Handle<v8::Value> New(const cryo::opencl::OpenclPlatform& p_platform);
};

}}}

#endif
