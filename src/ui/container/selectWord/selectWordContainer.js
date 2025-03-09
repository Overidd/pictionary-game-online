import './selectWordContainer.css';
import selectWordHtml from './selectWordContainer.html?raw';
import { userService, wsService } from '../../factory';


export class SelectWordContainer extends HTMLDivElement {
   constructor() {
      super();
      this.innerHTML = selectWordHtml;
      this.classList.add('select-word');
      this.listWords = this.querySelector('.select-word__list');
      this.selectTitle = this.querySelector('.select-word__title');
   }

   connectedCallback() {
      this.initListener();
      this.initValue()
   }
   initListener() {
      this.listWords.addEventListener('click', this.handleWordSelect);
   }

   initValue() {
      this.selectTitle.textContent = 'El dibujante esta eligiendo la palabra';
      this.listWords.innerHTML = '';
   }

   //* --[ Metodos generales ]--
   setWords(words) {
      this.listWords.innerHTML = '';
      this.selectTitle.textContent = 'Elige una de las siguientes palabras';
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