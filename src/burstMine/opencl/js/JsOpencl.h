/*
	Burst mine
	Distributed graphical plotter and miner for Burst.
	Author: Cryo
	Bitcoin: 138gMBhCrNkbaiTCmUhP9HLU9xwn5QKZgD
	Burst: BURST-YA29-QCEW-QXC3-BKXDL
*/

#include <v8.h>
#include <node.h>

namespace cryo {
namespace burstMine {
namespace opencl {
namespace js {

void init(v8::Handle<v8::Object> p_exports, v8::Handle<v8::Object> p_module);
v8::Handle<v8::Value> create(const v8::Arguments& p_args);

}}}}

NODE_MODULE(opencl, cryo::burstMine::opencl::js::init);
