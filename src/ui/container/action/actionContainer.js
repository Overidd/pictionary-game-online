import './actionContainer.css';
import actionHtml from './actionContainer.html?raw';
import { userService, wsService } from '../../factory';

export class ActionContainer extends HTMLDivElement {
   constructor() {
      super();
      this.innerHTML = actionHtml;
      this.classList.add('action');
      this.$bt = {
         start: this.querySelector('.btn__action--start'),
         ready: this.querySelector('.btn__action--ready'),
      }
      this.$ = {
         actionMessage: this.querySelector('.action__message'),
      }
   }

   connectedCallback() {
      this.initService();
      this.initListener();
   }

   //* --[ Metodos de inicializacion ]--
   initService() {
      wsService.onIsPlayerCreatorRoom(({ payload: { isCreator } }) => {
         if (isCreator) {
            this.$bt.ready.remove();
            return
         }
         this.$bt.start.remove();
      })

      wsService.onErrorStartGameRoom(({ payload: { message } }) => {
         this.$.actionMessage.textContent = message
      })
   }

   initListener() {
      this.$bt.start.addEventListener('click', this.handleStart);
      this.$bt.ready.addEventListener('click', this.handleReady);
   }

   //* --[ Metodos de eventos ]--
   handleStart = (e) => {
      wsService.startGame(userService.getUser().id);
   };

   handleReady = (e) => {
      wsService.readyGame(userService.getUser().id);
   };
}
customElements.define('action-container', ActionContainer, { extends: 'div' });


