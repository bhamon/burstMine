/*
	Burst mine
	Distributed graphical plotter and miner for Burst.
	Author: Cryo
	Bitcoin: 138gMBhCrNkbaiTCmUhP9HLU9xwn5QKZgD
	Burst: BURST-YA29-QCEW-QXC3-BKXDL
*/

#ifndef CRYO_BURST_MINE_GENERATORS_OPENCL_JS_JS_CONTEXT_OPENCL_CONFIG_H
#define CRYO_BURST_MINE_GENERATORS_OPENCL_JS_JS_CONTEXT_OPENCL_CONFIG_H

#include <exception>
#include <v8.h>
#include <node.h>

#include "../ContextOpenclConfig.h"

namespace cryo {
namespace burstMine {
namespace generators {
namespace opencl {
namespace js {

class JsContextOpenclConfig {
	public:
		static v8::Handle<v8::Value> New(const cryo::burstMine::generators::opencl::ContextOpenclConfig& p_config);
		static cryo::burstMine::generators::opencl::ContextOpenclConfig FromObject(const v8::Handle<v8::Object>& p_object) throw (std::exception);
};

}}}}}

#endif
