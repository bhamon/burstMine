/*
	Burst mine
	Distributed graphical plotter and miner for Burst.
	Author: Cryo
	Bitcoin: 138gMBhCrNkbaiTCmUhP9HLU9xwn5QKZgD
	Burst: BURST-YA29-QCEW-QXC3-BKXDL
*/

#include <memory>

#include "AsyncData.h"

namespace cryo {
namespace burstMine {
namespace js {
namespace impl {

AsyncData::~AsyncData() {
	callback.Reset();
}

void AsyncData::triggerCallback(std::initializer_list<v8::Handle<v8::Value>> p_args) {
	v8::HandleScope scope(isolate);
	v8::Handle<v8::Value> error = unmarshalException();

	v8::TryCatch tryCatch;
	std::unique_ptr<v8::Handle<v8::Value>[]> args(new v8::Handle<v8::Value>[p_args.size() + 1]);
	args[0] = error;

	std::initializer_list<v8::Handle<v8::Value>>::iterator it(p_args.begin());
	for(std::size_t i = 0 ; it != p_args.end() ; ++i, it++) {
		args[i + 1] = *it;
	}

	v8::Local<v8::Function> cb = v8::Local<v8::Function>::New(isolate, callback);
	cb->Call(isolate->GetCurrentContext()->Global(), static_cast<int>(p_args.size() + 1), args.get());

	if(tryCatch.HasCaught()) {
		node::FatalException(tryCatch);
	}
}

v8::Handle<v8::Value> AsyncData::unmarshalException() const {
	v8::Handle<v8::Value> error = v8::Undefined(isolate);

	try {
		if(exception) {
			std::rethrow_exception(exception);
		}
	} catch(const std::exception& p_ex) {
		error = v8::Exception::Error(v8::String::NewFromUtf8(isolate, p_ex.what()));
	}

	return error;
}

}}}}
