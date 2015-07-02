/*
	Burst mine
	Distributed graphical plotter and miner for Burst.
	Author: Cryo
	Bitcoin: 138gMBhCrNkbaiTCmUhP9HLU9xwn5QKZgD
	Burst: BURST-YA29-QCEW-QXC3-BKXDL
*/

#ifndef CRYO_BURST_MINE_JS_JS_BURST_MINE_H
#define CRYO_BURST_MINE_JS_JS_BURST_MINE_H

#include <node.h>

#include "../ScoopsBuffer.h"

namespace cryo {
namespace burstMine {
namespace js {

class JsBurstMine {
	public:
		static void init(v8::Handle<v8::Object> p_exports);

	private:
		static void createScoopsBuffer(const v8::FunctionCallbackInfo<v8::Value>& p_info);
};

}}}

#endif
