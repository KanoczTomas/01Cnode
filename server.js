var config = require("config");
var express = require("express");
var app = express();
var morgan = require("morgan");
var bodyParser = require("body-parser");
var api = require("./js/api");
var cluster = require("cluster");
var zmq = require("zeromq")
var sock = zmq.socket("sub");
var os = require("os");
var server = require("http").createServer(app);
var io = require("socket.io")(server);
var compression = reqiore("compression");


// Code to run if we're in the master process
if (cluster.isMaster) {

    // Count the machine's CPUs
    var cpuCount = os.cpus().length;

    // Create a worker for each CPU
    for (var i = 0; i < cpuCount; i += 1) {
        cluster.fork();
    }
    
    // Listen for dying workers
    cluster.on('exit', function (worker) {

        // Replace the dead worker,
        // we're not sentimental
        console.log('Worker %d died :(', worker.id);
        cluster.fork();
    });

// Code to run if we're in a worker process
} else {

    server.listen(config.get('Web.port'));
    app.use(compression());
    app.use(morgan("dev"));
    app.use(bodyParser.json());
    console.log("server is now running on port " + config.get('Web.port'));

    app.use('/api/', api);
    app.use('/', express.static(__dirname + '/static'));

    if(process.env.NODE_ENV !== 'production') {
      process.once('uncaughtException', function(err) {
        console.error('FATAL: Uncaught exception.');
        console.error(err.stack||err);
        setTimeout(function(){
          process.exit(1);
        }, 100);
      });
    }

    sock.connect(config.get('Zmq.socket'));
    config.get('Zmq.events').forEach(function(event){
       sock.subscribe(event); 
    });
    
    io.on('connection', function(data){
        //console.log("data is: " + data) ;
        //console.log(data);
    });
    sock.on('message', function(topic, message) {
        var events = [
            'hashtx',
            'hashblock'
        ];
        events.forEach(function(event){
            if(topic.toString() === event){
                io.emit(topic.toString(), {data: message.toString('hex')});
            }
        });
        
      //console.log('received a message related to:', topic.toString(), 'containing message:', message.toString('hex'));
    });
    
}
