/* WARNING: This is all temporary code. Code quality was not considered */
import { $, $all } from './symbols.js';
import * as Classes from './classes.js';
import {AromaClient, AromaEvent, AromaError} from 'https://marcoschiavello.github.io/Aromalib/js/vanilla/client/aromalib.js';

// The client that handles the connection
let client;

// The original content of the 'messages' div
let MSG_HTML;

/**
 * Connect to the server
 */
$('#connect').onclick = () => {
    // Read host address and username from input areas
    const address = $('#host').value;
    const name = $('#name').value;

    // Create the client instance
    client = new AromaClient(address, name);
    
    // What happens when the client logs in
    client.addEventListener(AromaEvent.login, (event) => {
        // Update server name
        $('#servername').innerText = event.serverName;

        // Update list of channels
        event.channels.forEach(element => {
            $('#server').innerHTML += new Classes.ChannelButton(element).toHTML();
        });
        // assign to all channel btn an event listener to change channel 
        $all('*[action="joinTextChannel"]').forEach(btn => { btn.onclick = e => joinTextChannel(btn.value) });

        // Send message if enter is pressed
        document.addEventListener('keydown', (e) => {
            if (e.key == 'Enter') {
                if (!e.shiftKey) {
                    sendMessage();
                }
                else {
                    $('#newmessage').innerText += '\n';
                }
            }
        });
        
        // Show messageboard and focus input box
        showMessageboard();
        $('#newmessage').focus();
        MSG_HTML = $('#messages').innerHTML;
    });

    client.addEventListener(AromaEvent.usermessage, (message) => {
        const msg = new Classes.Message(message.sender, message.content);
        $('#messages').innerHTML += msg.toHTML();

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
        const msg = new Classes.LoginMessage(event.name);
        $('#messages').innerHTML += msg.toHTML();
    });

    client.addEventListener(AromaEvent.userlogout, (event) => {
        const msg = new Classes.LogoutMessage(event.name);
        $('#messages').innerHTML += msg.toHTML();
    });

    client.addEventListener(AromaEvent.join, (event) => {
        $('#messages').innerHTML = MSG_HTML;
        event.messages.forEach(message => { client.callEventListeners(message, message.type) });
        $(`#${event.name}-button`).style.backgroundColor = 'cornflowerblue';
        const msg = new Classes.ChannelJoinMessage('You', client.textChannel);
        $('#messages').innerHTML += msg.toHTML();
    });

    client.addEventListener(AromaEvent.leave, (event) => {
        $('#messages').innerHTML = MSG_HTML;
        $(`#${client.name}-button`).style = '';
        const msg = new Classes.ChannelLeaveMessage('You', client.textChannel);
        $('#messages').innerHTML += msg.toHTML();
    });

    client.addEventListener(AromaEvent.userjoin, (event) => {
        const msg = new Classes.ChannelJoinMessage(event.name, client.textChannel);
        $('#messages').innerHTML += msg.toHTML();
    });

    client.addEventListener(AromaEvent.userleave, (event) => {
        const msg = new Classes.ChannelLeaveMessage(event.name, client.textChannel);
        $('#messages').innerHTML += msg.toHTML();
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

    // inner HTML observer to scroll down
    const chatBox = $('#messages');
    chatBox.scrollTop = chatBox.scrollHeight - chatBox.clientHeight;
    const observer = new MutationObserver(() => {
        chatBox.scrollTop = chatBox.scrollHeight - chatBox.clientHeight;
    });

    // call 'observe' on that MutationObserver instance, 
    // passing it the element to observe, and the options object
    observer.observe(chatBox, {characterData: false, childList: true, attributes: false});
}

/**
 * Send a message
 */
const sendMessage = () => {
    const message = $('#newmessage').value.trim();
    if (message.trim() === '') return;
    
    client.sendMessage(message);
    $('#newmessage').value = '';
}

/**
 * Show the message board
 */
const showMessageboard = () => {
    const form = $('#loginform');
    const msgb = $('#messageboard');
    form.style.display = 'none';
    msgb.style.display = 'flex';
}

/**
 * @param {str} channel the channel to join
 */
const joinTextChannel = (channel) => {
    console.log(channel);
    if (client.textChannel != null) {
        $(`#${client.textChannel}-button`).style = '';
    }
    
    if (client.textChannel != channel) {
        client.joinTextChannel(channel);
    }

    else if (client.textChannel == channel) {
        client.leaveTextChannel();
    }
}

$('#send').onclick = sendMessage;