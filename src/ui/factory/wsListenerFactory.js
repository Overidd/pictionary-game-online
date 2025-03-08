import { WebSocketService } from '../../application';
import { WebSocketClient } from '../../infrastructure/ws';
import { RouterNavigation } from '../router/routerApp';

export const wsService = new WebSocketService(WebSocketClient.getInstance);

// window.addEventListener('beforeunload', () => {
//    if (WebSocketClient.getInstance.socket) {
//       WebSocketClient.getInstance.isManualClose = true;
//       WebSocketClient.getInstance.close();
//    }
// });

window.addEventListener('DOMContentLoaded', (e) => {
   console.log('DOMContentLoaded');
   // if (WebSocketClient.getInstance.socket) {
   // console.log('aaa');

   const isConnected = WebSocketClient.getInstance.connect()
   if (!isConnected) {
      RouterNavigation.navigateTo('login');
   }
   // }
})
// wsService.onJoinRoom((joinRoom) => {
//    console.log('Te uniste a la sala', joinRoom);
// })

wsService.onError((error) => {
   console.warn('Error en WebSocket:', error);
})

// wsService.onRooms((rooms) => {
//    console.log('Salas disponibles:', rooms);
// });
// Listener cuando se crea una nueva sala
wsService.onNewRoom((room) => {
   console.log('Nueva sala creada:', room);
});

// Listener para cualquier mensaje recibido
wsService.onMessage((data) => {
   console.log('Mensaje recibido del servidor:', data);
});
