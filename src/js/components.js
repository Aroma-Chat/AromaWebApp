/* WARNING: This is all temporary code. Code quality was not considered */

function ChannelButton(channelName) {
    const HTMLstring = `<input type="button" value="${channelName}" class="channel-button" id="${channelName}-button" action="joinTextChannel">`;
    const newElement = document.createElement('div');
    newElement.innerHTML = HTMLstring;
    return newElement.children[0];
}

export {
    ChannelButton
};