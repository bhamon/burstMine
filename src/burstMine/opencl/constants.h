#ifndef CRYO_BURST_MINE_OPENCL_CONSTANTS_H
#define CRYO_BURST_MINE_OPENCL_CONSTANTS_H

#include <string>

#include "../constants.h"

namespace cryo {
namespace burstMine {
namespace opencl {

const unsigned int GEN_SIZE = cryo::burstMine::PLOT_SIZE + 16;
const std::string KERNEL_PATH("kernel");

}}}

#endif
