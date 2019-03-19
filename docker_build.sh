#!/bin/bash
set -eo pipefail

conf_template=docker/config/default._network_.yaml
network=testnet

echo "setup 01cnode for you?"
echo "y/N"
read answer

if [ "$answer" != "y" ];then
  echo "aborting."
  exit 0
fi

echo "which network to setup?"
echo "1) regtest"
echo "2) testnet"
echo "3) mainnet"
echo "default: $network"
read answer

case "$answer" in
	1)
		network=regtest
		;;
	2)
		network=testnet
		;;
	3)
		network=mainnet
		;;
	*)
		echo "unknown option $answer, choosing testnet!"
		network=testnet
		;;
esac
echo "configuring for $network"

# For macOS, use `sed -E`
if [ "$(uname)" == "Darwin" ]; then
	config=$(echo ${conf_template}|sed -E 's/_network_/'"$network"'/')
else
	config=$(echo ${conf_template}|sed -r 's/_network_/'"$network"'/')
fi

echo "running docker for you"
set -x
cp $config config/default.yaml
set +x
docker build -t 01cnode .

echo ""
echo "edit config/default.yaml to reflect your configuration"
echo "make sure you set the correct rpc username/password"
echo "type ./run.sh to start the container"
echo ""
echo "done."
