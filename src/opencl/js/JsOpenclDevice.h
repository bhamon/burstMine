#ifndef CRYO_OPENCL_JS_JS_OPENCL_DEVICE_H
#define CRYO_OPENCL_JS_JS_OPENCL_DEVICE_H

#include <v8.h>
#include <node.h>

#include "../OpenclDevice.h"

namespace cryo {
namespace opencl {
namespace js {

class JsOpenclDevice {
	public:
		static v8::Handle<v8::Value> New(const cryo::opencl::OpenclDevice& p_device);
};

}}}

#endif
