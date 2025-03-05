import './actionContainer.css';
import actionHtml from './actionContainer.html?raw';


export class ActionContainer extends HTMLDivElement {
   constructor() {
      this.html = actionHtml;
      this.classList.add('action');
   }

   connectedCallback() {
      console.log('ActionContainer connected');
   }
}

customElements.define('action-container', ActionContainer, { extends: 'div' });


