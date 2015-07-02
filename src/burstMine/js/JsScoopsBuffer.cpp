/*
	Burst mine
	Distributed graphical plotter and miner for Burst.
	Author: Cryo
	Bitcoin: 138gMBhCrNkbaiTCmUhP9HLU9xwn5QKZgD
	Burst: BURST-YA29-QCEW-QXC3-BKXDL
*/

#include <node.h>
#include <stdexcept>

#include "JsScoopsBuffer.h"

namespace cryo {
namespace burstMine {
namespace js {

v8::Persistent<v8::Function> JsScoopsBuffer::s_constructor;

void JsScoopsBuffer::init(v8::Isolate* p_isolate) {
	v8::HandleScope scope(p_isolate);

	v8::Local<v8::FunctionTemplate> tpl = v8::FunctionTemplate::New(p_isolate);
	tpl->SetClassName(v8::String::NewFromUtf8(p_isolate, "ScoopsBuffer"));

	tpl->InstanceTemplate()->SetInternalFieldCount(1);
	tpl->InstanceTemplate()->SetAccessor(v8::String::NewFromUtf8(p_isolate, "size"), JsScoopsBuffer::getSize);

	tpl->PrototypeTemplate()->Set(v8::String::NewFromUtf8(p_isolate, "isClosed"), v8::FunctionTemplate::New(p_isolate, JsScoopsBuffer::isClosed));
	tpl->PrototypeTemplate()->Set(v8::String::NewFromUtf8(p_isolate, "close"), v8::FunctionTemplate::New(p_isolate, JsScoopsBuffer::close));

	s_constructor.Reset(p_isolate, tpl->GetFunction());
}

v8::Handle<v8::Value> JsScoopsBuffer::New(v8::Isolate* p_isolate, std::unique_ptr<cryo::burstMine::ScoopsBuffer>& p_buffer) {
	v8::EscapableHandleScope scope(p_isolate);

	v8::Local<v8::Function> constructor = v8::Local<v8::Function>::New(p_isolate, s_constructor);
	v8::Local<v8::Object> obj = constructor->NewInstance();
	obj->SetInternalField(0, v8::External::New(p_isolate, p_buffer.release()));

	return scope.Escape(obj);
}

bool JsScoopsBuffer::HasInstance(v8::Isolate* p_isolate, const v8::Handle<v8::Object>& p_object) {
	v8::HandleScope scope(p_isolate);

	v8::String::Utf8Value jsConstruct(p_object->GetConstructorName());
	std::string construct(*jsConstruct);

	return construct == "ScoopsBuffer" && p_object->InternalFieldCount() == 1;
}

cryo::burstMine::ScoopsBuffer* JsScoopsBuffer::FromObject(v8::Isolate* p_isolate, const v8::Handle<v8::Object>& p_object) throw (std::exception) {
	v8::HandleScope scope(p_isolate);

	v8::String::Utf8Value jsConstruct(p_object->GetConstructorName());
	std::string construct(*jsConstruct);

	if(construct != "ScoopsBuffer") {
		throw std::runtime_error("Invalid constructor name");
	} else if(p_object->InternalFieldCount() != 1) {
		throw std::runtime_error("Invalid internal fields count");
	}

	v8::Local<v8::External> ext = v8::Local<v8::External>::Cast(p_object->GetInternalField(0));
	return static_cast<cryo::burstMine::ScoopsBuffer*>(ext->Value());
}

void JsScoopsBuffer::unwrap(const v8::PropertyCallbackInfo<v8::Value>& p_info, std::function<void(cryo::burstMine::ScoopsBuffer*)> p_functor) {
	v8::HandleScope scope(p_info.GetIsolate());
	v8::Local<v8::Object> self = p_info.Holder();
	v8::Local<v8::External> ext = v8::Local<v8::External>::Cast(self->GetInternalField(0));
	if(ext->Value() == 0) {
		p_info.GetIsolate()->ThrowException(v8::Exception::Error(v8::String::NewFromUtf8(p_info.GetIsolate(), "Buffer closed")));
		return;
	}

	p_functor(static_cast<cryo::burstMine::ScoopsBuffer*>(ext->Value()));
}

void JsScoopsBuffer::unwrap(const v8::FunctionCallbackInfo<v8::Value>& p_info, std::function<void(cryo::burstMine::ScoopsBuffer*)> p_functor) {
	v8::HandleScope scope(p_info.GetIsolate());
	v8::Local<v8::Object> self = p_info.This();
	v8::Local<v8::External> ext = v8::Local<v8::External>::Cast(self->GetInternalField(0));
	if(ext->Value() == 0) {
		p_info.GetIsolate()->ThrowException(v8::Exception::Error(v8::String::NewFromUtf8(p_info.GetIsolate(), "Buffer closed")));
		return;
	}

	p_functor(static_cast<cryo::burstMine::ScoopsBuffer*>(ext->Value()));
}

void JsScoopsBuffer::getSize(v8::Local<v8::String> p_property, const v8::PropertyCallbackInfo<v8::Value>& p_info) {
	return unwrap(p_info, [&](cryo::burstMine::ScoopsBuffer* p_buffer) {
		return p_info.GetReturnValue().Set(v8::Number::New(p_info.GetIsolate(), static_cast<double>(p_buffer->getSize())));
	});
}

void JsScoopsBuffer::isClosed(const v8::FunctionCallbackInfo<v8::Value>& p_info) {
	v8::EscapableHandleScope scope(p_info.GetIsolate());
	v8::Local<v8::Object> self = p_info.This();
	v8::Local<v8::External> ext = v8::Local<v8::External>::Cast(self->GetInternalField(0));

	v8::Local<v8::Boolean> closed = v8::Boolean::New(p_info.GetIsolate(), ext->Value() != 0);
	p_info.GetReturnValue().Set(scope.Escape(closed));
}

void JsScoopsBuffer::close(const v8::FunctionCallbackInfo<v8::Value>& p_info) {
	v8::HandleScope scope(p_info.GetIsolate());

	return unwrap(p_info, [&](cryo::burstMine::ScoopsBuffer* p_buffer) {
		delete p_buffer;
		p_info.This()->SetInternalField(0, v8::External::New(p_info.GetIsolate(), 0));
	});
}

}}}
