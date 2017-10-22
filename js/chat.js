$(function() {
    var socket = io('ws://localhost:8010');

    var userName = null;
    $('.login-btn').click(function() {
        userName = $.trim($('#loginName').val());
        if(userName) {
            socket.emit('login', { userName: userName })
        } else {
            alert('请输入用户名')
        }
    })

    socket.on('loginSuccess', function(data) {
        if(data.userName === userName) {
            console.log(data)
            checkin(data);
        } else {
            alert('用户名不匹配，请重试');
        }
    })

    socket.on('loginFail', function() {
        alert('昵称重复！')
    })

    socket.on('add', function(data) {
        var html = '<p>系统消息:'+data.userName+'已加入群聊</p>';
        $('.chat-con').append(html);
    })

    socket.on('leave',function(name){
        if(name != null){
            var html = '<p>FBI warning:'+name+'已退出群聊</p>';
            $('.chat-con').append(html);
        }
    })

    socket.on('receiveMessage',function(data){
        showMessage(data)
    })
    
    /*显示消息*/
    function showMessage(data){
        var html
        if(data.userName === userName){
            html = '<div class="chat-item item-right clearfix"><span class="img fr"></span><span class="message fr">'+data.message+'</span></div>'
        }else{
            html='<div class="chat-item item-left clearfix rela"><span class="abs uname">'+data.userName+'</span><span class="img fl"></span><span class="fl message">'+data.message+'</span></div>'
        }
        $('.chat-con').append(html);
    }

    $('.sendBtn').click(function(){
        sendMessage()
    });

    $(document).keydown(function(event){
        if(event.keyCode == 13){
            sendMessage()
        }
    })

    function sendMessage(){
        var txt = $('#sendtxt').val();
        $('#sendtxt').val('');
        if(txt){
            socket.emit('sendMessage',{userName:userName, message:txt});
        }
    }

    function checkin(data){
        $('.login-wrap').hide('slow');
        $('.chat-wrap').show('slow');
    }
})