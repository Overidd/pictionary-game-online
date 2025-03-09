import './timerContainer.css';
import timerHtml from './timerContainer.html?raw';


export class TimerContainer extends HTMLDivElement {
   constructor() {
      super();
      this.innerHTML = timerHtml;
      this.classList.add('timer');
      this.time = this.querySelector('.timer__time')
   }
   connectedCallback() {
      console.log('TimerContainer connected');
   }

   setTime = (time) => {
      this.time.textContent = time;
   }
}

customElements.define('timer-container', TimerContainer, { extends: 'div' });