/* WARNING: This is all temporary code. Code quality was not considered */

class Message {
    constructor(sender, content) {
        this.sender = sender;
        this.content = content;
    }
    
    toHTML() {
        return `<h3 style="color: cornflowerblue;">${this.sender}</h3>${this.content.replace('\n', '<br>')}<br>`;
    }
}

class LoginMessage {
    constructor(name) {
        this.name = name;
    }

    toHTML() {
        return `<h4 class="login-message">${this.name} logged in</h2>`
    }
}

class LogoutMessage {
    constructor(name) {
        this.name = name;
    }

    toHTML() {
        return `<h4 class="logout-message">${this.name} logged out</h2>`
    }
}

class ChannelJoinMessage {
    constructor(name) {
        this.name = name;
    }

    toHTML() {
        return `<h4 class="join-message">${this.name} joined ${client.textChannel}</h2>`
    }
}

class ChannelLeaveMessage {
    constructor(name) {
        this.name = name;
    }

    toHTML() {
        return `<h4 class="leave-message">${this.name} left ${client.textChannel}</h2>`
    }
}

class ChannelButton {
    constructor(channelName) {
        this.channelName = channelName;
    }

    toHTML() {
        return `<input type="button" value="${this.channelName}" class="channel-button" id="${this.channelName}-button" onclick="joinTextChannel('${this.channelName}')">`;
    }
}

// The client that handles the connection
let client;
let MSG_HTML;

// Connect to the server
function connectToServer() {
    // Read host address and username from input areas
    const address = document.getElementById('host').value;
    const name = document.getElementById('name').value;

    // Create the client instance
    client = new AromaClient(address, name);
    
    // What happens when the client logs in
    client.addEventListener(AromaEvent.login, (event) => {
        // Update server name
        document.getElementById('servername').innerText = event.serverName;

        // Update list of channels
        event.channels.forEach(element => {
            document.getElementById('server').innerHTML += new ChannelButton(element).toHTML();
        });

        // Send message if enter is pressed
        document.addEventListener('keydown', (e) => {
            if (e.key == 'Enter') {
                if (!e.shiftKey) {
                    sendMessage();
                }
                else {
                    document.getElementById('newmessage').innerText += '\n';
                }
            }
        });
        
        // Show messageboard and focus input box
        showMessageboard();
        document.getElementById('newmessage').focus();
        MSG_HTML = document.getElementById('messages').innerHTML;;
    });

    client.addEventListener(AromaEvent.usermessage, (message) => {
        const msg = new Message(message.sender, message.content);
        document.getElementById('messages').innerHTML += msg.toHTML();

        if (message.sender != client.username) {
            const permission = Notification.requestPermission();
            const n = new Notification(message.sender, {
                body: message.content,
                visible: true
            });
            setTimeout(() => n.close(), 5 * 1000);
        }
    });

    client.addEventListener(AromaEvent.userlogin, (event) => {
        const msg = new LoginMessage(event.name);
        document.getElementById('messages').innerHTML += msg.toHTML();
    });

    client.addEventListener(AromaEvent.userlogout, (event) => {
        const msg = new LogoutMessage(event.name);
        document.getElementById('messages').innerHTML += msg.toHTML();
    });

    client.addEventListener(AromaEvent.join, (event) => {
        document.getElementById('messages').innerHTML = MSG_HTML;
        event.messages.forEach(message => { client.callEventListeners(message, message.type) });
        document.getElementById(`${event.name}-button`).style.backgroundColor = 'cornflowerblue';
        const msg = new ChannelJoinMessage('You');
        document.getElementById('messages').innerHTML += msg.toHTML();
    });

    client.addEventListener(AromaEvent.leave, (event) => {
        document.getElementById('messages').innerHTML = MSG_HTML;
        document.getElementById(`${client.name}-button`).style = '';
        const msg = new ChannelLeaveMessage('You');
        document.getElementById('messages').innerHTML += msg.toHTML();
    });

    client.addEventListener(AromaEvent.userjoin, (event) => {
        const msg = new ChannelJoinMessage(event.name);
        document.getElementById('messages').innerHTML += msg.toHTML();
    });

    client.addEventListener(AromaEvent.userleave, (event) => {
        const msg = new ChannelLeaveMessage(event.name);
        document.getElementById('messages').innerHTML += msg.toHTML();
    });

    // Show the login form on disconnect
    client.addErrorHandler(AromaError.disconnect, (event) => {
        alert(`Connection lost: the connection has been interrupted.\nReason: ${event.reason == '' ? 'unknown' : event.reason}`);
        window.location.reload(); 
    });

    client.addErrorHandler(AromaError.invalidtype, (event) => {
        alert("Received invalid packet type");
    });

    // Establish a connection to the server
    client.connect();
}

function sendMessage() {
    const message = document.getElementById('newmessage').value;
    if (message == '') return;
    
    client.sendMessage(message);
    document.getElementById('newmessage').value = '';
}

// Show the messageboard
function showMessageboard() {
    const form = document.getElementById('loginform');
    const msgb = document.getElementById('messageboard');
    form.style.display = 'none';
    msgb.style.display = 'flex';
}

function joinTextChannel(channel) {
    if (client.textChannel != null) {
        document.getElementById(`${client.textChannel}-button`).style = '';
    }
    
    if (client.textChannel != channel) {
        client.joinTextChannel(channel);
    }

    else if (client.textChannel == channel) {
        client.leaveTextChannel();
    }
}