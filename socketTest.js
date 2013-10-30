  var port = process.env.PORT || 5000;

/*app.listen(port);

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

	socket.on('setname',function(data){
		socket.set('name',data);
	});
	socket.on('getname',function(data){
		socket.get('name',function(error,data){
		socket.emit('responsename',data);
		});
	});

});*/
var fs = require('fs');
var server = require('http').createServer();
var io = require('socket.io').listen(server);

// 서버를 실행합니다.
server.listen(port, function () {
    console.log('Server Running at http://127.0.0.1:52273');
});

// 웹 서버 이벤트를 연결합니다.
server.on('request', function (request, response) {
    // HTMLPage.htm 파일을 읽습니다.
    fs.readFile('htmlPage.html', function (error, data) {
        response.writeHead(200, { 'Content-Type': 'text/html' });
        response.end(data);
    });
});

// 소켓 서버 이벤트를 연결합니다.
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