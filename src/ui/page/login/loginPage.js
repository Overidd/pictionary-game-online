import './loginPage.css';
import loginHtml from './loginPage.html?raw';
import { avatarService, userService } from '../../factory';
import { RouterNavigation } from '../../router/routerApp';

export class LoginPage extends HTMLFormElement {
   constructor() {
      super();
      this.innerHTML = loginHtml;
      this.className = 'login';

      this.inputElement = this.querySelector('.login__input');
      this.iconElement = this.querySelector('.login__avatar');
      this.btReloadAvatar = this.querySelector('.login__icon');
      this.isLoadingAvatar = false;
   }

   connectedCallback() {
      this.inputElement.focus();
      this.getAvatarSVG();
      this.bindEvents('add');
   }

   disconnectedCallback() {
      this.bindEvents('remove');
   }

   bindEvents(action) {
      const method = action === 'add' ? 'addEventListener' : 'removeEventListener';
      this[method]('submit', this.handleSubmit);
      this.inputElement[method]('input', this.handleInput);
      this.btReloadAvatar[method]('click', this.handleAvatarClick);
   }

   async handleSubmit(e) {
      e.preventDefault();
      const username = new FormData(this).get('username');
      if (!this.validateInput(username)) return;

      try {
         await userService.createUser(username);
         this.inputElement.value = '';
         RouterNavigation.navigateTo(RouterNavigation.path.room);
      } catch (err) {
         console.warn('El usuario ya existe');
         this.showErrorMessage('Este usuario ya está registrado.');
      }
   }

   handleInput = (e) => {
      this.validateInput(e.target.value);
   }

   handleAvatarClick = () => {
      if (this.isLoadingAvatar) return;
      this.isLoadingAvatar = true;
      this.btReloadAvatar.setAttribute('disabled', 'true');
      this.getAvatarSVG();
   }

   getAvatarSVG() {
      avatarService.getRandomAvatar()
         .then((avatar) => {
            this.iconElement.style.backgroundImage = `url(${avatar})`;
            this.iconElement.classList.remove('login__avatar--loading');
         }).catch((error) => {
            this.iconElement.classList.add('login__avatar--loading');
            console.error("Error al cargar avatar:", error);
         }).finally(() => {
            this.isLoadingAvatar = false;
            this.btReloadAvatar.removeAttribute('disabled');
         });
   }

   validateInput(username) {
      const isValid = username?.trim() && /^[a-zA-Z][a-zA-Z0-9._]{2,19}$/.test(username);
      this.inputElement.classList.toggle('login__input--error', !isValid);
      return isValid;
   }

   showErrorMessage(message) {
      const errorElement = this.querySelector('.login__error') || document.createElement('p');
      errorElement.textContent = message;
      errorElement.className = 'login__error';
      this.appendChild(errorElement);
   }
}

customElements.define('login-page', LoginPage, { extends: 'form' });
