/* WARNING: This is all temporary code. Code quality was not considered */

// The client that handles the connection
let client;

// The original content of the 'messages' div
let MSG_HTML;

/**
 * Connect to the server
 */
const connectToServer = () => {
    // Read host address and username from input areas
    const address = $('host').value;
    const name = $('name').value;

    // Create the client instance
    client = new AromaClient(address, name);
    
    // What happens when the client logs in
    client.addEventListener(AromaEvent.login, (event) => {
        // Update server name
        $('servername').innerText = event.serverName;

        // Update list of channels
        event.channels.forEach(element => {
            $('server').innerHTML += new ChannelButton(element).toHTML();
        });

        // Send message if enter is pressed
        document.addEventListener('keydown', (e) => {
            if (e.key == 'Enter') {
                if (!e.shiftKey) {
                    sendMessage();
                }
                else {
                    $('newmessage').innerText += '\n';
                }
            }
        });
        
        // Show messageboard and focus input box
        showMessageboard();
        $('newmessage').focus();
        MSG_HTML = $('messages').innerHTML;;
    });

    client.addEventListener(AromaEvent.usermessage, (message) => {
        const msg = new Message(message.sender, message.content);
        $('messages').innerHTML += msg.toHTML();

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
        $('messages').innerHTML += msg.toHTML();
    });

    client.addEventListener(AromaEvent.userlogout, (event) => {
        const msg = new LogoutMessage(event.name);
        $('messages').innerHTML += msg.toHTML();
    });

    client.addEventListener(AromaEvent.join, (event) => {
        $('messages').innerHTML = MSG_HTML;
        event.messages.forEach(message => { client.callEventListeners(message, message.type) });
        $(`${event.name}-button`).style.backgroundColor = 'cornflowerblue';
        const msg = new ChannelJoinMessage('You');
        $('messages').innerHTML += msg.toHTML();
    });

    client.addEventListener(AromaEvent.leave, (event) => {
        $('messages').innerHTML = MSG_HTML;
        $(`${client.name}-button`).style = '';
        const msg = new ChannelLeaveMessage('You');
        $('messages').innerHTML += msg.toHTML();
    });

    client.addEventListener(AromaEvent.userjoin, (event) => {
        const msg = new ChannelJoinMessage(event.name);
        $('messages').innerHTML += msg.toHTML();
    });

    client.addEventListener(AromaEvent.userleave, (event) => {
        const msg = new ChannelLeaveMessage(event.name);
        $('messages').innerHTML += msg.toHTML();
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

/**
 * Send a message
 */
const sendMessage = () => {
    const message = $('newmessage').value;
    if (message == '') return;
    
    client.sendMessage(message);
    $('newmessage').value = '';
}

/**
 * Show the message board
 */
const showMessageboard = () => {
    const form = $('loginform');
    const msgb = $('messageboard');
    form.style.display = 'none';
    msgb.style.display = 'flex';
}

/**
 * @param {str} channel the channel to join
 */
const joinTextChannel = (channel) => {
    if (client.textChannel != null) {
        $(`${client.textChannel}-button`).style = '';
    }
    
    if (client.textChannel != channel) {
        client.joinTextChannel(channel);
    }

    else if (client.textChannel == channel) {
        client.leaveTextChannel();
    }
}
