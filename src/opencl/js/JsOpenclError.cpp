#include "../OpenclError.h"
#include "JsOpenclError.h"

namespace cryo {
namespace opencl {
namespace js {

v8::Handle<v8::Value> JsOpenclError::New(const cryo::opencl::OpenclError& p_error) {
	v8::HandleScope scope;

	v8::Local<v8::Object> error = v8::Exception::Error(v8::String::New(p_error.what()))->ToObject();
	error->Set(v8::String::New("name"), v8::String::New("OpenclError"));
	error->Set(v8::String::New("code"), v8::Integer::New(p_error.getCode()));
	error->Set(v8::String::New("codeString"), v8::String::New(p_error.getCodeString().c_str()));

	return scope.Close(error);
}

}}}
