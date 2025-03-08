import { eventEmitter } from '../../domain/event';
import { EtypeWss } from '../../domain/interface/typeWss';
import { roomsMapper } from '../mapper/room.mappers';

export class WebSocketClient {
   static instance;
   socket;
   url;
   reconnectAttempts = 0;
   maxReconnectAttempts = 4; // Número máximo de intentos de reconexión
   reconnectInterval = 5000; // Tiempo entre intentos de reconexión (5s)
   isManualClose = false; // Para evitar reconectar en cierres intencionales

   constructor() { }


   static get getInstance() {
      if (!WebSocketClient.instance) {
         WebSocketClient.instance = new WebSocketClient();
      }
      return WebSocketClient.instance;
   }

   /**
    * Conectar al WebSocket
    * @param {string} url 
    */
   connect(url) {
      this.url = url ?? localStorage.getItem('ws_url'); // Usa la URL almacenada si existe
      if (!this.url) {
         console.warn('Vuelve a iniciar sesión.');
         return false;
      }

      localStorage.setItem('ws_url', this.url); // Guarda la URL para la reconexión

      this.socket = new WebSocket(this.url);

      this.socket.onopen = () => {
         console.log('Conectado al servidor WebSocket');
         // this.reconnectAttempts = 0; // Reinicia los intentos
         eventEmitter.emit('ws:connected', null);
      };

      this.socket.onmessage = (event) => {
         const data = JSON.parse(event.data);

         if (data.type === EtypeWss.NEWROOM) {
            eventEmitter.emit('ws:newRoom', data);
         }

         if (data.type === EtypeWss.ROOMS) {
            eventEmitter.emit('ws:rooms', roomsMapper(data.payload));
         }

         if (data.type === EtypeWss.JOINROOM) {
            eventEmitter.emit('ws:joinRoom', data);
         }

         if (data.type === EtypeWss.ERROR) {
            eventEmitter.emit('ws:error', data);
         }

         if (data.type === EtypeWss.PLAYERSONLINEROOM) {
            eventEmitter.emit('ws:playersOnlineRoom', data);
         }
      };

      this.socket.onclose = () => {
         console.log('Desconectado del servidor WebSocket');

         eventEmitter.emit('ws:disconnected', null);

         // Intentar reconectar si la desconexión no fue manual
         if (!this.isManualClose) {
            this.reconnect();
         }
      };

      this.socket.onerror = (error) => {
         console.error('Error en WebSocket:', error);
         eventEmitter.emit('ws:error', error);
      };

      return true
   }

   /**
    * Intentar reconectar con límites
    */
   reconnect() {
      if (this.reconnectAttempts < this.maxReconnectAttempts) {
         this.reconnectAttempts += 1;
         console.log(`Intentando reconectar... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
         setTimeout(() => this.connect(), this.reconnectInterval);
      } else {
         console.warn('Máximo de intentos de reconexión alcanzado.');
         this.close()
      }
   }

   /**
    * Enviar mensaje por WebSocket
    * @param {Object} message 
    */
   sendMessage({ type, payload }) {
      if (this.socket && this.socket.readyState === WebSocket.OPEN) {

         this.socket.send(JSON.stringify({ type, payload }));

      } else {
         console.warn('El WebSocket no está conectado.');
      }
   }

   /**
    * Cerrar la conexión manualmente
    */
   close() {
      this.isManualClose = true;
      this.socket?.close();
      localStorage.removeItem('ws_url'); // Eliminar URL si el usuario cierra manualmente
   }
}

// export const wsClient = new WebSocketClient();
// wsClient.sendMessage