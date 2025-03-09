import './gamePage.css';
import gamePageHtml from './gamePage.html?raw';
import { RouterNavigation } from '../../router/routerApp';

import {
   CanvasAndTools,
   ChatContainer,
   SelectWordContainer,
   UserContainer,
   ActionContainer,
   TimerContainer
} from '../../container';

import {
   userService,
   wsService
} from '../../factory';


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
         statusRound: this.querySelector('.board__status-round'),
         time: this.querySelector('.board__time'),
         graph: this.querySelector('.board__graph'),
      }
      this.$endGame = {
         win: this.querySelector('.win'),
         score: this.querySelector('.win__score'),
         btExit: this.querySelector('.win__button--exit'),
      }
      this.containers = {
         useContainer: new UserContainer(),
         actionContainer: new ActionContainer(),
         chatContainer: new ChatContainer(),
         timerContainer: new TimerContainer(),
         selectWordContainer: new SelectWordContainer(),
         canvasAndTools: new CanvasAndTools(),
      }

      this.$player.list.appendChild(this.containers.useContainer);
      this.$board.graph.appendChild(this.containers.actionContainer);
   }

   connectedCallback() {
      this.initService();
      this.initListener();
   }

   disconnectedCallback() {
      this.bindEvents('remove');
   }

   initListener() {
      this.bindEvents('add');
   }

   bindEvents(action) {
      const method = action === 'add' ? 'addEventListener' : 'removeEventListener';
      this.$endGame.btExit[method]('click', this.handleExit);
      // window[method]('beforeunload', this.handleBeforeUnload);
      window[method]('popstate', this.handleBackButton);
   }

   handleExit = () => {
      RouterNavigation.navigateTo(RouterNavigation.path.room);
      wsService.sendExitRoom(userService.getUser().id);
   }

   initValues() { }

   initService() {
      wsService.requestRoomData(userService.getUser().id);

      wsService.onRoomState(({ payload }) => {
         this.initStatusGame(
            payload.isStartedGame
         );
      })

      wsService.onPlayerQuantityOnlineRoom(({ payload }) => {
         this.updateStatusPlayer(
            payload.playerQuantity,
            payload.maxPlayerQuantity
         );
      })

      wsService.onStartGameRoomOk(() => {
         this.startGame();
      })

      wsService.onIntervalStartGameRoom(({ payload }) => {
         this.containers.timerContainer.setTime(payload.time);
         if (payload.time <= 0) {
            this.containers.timerContainer.remove();
            this.$board.graph.appendChild(this.containers.canvasAndTools);
            this.$player.chat.appendChild(this.containers.chatContainer);
         }
      })

      wsService.onWordSelectedRoom(({ payload }) => {
         this.isActiceElementSelectWord();
         this.containers.selectWordContainer.setWords(payload.words);
      })

      wsService.onRoomStateGame(({ payload }) => {
         this.updateState({
            round: payload.currentRound ?? "En espera...",
            word: payload.currentWord,
            cartoonist: payload.currentCartoonist,
            playerWin: payload.playerWin,
         });
      });

      wsService.onCurrentRoundTimeRoom(({ payload }) => {
         this.$board.time.textContent = `${payload.time}⌚`
      })

      wsService.onEndGameRoom(({ payload }) => {
         this.endGame(
            payload.score,
            payload.username,
            payload.avatar
         );
      })

      wsService.onNextRoundRoom(() => {
         if (!this.isActiceElementSelectWord()) {
            this.containers.selectWordContainer.initValue();
         };
         this.containers.canvasAndTools.clearDrawing();
         this.containers.canvasAndTools.disableCanvas();
         this.containers.chatContainer.enableChat();
      })
   }

   // * --[ Metodos de actualizacion ]--
   updateStatusPlayer(playerQuantity, maxPlayer) {
      this.$player.status.textContent = `${playerQuantity} / ${maxPlayer}`
   }

   startGame() {
      this.containers.actionContainer.remove();
      if (!this.$board.graph.contains(this.containers.timerContainer)) {
         this.$board.graph.appendChild(this.containers.timerContainer);
      }
   }

   endGame(score, username, avatar) {
      console.log(avatar, 'avatar');
      this.$endGame.win.classList.add('win--active');
      this.$endGame.win.querySelector("img").src = avatar;
      this.$endGame.win.querySelector(".win__score").textContent = username;
      this.$endGame.win.querySelector("p span").textContent = score;
   }

   initStatusGame(status) {
      if (!status) return;
      this.containers.actionContainer.remove();
      this.$board.graph.appendChild(this.containers.canvasAndTools);
      this.$player.chat.appendChild(this.containers.chatContainer);
   }

   isActiceElementSelectWord() {
      if (!this.$board.graph.contains(this.containers.selectWordContainer)) {
         this.$board.graph.appendChild(this.containers.selectWordContainer);
         return false
      }
      return true
   }

   updateState(state) {
      if (state.playerWin.isEndGame) {
         const { username, score, avatar } = state.playerWin
         this.endGame(username, score, avatar);
         return
      }
      if (state.round) {
         this.$board.statusRound.textContent = `Turno: ${state.round}`;
      }
      if (state.word) {
         this.containers.canvasAndTools.enableCanvas();
         this.containers.chatContainer.disableChat();
         this.$board.status.textContent = `Dibuja: ${state.word}`;
      }
      if (!state.word && state.cartoonist) {
         this.$board.status.textContent = `Dibujante: ${state.cartoonist}`;
         this.containers.chatContainer.enableChat();
      }
      this.containers.selectWordContainer.remove();
   }

   // wsService.sendExitRoom(userService.getUser().id);
   // handleBeforeUnload = (event) => {
   //    event.preventDefault();
   //    event.returnValue = "Si recarga la página, te desconectaras";
   // };
   handleBackButton = (event) => {
      event.preventDefault();
      const confirmExit = window.confirm("Si sales de la sala, te desconectarás. ¿Continuar?");
      if (!confirmExit) {
         window.history.pushState(null, "", location.pathname);
      }
   };
}

customElements.define('game-page', GamePage, { extends: 'div' });

