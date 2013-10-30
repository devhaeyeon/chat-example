  var fs = require('fs');
var app = require('http').createServer(handler)
var io = require('socket.io').listen(app);
  var port = process.env.PORT || 5000;
var nicklist = {};
var nickidlist = {};
io.set('log level',2);

app.listen(port);

function handler (req, res) {
  fs.readFile( 'htmlPage.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }
         res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
  });
}

io.configure(function () { 
  io.set("transports", ["xhr-polling"]); 
  io.set("polling duration", 10); 
}); 

io.sockets.on('connection', function (socket) {
    // join 이벤트
    socket.on('join', function (data) {
        socket.join(data);
        socket.set('room', data);
    });

    // message 이벤트
    socket.on('message', function (data) {
        socket.get('room', function (error, room) {
            io.sockets.in(room).emit('message', data);
        });
    });

});