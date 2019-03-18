# 01C Node

This is a webfrontend for a full bitcoin node. Bitcoin-core is running as the backend and this little app allows you to see the status of the node through an easy graphical web frontend. 

# demo page
demo page can be found at http://node.ispol.sk

# Implemented pages:
- overview - shows basic info about the node like processor count, available memorry, active interfaces, connected peers, client version, number of blocks, synced state, etc.
![overview screenshot](doc/img/overview.png "Overview")
- mempool - page shows total mempool entries, size of the mempool, to how many blocks would the transactions roughly fit, transaction size, weight and if the transaction has a witness (is segwit). Shows the last 10 txes in realtime that the bitcoind client sent us through zeromq. 
![mempool screenshot](doc/img/mempool.png "Mempool")
- block explorer - the 10 latest blocks are shown, their size, weight, timestamp 
![blockexplorer screenshot](doc/img/blockexplorer.png "Blockexplorer")
- transaction explorer - details about a TX are shown once the hash is included in the search bar
![transactionexplorer screenshot](doc/img/txexplorer.png "Transactionexplorer")

# docker setup (Linux):
 - download [bitcoin-core](https://bitcoin.org/en/download)
 - install docker
 - clone this repo:
 
 ```
 git clone https://github.com/KanoczTomas/01Cnode.git && cd 01Cnode
 ```
 
 - then run helper script:
 
 ```
 ./docker_build.sh
 ```
 
example output (note first time build takes some time and outputs much more logs):

``` 
 setup 01cnode for you?
y/N
y
which network to setup?
1) regtest
2) testnet
3) mainnet
default: testnet
3
configuring for mainnet
running docker for you
+ cp docker/config/default.mainnet.yaml config/default.yaml
+ set +x
Sending build context to Docker daemon  2.015MB
Step 1/9 : FROM node:8
 ---> 6a23819b932c
Step 2/9 : WORKDIR /bitcoin
 ---> Using cache
 ---> 7a589cde47ab
Step 3/9 : WORKDIR /opt/01cnode
 ---> Using cache
 ---> 5f2c70189f7d
Step 4/9 : COPY package*.json ./
 ---> Using cache
 ---> 32cc927f79c3
Step 5/9 : RUN npm install
 ---> Using cache
 ---> 3199aab4fd22
Step 6/9 : COPY . .
 ---> e8cbaa85ef78
Step 7/9 : RUN npm run build
 ---> Running in 994ac8ab90c5

> 01Cnode@0.1.10 build /opt/01cnode
> browserify js/app.js | uglifyjs -mc warnings=false > static/bundle.js

(node:17) [DEP0022] DeprecationWarning: os.tmpDir() is deprecated. Use os.tmpdir() instead.
Removing intermediate container 994ac8ab90c5
 ---> 16b123781738
Step 8/9 : CMD node server.js
 ---> Running in 4ad0028f9c3f
Removing intermediate container 4ad0028f9c3f
 ---> 3806d8867410
Step 9/9 : EXPOSE 5000
 ---> Running in cd842bbe15c7
Removing intermediate container cd842bbe15c7
 ---> 5b80bf6d54a5
Successfully built 5b80bf6d54a5
Successfully tagged 01cnode:latest

edit config/default.yaml to reflect your configuration
make sure you set the correct rpc username/password
type ./run.sh to start the container

done.
 ```
 - edit `config/default.yaml` rpc information. Change it to whatever you supplied to `bitcoind`. All other configuration options were prefilled for you. Do not change them unless you know what you are doing.
 
 ```
  rpc_username: secretuser
  rpc_password: secretpass

 ```
 - run the helper script that starts the container
 
 ```
 ./run.sh
```

example output:

```
user@host:~/bin/01Cnode$ ./run.sh 
logging to file: /opt/01cnode/server.log
server is now running on port 5000
```

 - point your browser to http://localhost:5000
 
 - hit `ctrl+c` if you want to finish 01cnode
  
>_a PR for a windows script that helps with docker setup is much appreciated!_

# manual setup:
- download [bitcoin-core](https://bitcoin.org/en/download)

- if building from source, build it with zeromq support (zeromq is needed for the mempool page to work, in case you do not want to see realtime tranasctions this step can be ommited). If you use the binary from the official site that has zeromq already in it!

- make some extra bitcoin configuration to make the frontend work (note: turning on txindex will require to reindex the whole blockchain which takes a lot of time, you were warned :). You can ignore that setting, the TransactionExplorer page will only show your transactions in that case. ). I recommend running this frontend with bitcoin-core launched with -disablewallet (or add disablewallet=1 to bitcoin.conf) in case you did not read the source code of this tool fully - you should never trust anyone
```
daemon=1
rpcuser=<some user>
rpcpassword=<a very secret password>
server=1
rest=1
zmqpubhashtx=tcp://127.0.0.1:28332
zmqpubhashblock=tcp://127.0.0.1:28332
zmqpubrawblock=tcp://127.0.0.1:28332
zmqpubrawtx=tcp://127.0.0.1:28332
txindex=1
disablewallet=1
```
- get this repo via git and edit the file config/default.yaml - the credentials should be the same as in your bitcoin.conf. Also adjust the host and port accordingly. Make sure you set your home dir if not the default in the config file.
```
RPC:
  host: localhost
  port: 8332
  rpc_username: <some username>
  rpc_password: <a very secret password>
```
- then install the dependencies:
```
npm install
```
- build the javascript bundle file
```
npm run build
```
- and start the web frontend (please note it will run in a console, do not close it or your webserver will quit, still in developement, will be fixed later to deamonize)
```
node server.js
```
- browse to http://localhost:5000 to view the page (assuming bitcoin-core and the web frontend are on the same node)

# todos:
- see issues page

# donations:
please consider donating bitcoins if you like the project:

![bitcoin:3Fomcsyhc2gb5vyJLitJC8FXovBAnfWuAK](doc/img/donation.svg "bitcoin:3Fomcsyhc2gb5vyJLitJC8FXovBAnfWuAK")

**bitcoin 3Fomcsyhc2gb5vyJLitJC8FXovBAnfWuAK**

# author
Tomas Kanocz
