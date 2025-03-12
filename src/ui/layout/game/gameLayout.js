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
      this.$aside = {
         configContainerModal: this.querySelector('.config'),
         volume: this.querySelector('.config__item--volume'),
         logout: this.querySelector('.config__item--logout'),
         btnClose: this.querySelector('.config__btn-close'),
         btnOpen: this.querySelector('.btn-menu'),
      }

      this.#renderChildren(children);
   }

   connectedCallback() {
      this.loadingUser();
      this.initEvent();
      this.initResize();

   }
   disconnectedCallback() {
      this.$aside.logout.removeEventListener('click', this.handleLogout);
   }

   initEvent() {
      this.$aside.logout.addEventListener('click', this.handleLogout);
      this.$aside.volume.addEventListener('click', this.handleVolumen);
      this.$aside.btnClose.addEventListener('click', this.handleCloseModal)
      this.$aside.btnOpen.addEventListener('click', this.handleOpenModal)
   }

   initResize() {
      (window.outerWidth > 768)
         ? this.$aside.configContainerModal.setAttribute('open', true)
         : this.$aside.configContainerModal.removeAttribute('open')
   }


   //* --[ Metodos de eventos --]
   handleLogout = (e) => {
      e.preventDefault();
      userService.logout();
      wsService.closeConnection()
      RouterNavigation.navigateTo('login');
   }
   handleVolumen = (e) => {
      const [volume2, volumeOff] = e.currentTarget.children

      if (volume2.style.display === 'none') {
         volume2.style.display = 'block'
         volumeOff.style.display = 'none'
         return
      }
      volume2.style.display = 'none'
      volumeOff.style.display = 'block'
   }
   handleCloseModal = (e) => {
      this.$aside.configContainerModal.removeAttribute('open')
   }
   handleOpenModal = (e) => {
      this.$aside.configContainerModal.setAttribute('open', true)
   }

   //* --[ Metodos auxiliares ]-- 
   #renderChildren(children) {
      if (typeof children === 'string') {
         this.htmlmain.innerHTML = children;
         return
      }
      this.htmlmain.appendChild(new children());
   }

   loadingUser() {
      const { avatar, name } = userService.getUser()
      this.$user.avatar.src = avatar;
      this.$user.username.textContent = name;
   }
}

customElements.define('game-layout', GameLayout, { extends: 'div' });








