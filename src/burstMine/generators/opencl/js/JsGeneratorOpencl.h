/*
	Burst mine
	Distributed graphical plotter and miner for Burst.
	Author: Cryo
	Bitcoin: 138gMBhCrNkbaiTCmUhP9HLU9xwn5QKZgD
	Burst: BURST-YA29-QCEW-QXC3-BKXDL
*/

#ifndef CRYO_BURST_MINE_GENERATORS_OPENCL_JS_JS_OPENCL_H
#define CRYO_BURST_MINE_GENERATORS_OPENCL_JS_JS_OPENCL_H

#include <v8.h>
#include <node.h>

namespace cryo {
namespace burstMine {
namespace generators {
namespace opencl {
namespace js {

void init(v8::Handle<v8::Object> p_exports);
v8::Handle<v8::Value> createContext(const v8::Arguments& p_args);
v8::Handle<v8::Value> listPlatforms(const v8::Arguments& p_args);
v8::Handle<v8::Value> listDevices(const v8::Arguments& p_args);

}}}}}

#endif
