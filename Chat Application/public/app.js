const messageTypes = { LEFT: 'left', RIGHT: 'right', LOGIN: 'login' };

//Chat Stuff
const chatWindow = document.getElementById('chat');
const messagesList = document.getElementById('messagesList');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');



//login stuff//
let username = '';
const usernameInput = document.getElementById('usernameInput');
const loginBtn = document.getElementById('loginBtn');
const loginWindow = document.getElementById('login');

const messages = [];//(author,date,content,type)

var socket = io();

socket.on('message', message => {                     //broadcasting handled at FE
    console.log(message);
    if (message.type !== messageTypes.LOGIN) {
        if (message.author === username) {
            message.type = messageTypes.RIGHT;
        }
        else {
            message.type = messageTypes.LEFT;
        }
    }

    messages.push(message);
    displayMessages();
    chatWindow.scrollTop = chatWindow.scrollHeight;
});


//taking message object and returning corresp. message HTML

const createMessageHTML = (message) => {
    if (message.type === messageTypes.LOGIN) {
        return `
            <p class="secondary-text text-center mb-2">${message.author} Has Joined The Chat..</p>
        `;
    }

    return `
    <div class="message ${message.type === messageTypes.LEFT ? 'message-left' : 'message-right'}">
        <div id="message-details" class="flex">
            <p class="message-author">${message.author === messageTypes.RIGHT ? '' : message.author}
            <p class="message-date">${message.date}
    </div>
    <p class="message-content">${message.content}
    </div>
    `;
};

const displayMessages = () => {
    const messagesHTML = messages
        .map((message) => createMessageHTML(message))
        .join('');        // conversion into string , takes items from array and puts it into one string,
    messagesList.innerHTML = messagesHTML;
}

displayMessages();

//sendbtn callback
sendBtn.addEventListener('click', e => {
    e.preventDefault();
    if (!messageInput.value) {
        return console.log('Must supply a message');
    }

    const date = new Date();
    const day = date.getDate();
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);  //012 
    const dateString = `${month}/${day}/${year}`;
    const message = {
        author: username,
        date: dateString,
        content: messageInput.value,
    };

    socket.emit('message', message);

    messageInput.value = '';

});

const sendMessage = message => {
    socket.emit('message', message);

}

//loginbtn callback
loginBtn.addEventListener('click', e => {
    //prevent def. of a form
    e.preventDefault();
    //set the usern. and create login msg
    if (!usernameInput.value) {
        return console.log('Must Have A Username');
    }
    username = usernameInput.value;

    sendMessage({
        author: username,
        type: messageTypes.LOGIN
    });

    //hide login and show chat window
    loginWindow.classList.add('hidden');
    chatWindow.classList.remove('hidden');

});