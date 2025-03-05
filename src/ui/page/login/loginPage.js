import './loginPage.css';
import loginHtml from './loginPage.html?raw';
import { avatarService, userService } from '../../factory';
import { RouterNavigation } from '../../router/routerApp';
// import { RouterNavigation } from '../../router';
// import { RouterNavigation } from '../../router/routerApp';

export class LoginPage extends HTMLFormElement {
   constructor() {
      super();
      // const template = document.createElement('template');
      // template.innerHTML = loginHtml;
      // this.appendChild(template.content.cloneNode(true));

      this.innerHTML = loginHtml;
      this.className = 'login';

      this.inputElement = this.querySelector('.login__input');
      this.iconElement = this.querySelector('.login__avatar');
      this.btReloadAvatar = this.querySelector('.login__icon');
   }

   connectedCallback() {
      console.log('LoginPage connected');
      this.inputElement.focus();
      this.getAvatarSVG();
      this.events();
   }

   events() {
      this.addEventListener('submit', this.handleSubmit);
      this.inputElement.addEventListener('input', this.handleInput);
      this.btReloadAvatar.addEventListener('click', this.handleAvatarClick);
   }

   disconnectedCallback() {
      this.removeEventListener('submit', this.handleSubmit);
      this.inputElement.removeEventListener('input', this.handleInput);
      this.btReloadAvatar.removeEventListener('click', this.handleAvatarClick);
   }

   handleSubmit = (e) => {
      e.preventDefault();
      const username = new FormData(this).get('username');
      if (!this.validateInput(username)) return;

      // TODO: descomentar para crear el usuario
      userService.createUser(username);
      this.inputElement.value = '';
      RouterNavigation.navigateTo(RouterNavigation.path.room);
   }

   handleInput = (e) => {
      this.validateInput(e.target.value);
   }

   handleAvatarClick = () => {
      if (this.isLoadingAvatar) return;
      this.isLoadingAvatar = true;
      this.getAvatarSVG();
   }

   getAvatarSVG() {
      avatarService.getRandomAvatar()
         .then((avatar) => {
            this.iconElement.style.backgroundImage = `url(${avatar})`;
            this.iconElement.classList.remove('login__avatar--loading');

         }).catch((error) => {
            // this.onErrorAvatar(error);
            this.iconElement.classList.add('login__avatar--loading');
            console.error("Error al cargar avatar:", error);
         })
         .finally(() => {
            this.isLoadingAvatar = false;
         });
   }

   validateInput(username) {
      const isValid = username?.trim() && username.length >= 3;
      this.inputElement.classList.toggle('login__input--error', !isValid);
      return isValid;
   }
}
customElements.define('login-page', LoginPage, { extends: 'form' });
