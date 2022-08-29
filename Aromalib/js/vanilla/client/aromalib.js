/**
 * Protocol data
 */
const AROMA_PROTOCOL_VERSION = '0.0.2';
const AROMA_PORT = 8080
const AROMA_PATH = 'aromachat/chat';

/**
 * Available events
 */
const AromaEvent = {
    login: 'login',
    logout: 'logout',
    join: 'join',
    leave: 'leave',
    usermessage: 'usermessage',
    userlogin: 'userlogin',
    userlogout: 'userlogout',
    userjoin: 'userjoin',
    userleave: 'userleave'
};

/**
 * Available errors
 */
const AromaError = {
    wserror: 'wserror',
    disconnect: 'disconnect',
    invalidtype: 'invalidtype'
};


/**
 * A client
 * @author Alessandro-Salerno
 */
class AromaClient {
    constructor(targetHost, username) {
        this.targetHost = targetHost;
        this.username = username;

        // Connection-related information
        this.ws = null;
        this.connected = false; // Unused
        this.loggedin = false; // Unused
        this.textChannel = null;

        // Event listeners
        this.eventListeners = {
            onlogin: [],
            onlogout: [],
            onjoin: [],
            onleave: [],
            onusermessage: [],
            onuserlogin: [],
            onuserlogout: [],
            onuserjoin: [],
            onuserleave: []
        };

        // Erro handlers
        this.errorHandlers = {
            onwserror: [],
            ondisconnect: [],
            oninvalidtype: []
        };
    }

    // Call event listeners for a given event type
    callEventListeners(event, eventType) {
        this.eventListeners[`on${eventType}`].forEach(eventListener => {
            eventListener(event);
        });
    }

    // Call all error handlers for a given error type
    callErrorHandlers(error, errorType) {
        this.errorHandlers[`on${errorType}`].forEach(errorHandler => {
            errorHandler(error);
        });
    }

    // Open a connection to the server
    connect() {
        this.ws = new WebSocket(`ws://${this.targetHost}:${AROMA_PORT}/${AROMA_PATH}?username=${this.username}&protocol=${AROMA_PROTOCOL_VERSION}`);

        this.ws.onmessage = (event) => {
            // Parse JSON message
            const packet = JSON.parse(event.data);

            // Check that the message type is valid
            if (!packet.type in AromaEvent) {
                this.callErrorHandlers({}, AromaError.invalidtype);
                return;
            }

            // If the message type is valid, call the designated event listener
            this.callEventListeners(packet, packet.type);
        };

        this.ws.onerror = (event) => {
            // Forward WS errors to error handlers
            this.callErrorHandlers(event, AromaError.wserror);
        };

        this.ws.onclose = (event) => {
            // If the connection has been closed without errors
            if (event.code == 1000) {
                this.callEventListeners(event, AromaEvent.logout);
                return;
            }

            // Call error handler if the connection has been closed with an error code
            this.callErrorHandlers(event, AromaError.disconnect);
        };
    }

    // Send a user message to the server
    sendMessage(message) {
        this.ws.send(JSON.stringify({
            type: AromaEvent.usermessage,
            content: message,
        }));
    }

    connectToChannel(channel) {
        this.we.send(JSON.stringify({
            type: AromaError.channellogin,
            channel: channel
        }));
    }

    // Add an event listener for a given event type
    addEventListener(eventType, eventListener) {
        this.eventListeners[`on${eventType}`].push(eventListener);
    }

    // Add an error handler for a given error type
    addErrorHandler(errorType, errorHandler) {
        this.errorHandlers[`on${errorType}`].push(errorHandler);
    }

    joinTextChannel(channel) {
        this.ws.send(JSON.stringify({
            type: AromaEvent.join,
            channel: channel
        }));

        this.textChannel = channel;
    }

    leaveTextChannel() {
        this.ws.send(JSON.stringify({
            type: AromaEvent.leave
        }));

        this.textChannel = null;
    }
}
