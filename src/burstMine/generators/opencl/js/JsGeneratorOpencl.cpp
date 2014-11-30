/*
	Burst mine
	Distributed graphical plotter and miner for Burst.
	Author: Cryo
	Bitcoin: 138gMBhCrNkbaiTCmUhP9HLU9xwn5QKZgD
	Burst: BURST-YA29-QCEW-QXC3-BKXDL
*/

#include <memory>
#include <vector>

#include "../../../../opencl/OpenclPlatform.h"
#include "../../../../opencl/OpenclPlatform.h"
#include "../../../../opencl/OpenclError.h"
#include "../../../../opencl/js/JsOpenclPlatform.h"
#include "../../../../opencl/js/JsOpenclDevice.h"
#include "../../../../opencl/js/JsOpenclError.h"
#include "../ContextOpencl.h"
#include "JsGeneratorOpencl.h"
#include "JsContextOpencl.h"
#include "JsContextOpenclConfig.h"

namespace cryo {
namespace burstMine {
namespace generators {
namespace opencl {
namespace js {

void init(v8::Handle<v8::Object> p_exports) {
	JsContextOpencl::init();

	p_exports->Set(v8::String::New("createContext"), v8::FunctionTemplate::New(createContext)->GetFunction());
	p_exports->Set(v8::String::New("listPlatforms"), v8::FunctionTemplate::New(listPlatforms)->GetFunction());
	p_exports->Set(v8::String::New("listDevices"), v8::FunctionTemplate::New(listDevices)->GetFunction());
}

v8::Handle<v8::Value> createContext(const v8::Arguments& p_args) {
	v8::HandleScope scope;

	if(p_args.Length() < 1) {
		return scope.Close(v8::ThrowException(v8::Exception::Error(v8::String::New("Missing [config] parameter"))));
	} else if(!p_args[0]->IsObject()) {
		return scope.Close(v8::ThrowException(v8::Exception::Error(v8::String::New("Invalid [config] parameter"))));
	}

	v8::Local<v8::Object> config = p_args[0]->ToObject();

	try {
		cryo::burstMine::generators::opencl::ContextOpenclConfig config(JsContextOpenclConfig::FromObject(p_args[0]->ToObject()));

		return scope.Close(JsContextOpencl::New(
			std::unique_ptr<cryo::burstMine::generators::opencl::ContextOpencl>(new cryo::burstMine::generators::opencl::ContextOpencl(
				JsContextOpenclConfig::FromObject(p_args[0]->ToObject())
			))
		));
	} catch(const cryo::opencl::OpenclError& p_ex) {
		return scope.Close(v8::ThrowException(cryo::opencl::js::JsOpenclError::New(p_ex)));
	} catch(const std::exception& p_ex) {
		return scope.Close(v8::ThrowException(v8::Exception::Error(v8::String::New(p_ex.what()))));
	}
}

v8::Handle<v8::Value> listPlatforms(const v8::Arguments& p_args) {
	v8::HandleScope scope;

	try {
		std::vector<cryo::opencl::OpenclPlatform> platforms(cryo::opencl::OpenclPlatform::list());
		v8::Local<v8::Array> jsPlatforms = v8::Array::New(platforms.size());
		for(std::size_t i = 0 ; i < platforms.size() ; ++i) {
			jsPlatforms->Set(i, cryo::opencl::js::JsOpenclPlatform::New(platforms[i]));
		}

		return scope.Close(jsPlatforms);
	} catch(const cryo::opencl::OpenclError& p_ex) {
		return scope.Close(v8::ThrowException(cryo::opencl::js::JsOpenclError::New(p_ex)));
	}
}

v8::Handle<v8::Value> listDevices(const v8::Arguments& p_args) {
	v8::HandleScope scope;

	if(p_args.Length() < 1) {
		return scope.Close(v8::ThrowException(v8::Exception::Error(v8::String::New("Missing [platform] parameter"))));
	} else if(!p_args[0]->IsNumber()) {
		return scope.Close(v8::ThrowException(v8::Exception::Error(v8::String::New("Invalid [platform] parameter"))));
	}

	try {
		std::size_t platformId = p_args[0]->ToNumber()->Value();
		std::vector<cryo::opencl::OpenclPlatform> platforms(cryo::opencl::OpenclPlatform::list());
		if(platformId >= platforms.size()) {
			return scope.Close(v8::ThrowException(v8::Exception::Error(v8::String::New("Unknown [platform]"))));
		}

		std::vector<cryo::opencl::OpenclDevice> devices(cryo::opencl::OpenclDevice::list(platforms[platformId]));
		v8::Local<v8::Array> jsDevices = v8::Array::New(devices.size());
		for(std::size_t i = 0 ; i < devices.size() ; ++i) {
			jsDevices->Set(i, cryo::opencl::js::JsOpenclDevice::New(devices[i]));
		}

		return scope.Close(jsDevices);
	} catch(const cryo::opencl::OpenclError& p_ex) {
		return scope.Close(v8::ThrowException(cryo::opencl::js::JsOpenclError::New(p_ex)));
	}
}

}}}}}

NODE_MODULE(generator_opencl, cryo::burstMine::generators::opencl::js::init);
