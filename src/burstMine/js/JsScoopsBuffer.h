/*
	Burst mine
	Distributed graphical plotter and miner for Burst.
	Author: Cryo
	Bitcoin: 138gMBhCrNkbaiTCmUhP9HLU9xwn5QKZgD
	Burst: BURST-YA29-QCEW-QXC3-BKXDL
*/

#ifndef CRYO_BURST_MINE_JS_JS_SCOOPS_BUFFER_H
#define CRYO_BURST_MINE_JS_JS_SCOOPS_BUFFER_H

#include <exception>
#include <memory>
#include <functional>
#include <node.h>

#include "../ScoopsBuffer.h"

namespace cryo {
namespace burstMine {
namespace js {

class JsScoopsBuffer {
	private:
		static v8::Persistent<v8::Function> s_constructor;

	public:
		static void init(v8::Isolate* p_isolate);

		static v8::Handle<v8::Value> New(v8::Isolate* p_isolate, std::unique_ptr<cryo::burstMine::ScoopsBuffer>& p_buffer);
		static bool HasInstance(v8::Isolate* p_isolate, const v8::Handle<v8::Object>& p_object);
		static cryo::burstMine::ScoopsBuffer* FromObject(v8::Isolate* p_isolate, const v8::Handle<v8::Object>& p_object) throw (std::exception);

	private:
		static void unwrap(const v8::PropertyCallbackInfo<v8::Value>& p_info, std::function<void(cryo::burstMine::ScoopsBuffer*)> p_functor);
		static void unwrap(const v8::FunctionCallbackInfo<v8::Value>& p_info, std::function<void(cryo::burstMine::ScoopsBuffer*)> p_functor);

		static void getSize(v8::Local<v8::String> p_property, const v8::PropertyCallbackInfo<v8::Value>& p_info);

		static void isClosed(const v8::FunctionCallbackInfo<v8::Value>& p_info);
		static void close(const v8::FunctionCallbackInfo<v8::Value>& p_info);
};

}}}

#endif
