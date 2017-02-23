# raspinodemon
tool to monitor raspberrypi based full bitcoin node
This is a webfrontend for a full bitcoin node. Bitcoind is running as the backend and this little app allows you to see the status of the node through an easy graphical web frontend. 

# Implemented pages:
- overview - shows basic info about the node like processor count, available memorry, active interfaces and connected peers
- mempool - page shows total mempool entries and the last 10 txes in realtime that the bitcoind client sent us through zeromq 
- blockexplorer - the latest block is shown as a json - no view implemented yet, just the backend interaction 

# todos:
- see issues page

# Author
Tomas Kanocz
