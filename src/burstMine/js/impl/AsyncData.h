/*
	Burst mine
	Distributed graphical plotter and miner for Burst.
	Author: Cryo
	Bitcoin: 138gMBhCrNkbaiTCmUhP9HLU9xwn5QKZgD
	Burst: BURST-YA29-QCEW-QXC3-BKXDL
*/

#ifndef CRYO_BURST_MINE_JS_IMPL_ASYNC_DATA_H
#define CRYO_BURST_MINE_JS_IMPL_ASYNC_DATA_H

#include <exception>
#include <initializer_list>
#include <node.h>

namespace cryo {
namespace burstMine {
namespace js {
namespace impl {

class AsyncData {
	public:
		v8::Isolate* isolate;
		v8::Persistent<v8::Function> callback;
		std::exception_ptr exception;

	public:
		virtual ~AsyncData();

		void triggerCallback(std::initializer_list<v8::Handle<v8::Value>> p_args);

	protected:
		virtual v8::Handle<v8::Value> unmarshalException() const;
};

}}}}

#endif
