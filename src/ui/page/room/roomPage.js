import './roomPage.css';
import { roomDataTest } from '../../../data/roomDataTest';
import { roomService, userService, wsService } from '../../factory';
import { RouterNavigation } from '../../router/routerApp';
import roomPageHtml from './roomPage.html?raw';

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
      return data.map(({ id, roomName, maxPlayersQuantity, playersQuantity }) => {
         return `
         <li class="room-item" data-id="${id}">
            <span class="room-item__name">${roomName}</span>
            <div class="room-item__info">
               <small class="room-item__player-count">${playersQuantity}/${maxPlayersQuantity}</small>
               <i class="room-icon__icon" data-lucide="user"></i>
            </div>
         </li>
         `
      }).join('');
   }
}

// 🎮 Componente Web
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
      wsService.onRooms((room) => {
         this.$roomSearch.list.innerHTML = RoomPageRender.createItem(room);
      })
      // this.$roomSearch.list.innerHTML = RoomPageRender.createItem(roomDataTest)
      new RoomPageEventUI(this).initialEvent();
      this.#initEvents();
   }

   #initEvents() {
      this.$bt.roomSearch.addEventListener('click', this.handleSearchRoom);
      this.$bt.roomCreate.addEventListener('click', this.handleCreateRoom);

      this.$roomSearch.inputSearch.addEventListener('input', this.handleInputSearch);
      this.$roomCreate.form.addEventListener('submit', this.handleSubmitCreateRoom);
      // this.$roomSearch.form.addEventListener('submit', this.handleSubmitCreateRoom);

      // Evento de las salas
      this.$roomSearch.list.addEventListener('click', this.handleJoinRoom);
   }

   handleInputSearch = (e) => {
      const { value } = e.target;

      if (!value || !value.trim()) {
         // this.$roomSearch.list.innerHTML = RoomPageRender.createItem(roomDataTest);
         return
      }
      const dataFilterd = roomDataTest.filter(({ name }) => name.toLowerCase().includes(value.toLowerCase()));

      // this.$roomSearch.list.innerHTML = RoomPageRender.createItem(dataFilterd);
   }

   handleJoinRoom = async (e) => {
      if (!e.target.matches('.room-item') || !e.target.hasAttribute('data-id')) return;
      const roomId = e.target.getAttribute('data-id');
      const { id } = await userService.getUser();
      wsService.joinRoom(roomId, id);

      wsService.onJoinRoom(({ payload }) => {
         const isJoined = roomService.joinRoom(payload);
         if (!isJoined) return
         RouterNavigation.navigateTo(RouterNavigation.path.game);
      })
   }

   handleSearchRoom = (e) => {
      this.#toggleForm(true);
      // this.dispatchEvent(new RoomPageEvent('room-search-activated', { active: true }));
   };

   handleCreateRoom = (e) => {
      this.#toggleForm(false);
      this.$roomCreate.inputName.focus();
      // this.dispatchEvent(new RoomPageEvent('room-create-activated', { active: true }));
   };

   handleSubmitCreateRoom = async (e) => {
      e.preventDefault();
      const from = new FormData(e.target);
      const { id } = await userService.getUser();
      roomService.create({
         nameRoom: from.get('name'),
         creatorId: id,
         playerQuantity: from.get('players'),
         roundQuantity: from.get('rounds'),
      });

      e.target.reset();
   }

   #toggleForm(isSearchActive) {
      this.$roomSearch.form.classList.toggle('room-search--active', isSearchActive);
      this.$roomCreate.form.classList.toggle('room-create--active', !isSearchActive);
      this.$bt.roomSearch.classList.toggle('room__button--active', isSearchActive);
      this.$bt.roomCreate.classList.toggle('room__button--active', !isSearchActive);
   }
}

customElements.define('room-page', RoomPage, { extends: 'div' });
