import { $ } from './symbols.js';

/**
 * Show the message board
 */
function showMessageboard () {
    const form = $('#loginform');
    const msgb = $('#messageboard');
    form.style.display = 'none';
    msgb.style.display = 'flex';
}

/**
 * Send a message
 */
function sendMessage (client) {
    const message = $('#newmessage').value.trim();
    $('#newmessage').value = '';
    if (message === '') return;

    client.sendMessage(message);
    
}

function sendShiftConcern(client, e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        sendMessage(client);
    }
}

const flushSpaceOnKeyRelise = e => {
    if (e.key === 'Enter' && !e.shiftKey) {
        $('#newmessage').value = '';
    }
}

/**
 * @param {str} channel the channel to join
 */
function joinTextChannel (client, channel) {
    if (client.textChannel != null) {
        $(`*[id="${client.textChannel}-button"]`).style = '';
    }
    
    if (client.textChannel != channel) {
        client.joinTextChannel(channel);
    }

    else if (client.textChannel == channel) {
        client.leaveTextChannel();
    }
}

function notification(title, msg) {
    const permission = Notification.requestPermission();
    const n = new Notification(title, {
        body: msg,
        visible: true
    });
    setTimeout(() => n.close(), 5 * 1000);
}

// makes a button list a radio selection
function radioFunctionality(btnList_) {
    // create a shallow copy of the btn array to convert the nodeList to an array
    const btnList = [... btnList_];

    btnList.forEach( btn => {
        btn.addEventListener('click', e => {
            btn.classList.toggle('channel-btn--active');
            btnList.filter(tmpBtn => tmpBtn !== btn).forEach( nonActiveBtn => nonActiveBtn.classList.remove('channel-btn--active') );
        });
    })
}

function HTMLspaceConverter(text) {
    return text.replace(/\n/g, '<br>');
}

export {
    showMessageboard,
    sendMessage,
    joinTextChannel,
    notification,
    sendShiftConcern,
    radioFunctionality,
    flushSpaceOnKeyRelise,
    HTMLspaceConverter
}