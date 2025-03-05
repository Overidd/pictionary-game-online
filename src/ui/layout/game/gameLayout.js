import { userService } from '../../factory';
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

      this.#renderChildren(children);
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

   connectedCallback() {
      this.loadingUser();
   }

   loadingUser() {
      userService.getUser()
         .then(({ avatar, name }) => {
            this.$user.avatar.src = avatar;
            this.$user.username.textContent = name;
         })
   }

}

customElements.define('game-layout', GameLayout, { extends: 'div' });








