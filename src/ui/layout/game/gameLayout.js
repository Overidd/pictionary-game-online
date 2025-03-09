import { userService, wsService } from '../../factory';
import { RouterNavigation } from '../../router/routerApp';
import './gameLayout.css';
import layoutHTML from './gameLayout.html?raw';


export class GameLayout extends HTMLDivElement {
   constructor(children) {
      super();
      this.innerHTML = layoutHTML;
      this.classList = 'layout layout--game';

      this.htmlmain = this.querySelector('.layout__main');

      this.$user = {
         avatar: this.querySelector('.config__avatar-img'),
         username: this.querySelector('.config__avatar-username'),
      }

      this.$logout = this.querySelector('.config__item--logout');

      this.#renderChildren(children);
   }

   connectedCallback() {
      this.loadingUser();
      this.initEvent()
   }

   initEvent() {
      this.$logout.addEventListener('click', this.handleLogout);
   }

   handleLogout = (e) => {
      e.preventDefault();
      userService.logout();
      wsService.closeConnection()
      RouterNavigation.navigateTo('login');
   }

   #renderChildren(children) {
      if (typeof children === 'string') {
         this.htmlmain.innerHTML = children;
         return
      }
      // console.log(new children());
      // this.mainElement = this.querySelector('.layout__main')
      this.htmlmain.appendChild(new children());
   }


   loadingUser() {
      const { avatar, name } = userService.getUser()
      this.$user.avatar.src = avatar;
      this.$user.username.textContent = name;
   }
}

customElements.define('game-layout', GameLayout, { extends: 'div' });








