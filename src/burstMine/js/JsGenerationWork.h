/*
	Burst mine
	Distributed graphical plotter and miner for Burst.
	Author: Cryo
	Bitcoin: 138gMBhCrNkbaiTCmUhP9HLU9xwn5QKZgD
	Burst: BURST-YA29-QCEW-QXC3-BKXDL
*/

#ifndef CRYO_BURST_MINE_JS_JS_GENERATION_WORK_H
#define CRYO_BURST_MINE_JS_JS_GENERATION_WORK_H

#include <exception>
#include <memory>
#include <node.h>
#include <v8.h>

#include "../GenerationWork.h"

namespace cryo {
namespace burstMine {
namespace js {

class JsGenerationWork {
	public:
		static v8::Handle<v8::Value> New(v8::Isolate* p_isolate, const cryo::burstMine::GenerationWork& p_work);
		static cryo::burstMine::GenerationWork FromObject(v8::Isolate* p_isolate, const v8::Handle<v8::Object>& p_object) throw (std::exception);
};

}}}

#endif
