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
      console.log(path);
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





// import { createLayout } from "./layout.js";

// document.addEventListener("DOMContentLoaded", () => {
//   createLayout(); // Renderiza el Layout
//   loadPage(window.location.pathname); // Carga la página actual

//   document.body.addEventListener("click", (e) => {
//     if (e.target.matches("[data-link]")) {
//       e.preventDefault();
//       const url = e.target.getAttribute("href");
//       history.pushState({}, "", url);
//       loadPage(url);
//     }
//   });

//   window.addEventListener("popstate", () => {
//     loadPage(window.location.pathname);
//   });
// });

// async function loadPage(route) {
//   const content = document.getElementById("content");
//   try {
//     const response = await fetch(`/src/pages${route}.html`);
//     content.innerHTML = await response.text();
//   } catch {
//     content.innerHTML = "<h2>Página no encontrada</h2>";
//   }
// }




// import { setupContact } from "./pages/contact.js";

// const routes = {
//   "/": "pages/home.html",
//   "/about": "pages/about.html",
//   "/contact": "pages/contact.html",
// };

// function navigateTo(url) {
//   history.pushState(null, null, url);
//   renderPage();
// }

// async function renderPage() {
//   const path = window.location.pathname;
//   const pageUrl = routes[path] || routes["/"];

//   try {
//     const response = await fetch(pageUrl);
//     const html = await response.text();
//     document.getElementById("app").innerHTML = html;

//     // Ejecutar scripts específicos según la ruta
//     if (path === "/contact") {
//       setupContact();
//     }
//   } catch (error) {
//     console.error("Error cargando la página:", error);
//   }
// }

// // Capturar clics en los enlaces
// document.addEventListener("click", (e) => {
//   if (e.target.matches("[data-link]")) {
//     e.preventDefault();
//     navigateTo(e.target.href);
//   }
// });

// // Manejar el botón "atrás"
// window.addEventListener("popstate", renderPage);

// // Cargar la página inicial
// renderPage();








