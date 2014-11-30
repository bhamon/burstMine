/*
	Burst mine
	Distributed graphical plotter and miner for Burst.
	Author: Cryo
	Bitcoin: 138gMBhCrNkbaiTCmUhP9HLU9xwn5QKZgD
	Burst: BURST-YA29-QCEW-QXC3-BKXDL
*/

#include <stdexcept>

#include "JsGenerationWork.h"

namespace cryo {
namespace burstMine {
namespace generators {
namespace js {

cryo::burstMine::generators::GenerationWork JsGenerationWork::FromObject(const v8::Handle<v8::Object>& p_object) throw (std::exception) {
	if(!p_object->Has(v8::String::New("address"))) {
		throw std::runtime_error("Missing [address] parameter");
	} else if(!p_object->Has(v8::String::New("offset"))) {
		throw std::runtime_error("Missing [offset] parameter");
	} else if(!p_object->Has(v8::String::New("workSize"))) {
		throw std::runtime_error("Missing [workSize] parameter");
	} else if(!p_object->Get(v8::String::New("address"))->IsNumber()) {
		throw std::runtime_error("Invalid [address] parameter");
	} else if(!p_object->Get(v8::String::New("offset"))->IsNumber()) {
		throw std::runtime_error("Invalid [offset] parameter");
	} else if(!p_object->Get(v8::String::New("workSize"))->IsNumber()) {
		throw std::runtime_error("Invalid [workSize] parameter");
	}

	return cryo::burstMine::generators::GenerationWork(
		p_object->Get(v8::String::New("address"))->ToNumber()->Value(),
		p_object->Get(v8::String::New("offset"))->ToNumber()->Value(),
		p_object->Get(v8::String::New("workSize"))->ToNumber()->Value()
	);
}

}}}}
