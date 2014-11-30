/*
	Burst mine
	Distributed graphical plotter and miner for Burst.
	Author: Cryo
	Bitcoin: 138gMBhCrNkbaiTCmUhP9HLU9xwn5QKZgD
	Burst: BURST-YA29-QCEW-QXC3-BKXDL
*/

#include <stdexcept>

#include "JsContextOpenclConfig.h"

namespace cryo {
namespace burstMine {
namespace generators {
namespace opencl {
namespace js {

v8::Handle<v8::Value> JsContextOpenclConfig::New(const cryo::burstMine::generators::opencl::ContextOpenclConfig& p_config) {
	v8::HandleScope scope;

	v8::Local<v8::Object> obj = v8::Object::New();
	obj->Set(v8::String::New("platform"), v8::Integer::New(p_config.getPlatform()));
	obj->Set(v8::String::New("device"), v8::Integer::New(p_config.getDevice()));
	obj->Set(v8::String::New("globalWorkSize"), v8::Integer::New(p_config.getGlobalWorkSize()));
	obj->Set(v8::String::New("localWorkSize"), v8::Integer::New(p_config.getLocalWorkSize()));
	obj->Set(v8::String::New("hashesNumber"), v8::Integer::New(p_config.getHashesNumber()));
	obj->Set(v8::String::New("kernelsPath"), v8::String::New(p_config.getKernelsPath().c_str()));

	return scope.Close(obj);
}

cryo::burstMine::generators::opencl::ContextOpenclConfig JsContextOpenclConfig::FromObject(const v8::Handle<v8::Object>& p_object) throw (std::exception) {
	if(!p_object->Has(v8::String::New("platform"))) {
		throw std::runtime_error("Missing [platform] parameter");
	} else if(!p_object->Has(v8::String::New("device"))) {
		throw std::runtime_error("Missing [device] parameter");
	} else if(!p_object->Has(v8::String::New("globalWorkSize"))) {
		throw std::runtime_error("Missing [globalWorkSize] parameter");
	} else if(!p_object->Has(v8::String::New("localWorkSize"))) {
		throw std::runtime_error("Missing [localWorkSize] parameter");
	} else if(!p_object->Has(v8::String::New("hashesNumber"))) {
		throw std::runtime_error("Missing [hashesNumber] parameter");
	} else if(!p_object->Has(v8::String::New("kernelsPath"))) {
		throw std::runtime_error("Missing [kernelsPath] parameter");
	} else if(!p_object->Get(v8::String::New("platform"))->IsNumber()) {
		throw std::runtime_error("Invalid [platform] parameter");
	} else if(!p_object->Get(v8::String::New("device"))->IsNumber()) {
		throw std::runtime_error("Invalid [device] parameter");
	} else if(!p_object->Get(v8::String::New("globalWorkSize"))->IsNumber()) {
		throw std::runtime_error("Invalid [globalWorkSize] parameter");
	} else if(!p_object->Get(v8::String::New("localWorkSize"))->IsNumber()) {
		throw std::runtime_error("Invalid [localWorkSize] parameter");
	} else if(!p_object->Get(v8::String::New("hashesNumber"))->IsNumber()) {
		throw std::runtime_error("Invalid [hashesNumber] parameter");
	} else if(!p_object->Get(v8::String::New("kernelsPath"))->IsString()) {
		throw std::runtime_error("Invalid [kernelsPath] parameter");
	}

	v8::String::AsciiValue kernelsPath(p_object->Get(v8::String::New("kernelsPath")));
	return cryo::burstMine::generators::opencl::ContextOpenclConfig(
		p_object->Get(v8::String::New("platform"))->ToNumber()->Value(),
		p_object->Get(v8::String::New("device"))->ToNumber()->Value(),
		p_object->Get(v8::String::New("globalWorkSize"))->ToNumber()->Value(),
		p_object->Get(v8::String::New("localWorkSize"))->ToNumber()->Value(),
		p_object->Get(v8::String::New("hashesNumber"))->ToNumber()->Value(),
		*kernelsPath
	);
}

}}}}}
