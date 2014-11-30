#include <vector>

#include "JsOpenclDevice.h"

namespace cryo {
namespace opencl {
namespace js {

v8::Handle<v8::Value> JsOpenclDevice::New(const cryo::opencl::OpenclDevice& p_device) {
	v8::HandleScope scope;

	std::vector<std::size_t> maxWorkItemSizes(p_device.getMaxWorkItemSizes());
	v8::Local<v8::Array> jsMaxWorkItemSizes = v8::Array::New(maxWorkItemSizes.size());
	for(std::size_t i = 0 ; i < maxWorkItemSizes.size() ; ++i) {
		jsMaxWorkItemSizes->Set(i, v8::Integer::New(maxWorkItemSizes[i]));
	}

	v8::Local<v8::Object> obj = v8::Object::New();
	obj->Set(v8::String::New("type"), v8::String::New(p_device.getType().c_str()));
	obj->Set(v8::String::New("name"), v8::String::New(p_device.getName().c_str()));
	obj->Set(v8::String::New("vendor"), v8::String::New(p_device.getVendor().c_str()));
	obj->Set(v8::String::New("version"), v8::String::New(p_device.getVersion().c_str()));
	obj->Set(v8::String::New("driverVersion"), v8::String::New(p_device.getDriverVersion().c_str()));
	obj->Set(v8::String::New("maxClockFrequency"), v8::Integer::New(p_device.getMaxClockFrequency()));
	obj->Set(v8::String::New("maxComputeUnits"), v8::Integer::New(p_device.getMaxComputeUnits()));
	obj->Set(v8::String::New("globalMemorySize"), v8::Number::New(p_device.getGlobalMemorySize()));
	obj->Set(v8::String::New("maxMemoryAllocationSize"), v8::Number::New(p_device.getMaxMemoryAllocationSize()));
	obj->Set(v8::String::New("maxWorkGroupSize"), v8::Integer::New(p_device.getMaxWorkGroupSize()));
	obj->Set(v8::String::New("localMemorySize"), v8::Number::New(p_device.getLocalMemorySize()));
	obj->Set(v8::String::New("maxWorkItemSizes"), jsMaxWorkItemSizes);

	return scope.Close(obj);
}

}}}