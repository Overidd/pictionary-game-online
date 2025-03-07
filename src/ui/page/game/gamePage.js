import './gamePage.css';
import gamePageHtml from './gamePage.html?raw';

import { CanvasAndTools } from '../../container/canva';
import { ChatContainer } from '../../container/chat';
// import { SelectWordContainer } from '../../container/selectWord/selectWordContainer';
import { UserContainer } from '../../container/user';
import { roomService } from '../../factory';


export class GamePage extends HTMLDivElement {
   constructor() {
      super();
      this.innerHTML = gamePageHtml;
      this.className = 'game';

      this.$player = {
         status: this.querySelector('.player__status'),
         list: this.querySelector('.player__list'),
         chat: this.querySelector('.player__chat'),
      }

      this.$board = {
         status: this.querySelector('.board__status'),
         time: this.querySelector('.board__time'),
         graph: this.querySelector('.board__graph'),
      }
      this.$player.list.appendChild(new UserContainer());
      this.$player.chat.appendChild(new ChatContainer());
      this.$board.graph.appendChild(new CanvasAndTools());
      // this.$board.graph.appendChild(new SelectWordContainer());
   }

   connectedCallback() {
      console.log('GamePage connectedCallback');
      this.$player.status.textContent = `Jugadores ${roomService.getPlayers().length}/${roomService.getMaxPlayers()}`;
   }

   initEvent() {
   }

   initValues() {
   }


}

customElements.define('game-page', GamePage, { extends: 'div' });

