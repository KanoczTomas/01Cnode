#!/bin/bash

docker run -p 5000:5000 \
      -it \
      --rm \
      -v `pwd`/config:/opt/01cnode/config \
      -v `pwd`/logs:/opt/01cnode/logs \
      01cnode
