import './userContainer.css';
import usersHtml from './userContainer.html?raw';


export class UserContainer extends HTMLUListElement {
   constructor() {
      super();
      this.className = 'users';
      this.innerHTML = usersHtml;
   }

   connectedCallback() {
      console.log('UserContainer connected');
   }
}

customElements.define('user-container', UserContainer, { extends: 'ul' });