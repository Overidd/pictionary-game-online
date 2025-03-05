import './timerContainer.css';
import timerHtml from './timerContainer.html?raw';


export class TimerContainer extends HTMLDivElement {
   constructor() {
      super();
      this.shadowRoot.innerHTML = timerHtml;
      this.classList.add('timer');
   }

   connectedCallback() {   
      console.log('TimerContainer connected');
   }
}

customElements.define('timer-container', TimerContainer);