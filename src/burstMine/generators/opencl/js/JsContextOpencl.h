/*
	Burst mine
	Distributed graphical plotter and miner for Burst.
	Author: Cryo
	Bitcoin: 138gMBhCrNkbaiTCmUhP9HLU9xwn5QKZgD
	Burst: BURST-YA29-QCEW-QXC3-BKXDL
*/

#ifndef CRYO_BURST_MINE_GENERATORS_OPENCL_JS_JS_CONTEXT_OPENCL_H
#define CRYO_BURST_MINE_GENERATORS_OPENCL_JS_JS_CONTEXT_OPENCL_H

#include <memory>
#include <functional>
#include <exception>
#include <v8.h>
#include <node.h>

#include "../../GenerationWork.h"
#include "../ContextOpencl.h"

namespace cryo {
namespace burstMine {
namespace generators {
namespace opencl {
namespace js {

class JsContextOpencl {
	private:
		static v8::Persistent<v8::Function> s_constructor;

	public:
		static void init();

		static v8::Handle<v8::Value> New(std::unique_ptr<cryo::burstMine::generators::opencl::ContextOpencl> p_context);

	private:
		static v8::Handle<v8::Value> unwrap(v8::Local<v8::String> p_property, const v8::AccessorInfo& p_info, std::function<v8::Handle<v8::Value>(cryo::burstMine::generators::opencl::ContextOpencl*)> p_functor);
		static v8::Handle<v8::Value> unwrap(const v8::Arguments& p_args, std::function<v8::Handle<v8::Value>(cryo::burstMine::generators::opencl::ContextOpencl*)> p_functor);

		static v8::Handle<v8::Value> getConfig(v8::Local<v8::String> p_property, const v8::AccessorInfo& p_info);
		static v8::Handle<v8::Value> getPlatform(v8::Local<v8::String> p_property, const v8::AccessorInfo& p_info);
		static v8::Handle<v8::Value> getDevice(v8::Local<v8::String> p_property, const v8::AccessorInfo& p_info);

		static v8::Handle<v8::Value> computePlots(const v8::Arguments& p_args);
		static v8::Handle<v8::Value> isClosed(const v8::Arguments& p_args);
		static v8::Handle<v8::Value> close(const v8::Arguments& p_args);
};

struct AsyncData {
	cryo::burstMine::generators::opencl::ContextOpencl* context;
	std::unique_ptr<cryo::burstMine::generators::GenerationWork> work;
	v8::Persistent<v8::Function> callback;
	std::exception_ptr exception;
};

}}}}}

#endif
