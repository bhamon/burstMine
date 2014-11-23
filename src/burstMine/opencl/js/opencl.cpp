/*
	Burst mine
	Distributed graphical plotter and miner for Burst.
	Author: Cryo
	Bitcoin: 138gMBhCrNkbaiTCmUhP9HLU9xwn5QKZgD
	Burst: BURST-YA29-QCEW-QXC3-BKXDL
*/

#include "opencl.h"

namespace cryo {
namespace burstMine {
namespace opencl {

void init(v8::Handle<v8::Object> p_exports, v8::Handle<v8::Object> p_module) {
	p_module->Set(v8::String::New("exports"), FunctionTemplate::New(create)->GetFunction());
}

v8::Handle<v8::Value> create(const v8::Arguments& p_args) {
	v8::HandleScope scope;

	if(p_args.Length() < 1) {
		return scope.Close(v8::ThrowException(v8::Exceptions::Error(v8::String::New("Missing config parameter"))));
	} else if(!p_args[0].IsObject()) {
		return scope.Close(v8::ThrowException(v8::Exceptions::Error(v8::String::New("Invalid config parameter"))));
	}

	// TODO
}

}}}
