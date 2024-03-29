const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const path = require('path');

//serving public dirc.
app.use(express.static(path.join(__dirname,'public')));

app.get('/', (req, res)=> {
    res.sendFile(path.join(__dirname, + 'public/index.html'));
});

io.on('connection', socket => {                                  //event handler
    console.log('A User Connected');

    socket.on('disconnect', () => {
        console.log('User Has Disconnected');
    });

    socket.on('message', (message) => {
        console.log('message',message);
        //Broadcasting
        io.emit('message',message);
    });
});

http.listen(3000,() => {
    console.log('listening on port 3000');
});
