/*
	Burst mine
	Distributed graphical plotter and miner for Burst.
	Author: Cryo
	Bitcoin: 138gMBhCrNkbaiTCmUhP9HLU9xwn5QKZgD
	Burst: BURST-YA29-QCEW-QXC3-BKXDL
*/

#include <stdexcept>

#include "JsPlots.h"

namespace cryo {
namespace burstMine {
namespace js {

v8::Handle<v8::Value> JsPlots::New(v8::Isolate* p_isolate, const cryo::burstMine::Plots& p_plots) {
	v8::EscapableHandleScope scope(p_isolate);

	v8::Local<v8::Object> obj = v8::Object::New(p_isolate);
	obj->Set(v8::String::NewFromUtf8(p_isolate, "address"), v8::Number::New(p_isolate, static_cast<double>(p_plots.getAddress())));
	obj->Set(v8::String::NewFromUtf8(p_isolate, "offset"), v8::Number::New(p_isolate, static_cast<double>(p_plots.getOffset())));
	obj->Set(v8::String::NewFromUtf8(p_isolate, "number"), v8::Integer::New(p_isolate, p_plots.getNumber()));

	return scope.Escape(obj);
}

cryo::burstMine::Plots JsPlots::FromObject(v8::Isolate* p_isolate, const v8::Handle<v8::Object>& p_object) throw (std::exception) {
	v8::HandleScope scope(p_isolate);

	if(!p_object->Has(v8::String::NewFromUtf8(p_isolate, "address"))) {
		throw std::runtime_error("Missing [address] parameter");
	} else if(!p_object->Has(v8::String::NewFromUtf8(p_isolate, "offset"))) {
		throw std::runtime_error("Missing [offset] parameter");
	} else if(!p_object->Has(v8::String::NewFromUtf8(p_isolate, "number"))) {
		throw std::runtime_error("Missing [number] parameter");
	} else if(!p_object->Get(v8::String::NewFromUtf8(p_isolate, "address"))->IsNumber()) {
		throw std::runtime_error("Invalid [address] parameter");
	} else if(!p_object->Get(v8::String::NewFromUtf8(p_isolate, "offset"))->IsNumber()) {
		throw std::runtime_error("Invalid [offset] parameter");
	} else if(!p_object->Get(v8::String::NewFromUtf8(p_isolate, "number"))->IsNumber()) {
		throw std::runtime_error("Invalid [number] parameter");
	}

	return cryo::burstMine::Plots(
		static_cast<unsigned long long>(p_object->Get(v8::String::NewFromUtf8(p_isolate, "address"))->ToNumber()->Value()),
		static_cast<unsigned long long>(p_object->Get(v8::String::NewFromUtf8(p_isolate, "offset"))->ToNumber()->Value()),
		static_cast<unsigned int>(p_object->Get(v8::String::NewFromUtf8(p_isolate, "number"))->ToInteger()->Value())
	);
}

}}}
