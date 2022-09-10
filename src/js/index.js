/* WARNING: This is all temporary code. Code quality was not considered */
import { $, $all } from './symbols.js';
import * as Components from './components.js';
import { ChatBox } from './chatbox.js';
import * as Utils from './utils.js';  
import { AromaClient, AromaEvent, AromaError } from 'https://marcoschiavello.github.io/Aromalib/js/vanilla/client/aromalib.js';

const chatbox = new ChatBox('messages');

/**
 * Connect to the server
 */
const connect = (address, name) => {
    // Create the client instance
    const client = new AromaClient(address, name);
    
    // The client that handles the connection
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
        const channelBtns = $all('*[action="joinTextChannel"]');
        channelBtns.forEach(btn => { btn.onclick = e => Utils.joinTextChannel(client, btn.value) });
        Utils.radioFunctionality(channelBtns);

        // Send message if enter is pressed 
        document.addEventListener('keydown', e => Utils.sendShiftConcern(client, e));
        // flushes the space from the input when the enter key is relesed
        document.addEventListener('keyup', Utils.flushSpaceOnKeyRelise);
        
        // Show messageboard and focus input box
        Utils.showMessageboard();
        $('#newmessage').focus();
        chatbox.saveChat();
    });

    client.addEventListener(AromaEvent.usermessage, (message) => {
        chatbox.printMsg(message.sender, Utils.HTMLspaceConverter(message.content));

        if (message.sender != client.username) {
            Utils.notification(message.sender, message.content);
        }
    });

    client.addEventListener(AromaEvent.userlogin, event => chatbox.printLogMsg(event.name));
    client.addEventListener(AromaEvent.userlogout, event => chatbox.printLogMsg(event.name, false));
    client.addEventListener(AromaEvent.userjoin, event => chatbox.printChannelEntranceMsg(event.name, client.textChannel));
    client.addEventListener(AromaEvent.userleave, event => chatbox.printChannelEntranceMsg(event.name, client.textChannel, false));

    client.addEventListener(AromaEvent.join, event => {
        chatbox.restoreChat();
        event.messages.forEach(message => { client.callEventListeners(message, message.type) });
        chatbox.printChannelEntranceMsg('You', client.textChannel);
    });

    client.addEventListener(AromaEvent.leave, event => {
        chatbox.restoreChat();
        chatbox.printChannelEntranceMsg('You', event.name, false);
    });

    // Show the login form on disconnect
    client.addErrorHandler(AromaError.disconnect, event => {
        alert(`Connection lost: the connection has been interrupted.\nReason: ${event.reason == '' ? 'unknown' : event.reason}`);
        window.location.reload(); 
    });

    client.addErrorHandler(AromaError.invalidtype, event => {
        alert("Received invalid packet type");
    });

    $('#send').onclick = Utils.sendMessage(client);

    // Establish a connection to the server
    client.connect();
}

// if the address and the name are saved in the local storage it will automaticaly logs in
if(localStorage.getItem('address'))
    connect(localStorage.getItem('address'), localStorage.getItem('name'));

$('#connect').onclick = e => connect($('#host').value, $('#name').value);
// clear the credentials
$('#logout').onclick = e => {
    localStorage.clear();
    document.location.reload();
}