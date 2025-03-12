import './timerContainer.css';
import timerHtml from './timerContainer.html?raw';

export class TimerContainer extends HTMLDivElement {
   constructor() {
      super();
      this.innerHTML = timerHtml;
      this.classList.add('timer');
      this.time = this.querySelector('.timer__time')
      this.timeSound = this.querySelector('.timer__sound')
   }
   connectedCallback() {
      this.timeSound.play().catch(error => console.warn('Autoplay bloqueado por el navegador'));
   }

   setTime = (time) => {
      this.time.textContent = time;
   }
}

customElements.define('timer-container', TimerContainer, { extends: 'div' }); 