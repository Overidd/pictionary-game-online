import { GameService, WebSocketService } from '../../application';
import { WebSocketClient } from '../../infrastructure/ws';
import { RouterNavigation } from '../router/routerApp';

export const wsService = new WebSocketService(WebSocketClient.getInstance);
export const gameService = new GameService();

// window.addEventListener('beforeunload', () => {
//    if (WebSocketClient.getInstance.socket) {
//       WebSocketClient.getInstance.isManualClose = true;
//       WebSocketClient.getInstance.close();
//    }
// });


// Evento de reconexión a WebSocket
window.addEventListener('DOMContentLoaded', (e) => {
   const isConnected = WebSocketClient.getInstance.connect()
   if (!isConnected) {
      RouterNavigation.navigateTo('login');
   }
})

// wsService.onPlayerOnlineRoom(({ payload }) => {
//    gameService.setAllPlayers(payload);
// })

// wsService.onPlayerQuantityOnlineRoom(({ payload }) => {
//    gameService.setPlayerQuantity(payload);
// })

wsService.onError((error) => {
   console.warn('Error en WebSocket:', error);
})

// wsService.onNewRoom((room) => {
//    console.log('Nueva sala creada:', room);
// });

// Listener para cualquier mensaje recibido
wsService.onMessage((data) => {
   console.log('Mensaje recibido del servidor:', data);
});
