var app = require('http').createServer();

var io = require('socket.io')(app);

var PORT = 8010;

app.listen(PORT);

var userArr = [];

io.on('connection', function(socket) {
    var isNewPerson = true;
    var userName = null;
    socket.on('login', function(data) {
        for(var i = 0; i < userArr.length; i++) {
            if(userArr[i].userName === data.userName) {
                isNewPerson = false;
                break;
            } else {
                isNewPerson = true;
            }
        }
        if(isNewPerson) {
            userName = data.userName;
            userArr.push({
                userName: data.userName
            })
            socket.emit('loginSuccess', data)
            io.sockets.emit('add', data)
        } else {
            socket.emit('loginFail', '')
        }
        console.log(data)
    })

    socket.on('disconnect',function(){
        /*向所有连接的客户端广播leave事件*/
        io.sockets.emit('leave', userName)
        userArr.map(function(val,index){
            if(val.userName === userName){
                userArr.splice(index,1);
            }
        })
    })

    socket.on('sendMessage',function(data){
        io.sockets.emit('receiveMessage',data)
    })
})

console.log('服务已启动~ 端口8010');
