#include "JsOpenclPlatform.h"

namespace cryo {
namespace opencl {
namespace js {

v8::Handle<v8::Value> JsOpenclPlatform::New(const cryo::opencl::OpenclPlatform& p_platform) {
	v8::HandleScope scope;

	v8::Local<v8::Object> obj = v8::Object::New();
	obj->Set(v8::String::New("name"), v8::String::New(p_platform.getName().c_str()));
	obj->Set(v8::String::New("vendor"), v8::String::New(p_platform.getVendor().c_str()));
	obj->Set(v8::String::New("version"), v8::String::New(p_platform.getVersion().c_str()));

	return scope.Close(obj);
}

}}}