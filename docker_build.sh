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

echo "autosetup is supported only on testnet/regtest"
echo "which network to setup?"
echo "1) regtest"
echo "2) testnet"
echo "default: testnet"
read answer

case "$answer" in
	1)
		network=regtest
		;;
	2)
		network=testnet
		;;
	*)
		echo "unknown option $answer, choosing testnet!"
		network=testnet
		;;
esac
echo "configuring for $network"

config=$(echo ${conf_template}|sed -r 's/_network_/'"$network"'/')

echo "running docker for you"
set -x
cp $config config/default.yaml
set +x
docker build -t 01cnode .

echo ""
echo "type ./run.sh to start the container"
echo "done."
