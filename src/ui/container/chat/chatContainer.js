import { userService } from '../../factory';
import './chatContainer.css';
import chatHtml from './chatContainer.html?raw';


export class ChatContainer extends HTMLFormElement {

   constructor() {
      super();
      this.innerHTML = chatHtml;
      this.className = 'chat';

      this.$chatList = this.querySelector('.chat__list');
      this.$chatInput = this.querySelector('.chat__input--message');
   }
   connectedCallback() {
      console.log('ChatContainer connected');
      this.addEventListener('submit', this.handleMessageSumit);
   }

   handleMessageSumit = async (e) => {
      e.preventDefault();

      const { name } = await userService.getUser();
      const message = `
         <li class="chat__item">
            <strong class="chat__username">${name}</strong>
            <p class="chat__message">${this.$chatInput.value}</p>
         </li>
      `

      this.$chatList.innerHTML += message;
      this.$chatInput.value = '';
   }
}


customElements.define('chat-container', ChatContainer, { extends: 'form' });