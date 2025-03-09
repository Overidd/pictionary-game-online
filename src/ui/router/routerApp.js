import { initialIcons } from "../../config";
import { AuthLayout } from "../layout/auth";
import { GameLayout } from "../layout/game/gameLayout";
import { GamePage } from "../page/game/gamePage";
import { LoginPage } from "../page/login";
import { RoomPage } from "../page/room";

const router = {
   '/login': {
      'layout': AuthLayout,
      'component': LoginPage,
   },
   '/room': {
      'layout': GameLayout,
      'component': RoomPage,
   },
   '/game': {
      'layout': GameLayout,
      'component': GamePage,
   },
   '404': {
      'layout': AuthLayout,
      'component': LoginPage,
   }
}

export class RouterNavigation {
   static path = {
      'login': '/login',
      'room': '/room',
      'game': '/game',
      '404': '404'
   };

   static navigateTo(path) {
      history.pushState({}, '', path);

      window.dispatchEvent(new CustomEvent('router-navigate'));
   }
}

export class RouterApp {
   /**
    * @param {HTMLElement} elementRoot
    */
   constructor(elementRoot) {
      this.router = router;
      this.elementRoot = elementRoot;
   }

   #renderPage() {
      const path = window.location.pathname;
      const route = this.router[path] || this.router['404'];

      if ('layout' in route) {
         const Layout = route['layout'];
         this.elementRoot.innerHTML = '';
         this.elementRoot.appendChild(new Layout(route.component));
         initialIcons();
         return
      }

      if ('component' in route) {
         this.elementRoot.innerHTML = route.component;
      }
   }

   onInit() {
      this.#renderPage();
      return this;
   }

   onNavigate() {
      document.addEventListener('click', (e) => {
         const path = e.target.matches('[data-link]');
         if (e.target.matches('[data-link]')) {
            e.preventDefault();
            const url = e.target.getAttribute('href') || '404';
            history.pushState({}, '', url);
            this.#renderPage();
            // this.navigateTo(url);
         }
      });
      return this;
   }
   // navigateTo(path) {
   // }

   onPopState() {
      window.addEventListener('popstate', () => {
         this.#renderPage();
      })
      // window.onpopstate = this.#renderPage;
      return this;
   }

   onRouterRequest() {
      window.addEventListener('router-navigate', () => {
         this.#renderPage();
      })
   }
}