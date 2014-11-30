/*
	Burst mine
	Distributed graphical plotter and miner for Burst.
	Author: Cryo
	Bitcoin: 138gMBhCrNkbaiTCmUhP9HLU9xwn5QKZgD
	Burst: BURST-YA29-QCEW-QXC3-BKXDL
*/

#ifndef CRYO_BURST_MINE_GENERATORS_JS_JS_GENERATION_WORK_H
#define CRYO_BURST_MINE_GENERATORS_JS_JS_GENERATION_WORK_H

#include <exception>
#include <v8.h>
#include <node.h>

#include "../GenerationWork.h"

namespace cryo {
namespace burstMine {
namespace generators {
namespace js {

class JsGenerationWork {
	public:
		static cryo::burstMine::generators::GenerationWork FromObject(const v8::Handle<v8::Object>& p_object) throw (std::exception);
};

}}}}

#endif
