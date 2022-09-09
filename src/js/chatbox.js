import { $ } from './symbols.js'

const messages = {
    message: `<div style="display: flex; flex-direction: column">
                <h3 style="color: cornflowerblue;" field="sender"></h3>
                <p field="msg"></p>
              </div>`,
    loginMessage: `<h4 class="login-message" field="msg"></h4>`,
    logoutMessage: `<h4 class="logout-message" field="msg"></h4>`,
    channelJoinMessage: `<h4 class="join-message" field="msg"></h4>`,
    channelLeaveMessage:`<h4 class="leave-message" field="msg"></h4>`
}

class ChatBox {

    constructor(chatboxId) {
        this.chatbox = $(`#${chatboxId}`);
    }

    #createTemplate(messageType) {
        const newElement = document.createElement('div');
        newElement.innerHTML = messages[messageType];
        return newElement;
    }
    
    printMsg(sender, content) {
        const template = this.#createTemplate('message');
        template.querySelector('*[field="sender"]').innerHTML = sender;
        template.querySelector('*[field="msg"]').innerHTML = content;

        this.chatbox.appendChild(template);
    }

    printLogMsg(name, mode_ = true) {
        const mode = mode_ ? 'in' : 'out';
        const template = this.#createTemplate(`log${mode}Message`);
        template.querySelector('*[field="msg"]').innerHTML = `${name} logged ${mode}`;
        
        this.chatbox.appendChild(template);
    }

    printChannelEntranceMsg(name, chennel, mode_ = true) {
        const template = this.#createTemplate(`channel${ mode_ ? 'Join' : 'Leave' }Message`);
        template.querySelector('*[field="msg"]').innerHTML = `${name} ${mode_ ? 'joined' : 'left'} ${chennel}`;
        
        this.chatbox.appendChild(template);
    }
}

export {
    ChatBox
};