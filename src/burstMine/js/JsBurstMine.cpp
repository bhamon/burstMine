/*
	Burst mine
	Distributed graphical plotter and miner for Burst.
	Author: Cryo
	Bitcoin: 138gMBhCrNkbaiTCmUhP9HLU9xwn5QKZgD
	Burst: BURST-YA29-QCEW-QXC3-BKXDL
*/

#include "JsBurstMine.h"
#include "JsScoopsBuffer.h"

namespace cryo {
namespace burstMine {
namespace js {

void JsBurstMine::init(v8::Handle<v8::Object> p_exports) {
	cryo::burstMine::js::JsScoopsBuffer::init(v8::Isolate::GetCurrent());

	p_exports->Set(v8::String::NewFromUtf8(v8::Isolate::GetCurrent(), "createScoopsBuffer"), v8::FunctionTemplate::New(v8::Isolate::GetCurrent(), createScoopsBuffer)->GetFunction());
}

void JsBurstMine::createScoopsBuffer(const v8::FunctionCallbackInfo<v8::Value>& p_info) {
	v8::HandleScope scope(p_info.GetIsolate());

	if(p_info.Length() < 1) {
		p_info.GetIsolate()->ThrowException(v8::Exception::Error(v8::String::NewFromUtf8(p_info.GetIsolate(), "Missing [size] parameter")));
		return;
	} else if(!p_info[0]->IsNumber()) {
		p_info.GetIsolate()->ThrowException(v8::Exception::Error(v8::String::NewFromUtf8(p_info.GetIsolate(), "Invalid [size] parameter")));
		return;
	}

	try {
		std::unique_ptr<cryo::burstMine::ScoopsBuffer> buffer(new ScoopsBuffer(static_cast<std::size_t>(p_info[0]->NumberValue())));
		v8::Handle<v8::Value> jsBuffer = JsScoopsBuffer::New(p_info.GetIsolate(), buffer);
		p_info.GetReturnValue().Set(jsBuffer);
	} catch(const std::exception& p_ex) {
		p_info.GetIsolate()->ThrowException(v8::Exception::Error(v8::String::NewFromUtf8(p_info.GetIsolate(), p_ex.what())));
		return;
	}
}

}}}

NODE_MODULE(burstMine, cryo::burstMine::js::JsBurstMine::init);
