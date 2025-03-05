import './selectWordContainer.css';
import selectWordHtml from './selectWordContainer.html?raw';




export class SelectWordContainer extends HTMLDivElement {
   constructor() {
      super();
      this.innerHTML = selectWordHtml;
      this.classList.add('select-word');
   }

   connectedCallback() {
      console.log('SelectWordContainer connected');
   }
}

customElements.define('select-word-container', SelectWordContainer, { extends: 'div' });