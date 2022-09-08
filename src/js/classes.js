/* WARNING: This is all temporary code. Code quality was not considered */

/**
 * The representation of a message
 * @author Alessandro-Salerno
 */
 class Message {
    /**
     * @param {str} sender the message's sender
     * @param {str} content the message's content
     */
    constructor(sender, content) {
        this.sender = sender;
        this.content = content;
    }
    
    /**
     * @returns the HTML representation of the message
     */
    toHTML() {
        return `<h3 style="color: cornflowerblue;">${this.sender}</h3>${this.content.replace('\n', '<br>')}<br>`;
    }
}

/**
 * The representation of a login notice
 * @author Alessandro-Salerno
 */
class LoginMessage {
    /**
     * @param {str} name the name of the user that logged in
     */
    constructor(name) {
        this.name = name;
    }

    /**
     * @returns the HTML representation of the login notice
     */
    toHTML() {
        return `<h4 class="login-message">${this.name} logged in</h2>`
    }
}

/**
 * The representation of a logout message
 * @author Alessandro-Salerno
 */
class LogoutMessage {
    /**
     * @param {str} name the name of the user that logged out
     */
    constructor(name) {
        this.name = name;
    }

    /**
     * @returns the HTML representation of the logout notice
     */
    toHTML() {
        return `<h4 class="logout-message">${this.name} logged out</h2>`
    }
}

/**
 * The representation of a join notice
 * @author Alessandro-Salerno
 */
class ChannelJoinMessage {
    /**
     * @param {str} name the name of the user that has joined the channel
     */
    constructor(name) {
        this.name = name;
    }

    /**
     * @returns the HTML representation of the join notice
     */
    toHTML() {
        return `<h4 class="join-message">${this.name} joined ${client.textChannel}</h2>`
    }
}

/**
 * The representation of a leave notice
 * @author Alessandro-Salerno
 */
class ChannelLeaveMessage {
    /**
     * @param {str} name the name of the user that has left the channel
     */
    constructor(name) {
        this.name = name;
    }

    /**
     * @returns the HTML representation of the leave notice
     */
    toHTML() {
        return `<h4 class="leave-message">${this.name} left ${client.textChannel}</h2>`
    }
}

/**
 * The representation of a channel button
 * @author Alessandro-Salerno
 */
class ChannelButton {
    /**
     * @param {str} channelName the name of the channel that the button is linked to
     */
    constructor(channelName) {
        this.channelName = channelName;
    }

    /**
     * @returns the HTML representation of the button
     */
    toHTML() {
        return `<input type="button" value="${this.channelName}" class="channel-button" id="${this.channelName}-button" onclick="joinTextChannel('${this.channelName}')">`;
    }
}
