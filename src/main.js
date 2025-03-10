import './ui/styles/normalize.css';
import './style.css';
import './ui/styles/buttons.css';
import './ui/styles/input.css';
import './config/iconConfig.js';
import backgroundHTML from './ui/layout/baseLayout.html?raw';
import { RouterApp } from './ui/router';

document.querySelector('#background').innerHTML = backgroundHTML;
new RouterApp(document.querySelector('#app'))
.onInit()
.onNavigate()
.onPopState()
.onRouterRequest();