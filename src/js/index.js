/* WARNING: This is all temporary code. Code quality was not considered */
import { $, $all } from './symbols.js';
import * as Components from './components.js';
import { ChatBox } from './chatbox.js';
import { AromaClient, AromaEvent, AromaError } from 'https://marcoschiavello.github.io/Aromalib/js/vanilla/client/aromalib.js';
// The client that handles the connection
let client;

// The original content of the 'messages' div
let MSG_HTML;

const chatbox = new ChatBox('messages');

/**
 * Connect to the server
 */
const connect = (address, name) => {
    // Create the client instance
    client = new AromaClient(address, name);
    
    // What happens when the client logs in
    client.addEventListener(AromaEvent.login, (event) => {
        // set the credentials for the next time 
        localStorage.setItem('name', name);
        localStorage.setItem('address', address);

        // Update server name
        $('#servername').innerText = event.serverName;

        // Update list of channels
        event.channels.forEach(element => $('#server').append(Components.ChannelButton(element)));
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
        chatbox.printMsg(message.sender, message.content);

        if (message.sender != client.username) {
            const permission = Notification.requestPermission();
            const n = new Notification(message.sender, {
                body: message.content,
                visible: true
            });
            setTimeout(() => n.close(), 5 * 1000);
        }
    });

    client.addEventListener(AromaEvent.userlogin, (event) => chatbox.printLogMsg(event.name));
    client.addEventListener(AromaEvent.userlogout, (event) => chatbox.printLogMsg(event.name, false));
    client.addEventListener(AromaEvent.userjoin, (event) => chatbox.printChannelEntranceMsg(event.name, client.textChannel));
    client.addEventListener(AromaEvent.userleave, (event) => chatbox.printChannelEntranceMsg(event.name, client.textChannel, false));

    client.addEventListener(AromaEvent.join, (event) => {
        $('#messages').innerHTML = MSG_HTML;
        event.messages.forEach(message => { client.callEventListeners(message, message.type) });
        $(`#${event.name}-button`).style.backgroundColor = 'cornflowerblue';

        chatbox.printChannelEntranceMsg('You', client.textChannel);
    });

    client.addEventListener(AromaEvent.leave, (event) => {
        $('#messages').innerHTML = MSG_HTML;
        $(`#${client.name}-button`).style = '';

        chatbox.printChannelEntranceMsg('You', client.textChannel, false);
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

// if the address and the name are saved in the local storage it will automaticaly logs in
if(localStorage.getItem('address'))
    connect(localStorage.getItem('address'), localStorage.getItem('name'));

$('#connect').onclick = e => connect($('#host').value, $('#name').value);
$('#send').onclick = sendMessage;
// clear the credentials
$('#logout').onclick = e => {
    localStorage.clear();
    document.location.reload();
}