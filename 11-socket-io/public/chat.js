window.onload = function () {
    var socket = io('http://172.18.255.223:3000');
    var input = document.getElementById('input');
    var form = document.getElementById('form');

    socket.on('connect', function () {
        // 通过join事件发送昵称
        socket.emit('join', prompt('What is your nickname?'));
        // 显示聊天窗口
        document.getElementById('chat').style.display = 'block';
    });

    // when server emits 'user joined'
    socket.on('user joined', function (data) {
        var li = document.createElement('li');
        li.className = 'join';
        li.innerHTML = data.username + ' joined, total ' + data.numUsers + ' user(s)';
        document.getElementById('messages').appendChild(li);
    });

    // when server emits 'user left'
    socket.on('user left', function (data) {
        var li = document.createElement('li');
        li.className = 'left';
        li.innerHTML = data.username + ' left, remaining ' + data.numUsers + ' user(s)';
        document.getElementById('messages').appendChild(li);
    });


    // when server emits 'message'
    socket.on('message', function (data) {
        addMessage(data.username, data.message, 'other');
    });

    form.onsubmit = function () {
        addMessage('me', input.value, 'me');
        socket.emit('message', input.value);

        // reset input box
        input.value =  '';
        input.focus();

        return false;
    }

    // add a message element to the messages
    function addMessage (from, text, type) {
        var li = document.createElement('li');
        li.className = 'message ' + type;
        li.innerHTML = '<b class="username">' + from + '</b>' + '<p class="arrow"><p class="text">' + text + '</p>';
        document.getElementById('messages').appendChild(li);
    }
}
