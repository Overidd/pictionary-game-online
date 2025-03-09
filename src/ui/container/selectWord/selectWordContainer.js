import { userService, wsService } from '../../factory';
import './selectWordContainer.css';
import selectWordHtml from './selectWordContainer.html?raw';




export class SelectWordContainer extends HTMLDivElement {
   constructor() {
      super();
      this.innerHTML = selectWordHtml;
      this.classList.add('select-word');
      this.listWords = this.querySelector('.select-word__list');
   }

   connectedCallback() {
      this.initListener();
   }
   initListener() {
      this.listWords.addEventListener('click', this.handleWordSelect);
   }

   //* --[ Metodos generales ]--
   setWords(words) {
      words.forEach(word => {
         this.listWords.innerHTML += `
          <li class="select-word__item" data-word="${word}">
            ${word}
         </li>
         `
      });
   }

   //* --[ Metodos de eventos ]--
   handleWordSelect = (e) => {
      if (e.target.matches('.select-word__item')) {
         const word = e.target.getAttribute('data-word');
         wsService.selectWord(userService.getUser().id, word);
      }
   }
}



customElements.define('select-word-container', SelectWordContainer, { extends: 'div' });