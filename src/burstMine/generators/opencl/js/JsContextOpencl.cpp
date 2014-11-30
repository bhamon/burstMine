/*
	Burst mine
	Distributed graphical plotter and miner for Burst.
	Author: Cryo
	Bitcoin: 138gMBhCrNkbaiTCmUhP9HLU9xwn5QKZgD
	Burst: BURST-YA29-QCEW-QXC3-BKXDL
*/

#include "../../../../opencl/OpenclError.h"
#include "../../../../opencl/js/JsOpenclPlatform.h"
#include "../../../../opencl/js/JsOpenclDevice.h"
#include "../../../../opencl/js/JsOpenclError.h"
#include "../../js/JsGenerationWork.h"
#include "JsContextOpencl.h"
#include "JsContextOpenclConfig.h"

namespace cryo {
namespace burstMine {
namespace generators {
namespace opencl {
namespace js {

v8::Persistent<v8::Function> JsContextOpencl::s_constructor;

void JsContextOpencl::init() {
	v8::Local<v8::FunctionTemplate> tpl = v8::FunctionTemplate::New();
	tpl->SetClassName(v8::String::New("ContextOpencl"));

	tpl->InstanceTemplate()->SetInternalFieldCount(1);
	tpl->InstanceTemplate()->SetAccessor(v8::String::New("config"), JsContextOpencl::getConfig);
//	tpl->InstanceTemplate()->SetAccessor(v8::String::New("buffer"), JsContextOpencl::getBuffer);
	tpl->InstanceTemplate()->SetAccessor(v8::String::New("platform"), JsContextOpencl::getPlatform);
	tpl->InstanceTemplate()->SetAccessor(v8::String::New("device"), JsContextOpencl::getDevice);

	tpl->PrototypeTemplate()->Set(v8::String::New("computePlots"), v8::FunctionTemplate::New(JsContextOpencl::computePlots));
	tpl->PrototypeTemplate()->Set(v8::String::New("isClosed"), v8::FunctionTemplate::New(JsContextOpencl::isClosed));
	tpl->PrototypeTemplate()->Set(v8::String::New("close"), v8::FunctionTemplate::New(JsContextOpencl::close));

	s_constructor = v8::Persistent<v8::Function>::New(tpl->GetFunction());
}

v8::Handle<v8::Value> JsContextOpencl::New(std::unique_ptr<cryo::burstMine::generators::opencl::ContextOpencl> p_context) {
	v8::HandleScope scope;

	v8::Local<v8::Object> obj = s_constructor->NewInstance();
	obj->SetInternalField(0, v8::External::New(p_context.release()));

	return scope.Close(obj);
}

v8::Handle<v8::Value> JsContextOpencl::unwrap(v8::Local<v8::String> p_property, const v8::AccessorInfo& p_info, std::function<v8::Handle<v8::Value>(cryo::burstMine::generators::opencl::ContextOpencl*)> p_functor) {
	v8::HandleScope scope;
	v8::Local<v8::Object> self = p_info.Holder();
	v8::Local<v8::External> ext = v8::Local<v8::External>::Cast(self->GetInternalField(0));
	if(ext->Value() == 0) {
		return scope.Close(v8::ThrowException(v8::Exception::Error(v8::String::New("Context closed"))));
	}

	cryo::burstMine::generators::opencl::ContextOpencl* context = static_cast<cryo::burstMine::generators::opencl::ContextOpencl*>(ext->Value());

	return scope.Close(p_functor(context));
}

v8::Handle<v8::Value> JsContextOpencl::unwrap(const v8::Arguments& p_args, std::function<v8::Handle<v8::Value>(cryo::burstMine::generators::opencl::ContextOpencl*)> p_functor) {
	v8::HandleScope scope;
	v8::Local<v8::Object> self = p_args.This();
	v8::Local<v8::External> ext = v8::Local<v8::External>::Cast(self->GetInternalField(0));
	if(ext->Value() == 0) {
		return scope.Close(v8::ThrowException(v8::Exception::Error(v8::String::New("Context closed"))));
	}

	cryo::burstMine::generators::opencl::ContextOpencl* context = static_cast<cryo::burstMine::generators::opencl::ContextOpencl*>(ext->Value());

	return scope.Close(p_functor(context));
}

v8::Handle<v8::Value> JsContextOpencl::getConfig(v8::Local<v8::String> p_property, const v8::AccessorInfo& p_info) {
	return unwrap(p_property, p_info, [](cryo::burstMine::generators::opencl::ContextOpencl* p_context) {
		return JsContextOpenclConfig::New(p_context->getConfig());
	});
}

v8::Handle<v8::Value> JsContextOpencl::getPlatform(v8::Local<v8::String> p_property, const v8::AccessorInfo& p_info) {
	return unwrap(p_property, p_info, [](cryo::burstMine::generators::opencl::ContextOpencl* p_context) {
		return cryo::opencl::js::JsOpenclPlatform::New(p_context->getPlatform());
	});
}

v8::Handle<v8::Value> JsContextOpencl::getDevice(v8::Local<v8::String> p_property, const v8::AccessorInfo& p_info) {
	return unwrap(p_property, p_info, [](cryo::burstMine::generators::opencl::ContextOpencl* p_context) {
		return cryo::opencl::js::JsOpenclDevice::New(p_context->getDevice());
	});
}

v8::Handle<v8::Value> JsContextOpencl::computePlots(const v8::Arguments& p_args) {
	v8::HandleScope scope;

	if(p_args.Length() < 1) {
		return scope.Close(v8::ThrowException(v8::Exception::Error(v8::String::New("Missing [config] parameter"))));
	} else if(p_args.Length() < 2) {
		return scope.Close(v8::ThrowException(v8::Exception::Error(v8::String::New("Missing [callback] parameter"))));
	} else if(!p_args[0]->IsObject()) {
		return scope.Close(v8::ThrowException(v8::Exception::Error(v8::String::New("Invalid [config] parameter"))));
	} else if(!p_args[1]->IsFunction()) {
		return scope.Close(v8::ThrowException(v8::Exception::Error(v8::String::New("Invalid [callback] parameter"))));
	}

	return unwrap(p_args, [&](cryo::burstMine::generators::opencl::ContextOpencl* p_context) {
		std::unique_ptr<AsyncData> asyncData(new AsyncData);
		asyncData->context = p_context;
		asyncData->work = std::unique_ptr<cryo::burstMine::generators::GenerationWork>(
			new cryo::burstMine::generators::GenerationWork(cryo::burstMine::generators::js::JsGenerationWork::FromObject(p_args[0]->ToObject()))
		);
		asyncData->callback = v8::Persistent<v8::Function>::New(v8::Local<v8::Function>::Cast(p_args[1]));

		uv_work_t* work = new uv_work_t;
		work->data = static_cast<void*>(asyncData.release());

		uv_queue_work(
			uv_default_loop(),
			work,
			[](uv_work_t* p_work) {
				AsyncData* asyncData = static_cast<AsyncData*>(p_work->data);

				try {
					asyncData->context->computePlots(
						asyncData->work->getAddress(),
						asyncData->work->getOffset(),
						asyncData->work->getWorkSize()
					);

					asyncData->context->bufferPlots(asyncData->work->getWorkSize());
				} catch(const std::exception& p_ex) {
					asyncData->exception = std::current_exception();
				}
			},
			[](uv_work_t* p_work, int p_status) {
				v8::HandleScope scope;
				v8::Handle<v8::Value> error = v8::Undefined();
				AsyncData* asyncData = static_cast<AsyncData*>(p_work->data);

				try {
					if(asyncData->exception) {
						std::rethrow_exception(asyncData->exception);
					}
				} catch(const cryo::opencl::OpenclError& p_ex) {
					error = cryo::opencl::js::JsOpenclError::New(p_ex);
				} catch(const std::exception& p_ex) {
					error = v8::Exception::Error(v8::String::New(p_ex.what()));
				}

				v8::TryCatch tryCatch;
				v8::Handle<v8::Value> args[] = {error};
				asyncData->callback->Call(v8::Context::GetCurrent()->Global(), 1, args);

				asyncData->callback.Dispose();
				delete asyncData;
				delete p_work;

				if(tryCatch.HasCaught()) {
					node::FatalException(tryCatch);
				}
			}
		);

		return v8::Undefined();
	});
}

v8::Handle<v8::Value> JsContextOpencl::isClosed(const v8::Arguments& p_args) {
	v8::HandleScope scope;
	v8::Local<v8::Object> self = p_args.This();
	v8::Local<v8::External> ext = v8::Local<v8::External>::Cast(self->GetInternalField(0));

	return scope.Close(v8::Boolean::New(ext->Value() != 0));
}

v8::Handle<v8::Value> JsContextOpencl::close(const v8::Arguments& p_args) {
	return unwrap(p_args, [&](cryo::burstMine::generators::opencl::ContextOpencl* p_context) {
		delete p_context;
		p_args.This()->SetInternalField(0, v8::External::New(0));

		return v8::Undefined();
	});
}

}}}}}
