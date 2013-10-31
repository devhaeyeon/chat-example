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
	socket.on('systemIn',function(data){
		   socket.get('room', function (error, room) {
				if(data.name)
				{
					//최초 입장시 아이디/소켓코드 저장
					nicklist[data.name] = socket.nickname = data.name;
					nickidlist[data.name] = socket.id;
					io.sockets.in(room).emit('systemIn',data);
					io.sockets.in(room).emit('systemList',nicklist);
				}
		});
	});

    // join 이벤트
    socket.on('join', function (data) {
        socket.join(data);
        socket.set('room', data);
    });

    // message 이벤트
    socket.on('message', function (data) {
        socket.get('room', function (error, room) {
          if(data.type == 'public')
		{
			io.sockets.in(room).emit('message', data);
        }
		else
		{
			io.sockets.sockets[nickidlist[data.name]].in(room).emit('message',data);
			io.sockets.sockets[nickidlist[data.type]].in(room).emit('message',data);
		}
		
		});
    });

	//퇴장 처리
	socket.on('disconnect',function(){
        socket.get('room', function (error, room) {
		if(socket.nickname){
			socket.broadcast.emit('systemOut',{name:socket.nickname});
			delete nicklist[socket.nickname];
			io.sockets.in(room).emit('systemList',nicklist);
		}		
		});
	});

});