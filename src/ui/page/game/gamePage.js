import './gamePage.css';
import gamePageHtml from './gamePage.html?raw';

import { CanvasAndTools } from '../../container/canva';
import { ChatContainer } from '../../container/chat';
import { SelectWordContainer } from '../../container/selectWord/selectWordContainer';
import { UserContainer } from '../../container/user';
import { gameService, userService, wsService } from '../../factory';
import { ActionContainer } from '../../container/action/actionContainer';
import { TimerContainer } from '../../container/timer/timerContainer';


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

      this.containers = {
         useContainer: new UserContainer(),
         actionContainer: new ActionContainer(),
         chatContainer: new ChatContainer(),
         timerContainer: new TimerContainer(),
         selectWordContainer: new SelectWordContainer(),
         canvasAndTools: new CanvasAndTools(),
      }

      // Al iniciar el juego
      this.$player.list.appendChild(this.containers.useContainer);
      this.$board.graph.appendChild(this.containers.actionContainer);
      // this.$board.graph.appendChild(this.containers.timerContainer);
   }

   connectedCallback() {
      this.initService();
      // wsService.onPlayerOnlineRoom(({ payload }) => {
      //    this.$player.list.innerHTML = UserContainerRender.renderUser(payload.map(user => userMapper(user)));
      // })

      // this.$player.status.textContent = `Jugadores ${roomService.getPlayers().length}/${roomService.getMaxPlayers()}`;
   }

   initListener() {
   }

   initValues() {

   }

   initService() {
      wsService.requestRoomData(userService.getUser().id);

      wsService.onRoomState(({
         payload: { isStartedGame }
      }) => {
         this.initStatusGame(isStartedGame);
      })

      wsService.onPlayerQuantityOnlineRoom(({
         payload: { playerQuantity, maxPlayerQuantity }
      }) => {
         this.updateStatusPlayer(playerQuantity, maxPlayerQuantity);
      })

      wsService.onStartGameRoomOk(() => {
         this.startGame();
      })

      wsService.onIntervalStartGameRoom(({ payload: { time } }) => {
         this.containers.timerContainer.setTime(time);
         console.log(time);
         if (time <= 0) {
            this.containers.timerContainer.remove();
            this.$board.graph.appendChild(this.containers.canvasAndTools);
         }
      })
      wsService.onWordSelectedRoom(({ payload: { words } }) => {
         this.$board.graph.appendChild(this.containers.selectWordContainer);
         this.containers.selectWordContainer.setWords(words);
      })

      wsService.onRoomStateGame(({
         payload: { currentCartoonist, currentWord }
      }) => {
         console.log(currentCartoonist, currentWord );
         if (currentWord) {
            this.containers.selectWordContainer.remove();
            this.containers.canvasAndTools.enableCanvas();
         }
         this.$board.status.textContent = currentWord
            ? `Dibuja: ${currentWord}`
            : `Dibujante: ${currentCartoonist}`
      })

      wsService.onCurrentRoundTimeRoom(({ payload: { time } }) => {
         this.$board.time.textContent = `${time}⌚`
      })
   }

   // * --[ Metodos de actualizacion ]--
   updateStatusPlayer(playerQuantity, maxPlayer) {
      this.$player.status.textContent = `${playerQuantity} / ${maxPlayer}`
   }

   startGame() {
      this.containers.actionContainer.remove();
      this.$board.graph.appendChild(this.containers.timerContainer);
      // gameService.intervalStartGame(this.containers.timerContainer.setTime)
      // .then(() => {
      // this.containers.timerContainer.remove();
      // this.$board.graph.appendChild(this.containers.canvasAndTools);
      // })
      // .catch(err => console.error('Ocurrio un error al iniciar el juego'));
   }
   initStatusGame(status) {
      if (!status) return;
      this.containers.actionContainer.remove();
      this.$board.graph.appendChild(this.containers.canvasAndTools);
   }
}

customElements.define('game-page', GamePage, { extends: 'div' });

