import { UserEntity } from '../../../domain/entity';
import { userMapper } from '../../../infrastructure/mapper';
import { wsService } from '../../factory';
import './userContainer.css';
import usersHtml from './userContainer.html?raw';


export class UserContainerRender {
   /**
    * 
    * @param {Array<UserEntity>} data 
    * @returns {string}
    */
   static renderUser(data = []) {
      return data.map(({ name, avatar, score, isReady }) => {
         return `
            <li class="user ${isReady ? 'user--ready' : ''}">
               <figure class="user__figure">
                  <img class="user__avatar" src="${avatar}" alt="avatar ${name}">
               </figure>
               <span class="user__username">${name}</span>
               <div class="user__status"></div>
               <small class="user__score">${score}</small>
            </li>
      `
      }).join('');
   }
}

export class UserContainer extends HTMLUListElement {
   constructor() {
      super();
      this.className = 'users';
      this.innerHTML = usersHtml;
   }

   connectedCallback() {
      this.socket();
   }

   initEvent() { }

   initValues() {

   }
   socket() {
      wsService.onPlayerOnlineRoom(({ payload }) => {
         this.innerHTML = UserContainerRender.renderUser(payload.map(user => userMapper(user)));
      })
   }
}

customElements.define('user-container', UserContainer, { extends: 'ul' });