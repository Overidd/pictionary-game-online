import './roomPage.css';
import roomPageHtml from './roomPage.html?raw';
import { roomDataTest } from '../../../data/roomDataTest';
import { RouterNavigation } from '../../router/routerApp';
import { roomService, userService, wsService } from '../../factory';

class RoomPageEventUI {
   /**
    * @param {RoomPage} roomPage 
    */
   constructor(roomPage) {
      this.roomPage = roomPage;
   }

   initialEvent() {
      this.#observeRoomList();
      return this;
   }

   #observeRoomList() {
      const { list } = this.roomPage.$roomSearch;
      const observer = new IntersectionObserver((entries) => {
         entries.forEach((entry) => {
            if (!entry.isIntersecting) {
               entry.target.classList.add('hidden'); // Aplica la opacidad 
               return
            }
            entry.target.classList.remove('hidden'); // Lo vuelve visible 
         });
      });
      list.querySelectorAll('.room-item').forEach((item) => observer.observe(item));
   }
}

class RoomPageRender {
   /**
    * @param {Array<RoomEntity>} data 
    * @returns {string}
    */
   static createItem(data) {
      if (!data) return '';
      return data.map(({ id, roomName, maxPlayerQuantity, playerQuantity, roundQuantity }) => {
         return `
         <li class="room-item" data-id="${id}">
            <span class="room-item__name">${roomName}</span>
            <div class="room-item__info">
               <small class="room-item__round-count">Rondas ${roundQuantity}</small>
               <small class="room-item__player-count">${playerQuantity}/${maxPlayerQuantity}</small>
               <img class="room-item__icon" src="icon/user.svg" alt="avatar username">
            </div>
         </li>
         `
      }).join('');
   }
}

export class RoomPage extends HTMLDivElement {
   constructor() {
      super();
      this.innerHTML = roomPageHtml;
      this.className = 'room';

      this.$bt = {
         roomSearch: this.querySelector('.room__button--search'),
         roomCreate: this.querySelector('.room__button--create'),
      };

      this.$roomSearch = {
         form: this.querySelector('#room-search-form'),
         list: this.querySelector('.room-list'),
         inputSearch: this.querySelector('.room-search__input'),
      };

      this.$roomCreate = {
         form: this.querySelector('#room-create-form'),
         inputName: this.querySelector('.room-create__input--name'),
      };
   }

   connectedCallback() {
      this.initListener();
      this.initService();
      new RoomPageEventUI(this).initialEvent();
   }

   disconnectedCallback() {
      this.bindEvents('remove');
   }

   initListener() {
      this.bindEvents('add');
   }

   bindEvents(action) {
      const method = action === 'add' ? 'addEventListener' : 'removeEventListener';
      this.$bt.roomSearch[method]('click', this.handleSearchRoom);
      this.$bt.roomCreate[method]('click', this.handleCreateRoom);
      this.$roomSearch.inputSearch[method]('input', this.handleInputSearch);
      this.$roomCreate.form[method]('submit', this.handleSubmitCreateRoom);
      this.$roomSearch.list[method]('click', this.handleJoinRoom);
   }

   initService() {
      wsService.sendExitRoom(userService.getUser().id);
      wsService.onRooms((room) => {
         this.$roomSearch.list.innerHTML = RoomPageRender.createItem(room);
      })
   }

   //* --[ Metodos de eventos ]--
   handleInputSearch = (e) => {
      const { value } = e.target;
      if (!value || !value.trim()) {
         // this.$roomSearch.list.innerHTML = RoomPageRender.createItem(roomDataTest);
         return
      }
      const dataFilterd = roomDataTest.filter(({ name }) => name.toLowerCase().includes(value.toLowerCase()));
      // this.$roomSearch.list.innerHTML = RoomPageRender.createItem(dataFilterd);
   }
   handleSearchRoom = (e) => {
      this.#toggleForm(true);
   };

   handleCreateRoom = (e) => {
      this.#toggleForm(false);
      this.$roomCreate.inputName.focus();
   };

   #toggleForm(isSearchActive) {
      this.$roomSearch.form.classList.toggle('room-search--active', isSearchActive);
      this.$roomCreate.form.classList.toggle('room-create--active', !isSearchActive);
      this.$bt.roomSearch.classList.toggle('room__button--active', isSearchActive);
      this.$bt.roomCreate.classList.toggle('room__button--active', !isSearchActive);
   }

   //* --[ Metodos de servicios ]--
   handleSubmitCreateRoom = (e) => {
      e.preventDefault();
      const from = new FormData(e.target);
      const { id } = userService.getUser();
      roomService.create({
         nameRoom: from.get('name'),
         creatorId: id,
         playerQuantity: from.get('players'),
         roundQuantity: from.get('rounds'),
      });
      e.target.reset();
   }

   handleJoinRoom = (e) => {
      const roomId = e.target.closest('.room-item').getAttribute('data-id');
      if (!roomId) return;
      const { id } = userService.getUser();
      wsService.joinRoom(roomId, id);
      wsService.onJoinRoom(({ payload }) => {
         if (!payload) return
         RouterNavigation.navigateTo(RouterNavigation.path.game);
      })
   }
}

customElements.define('room-page', RoomPage, { extends: 'div' });
