import { $ } from './symbols.js'

// all the empty template for the varius type of message
const messages = {
    message: `<div style="display: flex; flex-direction: column; gap:0.2rem">
                <h3 style="padding-left: 0.85rem;color: cornflowerblue; margin:0" field="sender"></h3>
                <p style="padding-left: 1rem; margin:0" field="msg"></p>
              </div>`,
    loginMessage: `<h4 class="login-message" field="msg"></h4>`,
    logoutMessage: `<h4 class="logout-message" field="msg"></h4>`,
    channelJoinMessage: `<h4 class="join-message" field="msg"></h4>`,
    channelLeaveMessage:`<h4 class="leave-message" field="msg"></h4>`
}

/**
 * class that rappresent the chatbox and the interaction with it
 * 
 * @author Marco Schiavello
 */
class ChatBox {

    constructor(chatboxId) {
        // pick the chatbox element
        this.chatbox = $(`#${chatboxId}`);

        this.savedMessages = '';

        // inner HTML observer to scroll down
        const scrollDown = () => { this.chatbox.scrollTop = this.chatbox.scrollHeight - this.chatbox.clientHeight };
        const observer = new MutationObserver(scrollDown);
        // call 'observe' on that MutationObserver instance, 
        // passing it the element to observe, and the options object
        observer.observe(this.chatbox, {characterData: false, childList: true, attributes: false});
    }

    // function that clones the template and wraps it into a div and than returns it
    #createTemplate(messageType) {
        const newElement = document.createElement('div');
        newElement.innerHTML = messages[messageType];
        return newElement;
    }
    
    // appends the element wrapped into the div in the chatbox
    #append(newElement) {
        this.chatbox.appendChild(newElement.children[0]);
    }

    printMsg(sender, content) {
        // create the tamplate
        const template = this.#createTemplate('message');
        // populate the template
        template.querySelector('*[field="sender"]').innerHTML = sender;
        template.querySelector('*[field="msg"]').innerHTML = content;

        // appends the element
        this.#append(template);
    }

    printLogMsg(name, mode_ = true) {
        const mode = mode_ ? 'in' : 'out';
        const template = this.#createTemplate(`log${mode}Message`);
        template.querySelector('*[field="msg"]').innerHTML = `${name} logged ${mode}`;
        
        this.#append(template);
    }

    printChannelEntranceMsg(name, chennel, mode = true) {
        const template = this.#createTemplate(`channel${ mode ? 'Join' : 'Leave' }Message`);
        template.querySelector('*[field="msg"]').innerHTML = `${name} ${mode ? 'joined' : 'left'} ${chennel}`;
        
        this.#append(template);
    }

    saveChat() {
        this.savedMessages = this.chatbox.innerHTML;
    }

    restoreChat() {
        this.chatbox.innerHTML = this.savedMessages;
    }
}

export {
    ChatBox
};