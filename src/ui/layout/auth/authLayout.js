import layoutHtml from './authLayout.html?raw';
import './authLayout.css';


export class AuthLayout extends HTMLElement {

   constructor(children) {
      super();
      this.innerHTML = layoutHtml;
      this.classList = 'layout layout--auth'

      this.htmlmain = this.querySelector('.layout__main');
      this.#renderChildren(children);
   }

   #renderChildren(children) {
      if (typeof children === 'string') {
         this.mainElement.innerHTML = children;
         return
      }
      // console.log(new children());
      // this.mainElement = this.querySelector('.layout__main')
      this.htmlmain.appendChild(new children());
   }
}

customElements.define('auth-layout', AuthLayout, { extends: 'main' });

