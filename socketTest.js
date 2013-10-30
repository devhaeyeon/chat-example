var app = require('http').createServer(handler)
  , io = require('socket.io').listen(app)
  , fs = require('fs');
  var port = process.env.PORT || 5000;

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
    socket.on('message', function (data) {
        // 클라이언트의 message 이벤트를 발생시킵니다.
        io.sockets.emit('message', data);
    });
});