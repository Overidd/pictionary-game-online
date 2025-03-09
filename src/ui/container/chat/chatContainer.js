import './chatContainer.css';
import chatHtml from './chatContainer.html?raw';
import { userService, wsService } from '../../factory';

export class ChatContainer extends HTMLFormElement {

   constructor() {
      super();
      this.innerHTML = chatHtml;
      this.classList.add('chat');

      this.$chatList = this.querySelector('.chat__list');
      this.$chatInput = this.querySelector('.chat__input--message');
   }
   connectedCallback() {
      this.addEventListener('submit', this.handleMessageSumit);
      this.disableChat();
      this.initService();
   }

   handleMessageSumit = (e) => {
      e.preventDefault();
      const message = this.$chatInput.value?.trim();
      this.sendMessage(message);
      this.$chatInput.value = '';
   }

   initService() {
      wsService.onChatMessageRoom(({ payload: { isCorrect, username, message, } }) => {
         this.updateChat(isCorrect, username, message);
      })
   }

   sendMessage(message) {
      wsService.sendMessageRoom(userService.getUser().id, message);
   }

   disableChat() {
      this.removeEventListener('submit', this.handleMessageSumit);
      this.$chatInput.disabled = true;
      this.classList.add('chat--disabled');
   }

   enableChat() {
      this.addEventListener('submit', this.handleMessageSumit);
      this.$chatInput.disabled = false;
      this.classList.remove('chat--disabled');
   }

   //* --[Metodos de actualizacion]--
   updateChat(isCorrect, username, message) {
      this.$chatList.innerHTML += `
         <li class="chat__item>
            <strong class="chat__username">${username}:</strong>
            <p class="chat__message ${isCorrect ? 'chat__item--correct' : 'chat__item--incorrect'}"" >${message}</p>
         </li>
      `
   }
}
customElements.define('chat-container', ChatContainer, { extends: 'form' });