var serialport = require("serialport");
var SerialPort = serialport.SerialPort; // localize object constructor
var app = require('http').createServer(handler);
var io = require('socket.io').listen(app);
var fs = require('fs');
var domain = require('domain');

app.listen(8124);


/**
 * Routing 
 * @param  {[type]} req
 * @param  {[type]} res
 * @return {[type]}
 */
function handler (req, res) {
    console.log(req.url);
    if ( req.url == '/') {
        fs.readFile(__dirname + '/index.html',
          function (err, data) {
              if (err) {
                  res.writeHead(500);
                  return res.end('Error loading index.php');
              }
              res.writeHead(200);
              res.end(data);
          });
    } else {
        fs.readFile(__dirname + req.url,
          function (err, data) {
              if (err) {
                  res.writeHead(500);
                  return res.end('Error loading' + req.url);
              }
              res.writeHead(200);
              res.end(data);
          });
    }

  res.on('error', function(er) { console.log(er); });
  req.on('error', function(er) { console.log(er); });
}

// Array with states for the 8x8 BL-M12A881UR-11 LED matrix
var cols_state = new Array();
cols_state[0] = [1, 1, 1, 1, 1, 1, 1, 1];
cols_state[1] = [1, 1, 1, 1, 1, 1, 1, 1];
cols_state[2] = [1, 1, 1, 1, 1, 1, 1, 1];
cols_state[3] = [1, 1, 1, 1, 1, 1, 1, 1];
cols_state[4] = [1, 1, 1, 1, 1, 1, 1, 1];
cols_state[5] = [1, 1, 1, 1, 1, 1, 1, 1];
cols_state[6] = [1, 1, 1, 1, 1, 1, 1, 1];
cols_state[7] = [1, 1, 1, 1, 1, 1, 1, 1];


//io.set('heartbeats', false);*/
/*io.set('heartbeat timeout', 2);
io.set('heartbeat interval', 1);*/

io.sockets.on('connection', function (socket) {
  socket.emit('allleds', cols_state);
    // when the client emits 'buttonclick', this listens and executes
    socket.on('buttonclick', function (data) {
    console.log(data);
    socket.broadcast.emit('updatewaiting',data);
    sp.write( data + "\0");
    });
  
    // when the user disconnects.. perform this
    socket.on('fdisconnect', function(){
    socket.disconnect('unauthorized');
      console.log('disconnect');
    });

  socket.on('error', function(er) {
    console.log('THEERROR');
  });
});

io.sockets.on('error', function(er) { console.log('ERROReeeee') });

/**
 * Arduino USB as SerialPort
 * @type {SerialPort}
 */
var sp = new SerialPort("/dev/ttyUSB0", {
    parser: serialport.parsers.readline("\n"),
    baudrate: 9600,
});


sp.on("open", function () {
  console.log('open');
  sp.on('data', function(data) {
    console.log('data received: ' + data);
    //sp.write( r + ":"+ c + ":1\0");
  console.log(data);
  io.sockets.emit('updateleds',data);
  var holder = data.split(":");
  holder[2] = parseInt(holder[2]);
  switch (holder[2]){
    case 0:
      cols_state[holder[0]][holder[1]] = 1;
      break;
    case 1:
      cols_state[holder[0]][holder[1]] = 0;
      break;
  }
  
  });

  sp.write("ls\n", function(err, results) {
    console.log('err ' + err);
    console.log('results ' + results);
  });
});


/*setInterval(function() {
console.log("interval");
console.log(io.sockets.manager);
}, 1000);*/