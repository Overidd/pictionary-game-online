import './chatContainer.css';
import chatHtml from './chatContainer.html?raw';


export class ChatContainer extends HTMLFormElement {
   
   constructor() {
      super();
      this.innerHTML = chatHtml;
      this.className = 'chat';
   }
   connectedCallback(){
      console.log('ChatContainer connected');
   }
}


customElements.define('chat-container', ChatContainer, { extends: 'form' });