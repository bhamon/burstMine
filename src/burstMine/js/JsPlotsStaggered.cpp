/*
	Burst mine
	Distributed graphical plotter and miner for Burst.
	Author: Cryo
	Bitcoin: 138gMBhCrNkbaiTCmUhP9HLU9xwn5QKZgD
	Burst: BURST-YA29-QCEW-QXC3-BKXDL
*/

#include <stdexcept>

#include "JsPlots.h"
#include "JsPlotsStaggered.h"

namespace cryo {
namespace burstMine {
namespace js {

v8::Handle<v8::Value> JsPlotsStaggered::New(v8::Isolate* p_isolate, const cryo::burstMine::PlotsStaggered& p_plots) {
	v8::EscapableHandleScope scope(p_isolate);

	v8::Local<v8::Object> obj = JsPlots::New(p_isolate, p_plots)->ToObject();

	v8::Local<v8::Object> params = v8::Object::New(p_isolate);
	params->Set(v8::String::NewFromUtf8(p_isolate, "staggerSize"), v8::Number::New(p_isolate, static_cast<double>(p_plots.getStaggerSize())));

	obj->Set(v8::String::NewFromUtf8(p_isolate, "params"), params);

	return scope.Escape(obj);
}

cryo::burstMine::PlotsStaggered JsPlotsStaggered::FromObject(v8::Isolate* p_isolate, const v8::Handle<v8::Object>& p_object) throw (std::exception) {
	v8::HandleScope scope(p_isolate);

	cryo::burstMine::Plots plots(JsPlots::FromObject(p_isolate, p_object));

	if(!p_object->Has(v8::String::NewFromUtf8(p_isolate, "params"))) {
		throw std::runtime_error("Missing [params] parameter");
	} else if(!p_object->Get(v8::String::NewFromUtf8(p_isolate, "params"))->IsObject()) {
		throw std::runtime_error("Invalid [params] parameter");
	}

	v8::Local<v8::Object> params = p_object->Get(v8::String::NewFromUtf8(p_isolate, "params"))->ToObject();

	if(!params->Has(v8::String::NewFromUtf8(p_isolate, "staggerSize"))) {
		throw std::runtime_error("Missing [params.staggerSize] parameter");
	} else if(!params->Get(v8::String::NewFromUtf8(p_isolate, "staggerSize"))->IsNumber()) {
		throw std::runtime_error("Invalid [params.staggerSize] parameter");
	}

	return cryo::burstMine::PlotsStaggered(
		plots,
		static_cast<std::size_t>(params->Get(v8::String::NewFromUtf8(p_isolate, "staggerSize"))->ToNumber()->Value())
	);
}

}}}
