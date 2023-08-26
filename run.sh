#!/bin/bash

docker run -p 5000:5000 \
      -it \
      --rm \
      -v `pwd`/config:/opt/bitgesell-node-monitor/config \
      -v `pwd`/logs:/opt/bitgesell-node-monitor/logs \
      01cnode
