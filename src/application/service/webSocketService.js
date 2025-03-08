import { eventEmitter } from '../../domain/event';
import { EtypeWss } from '../../domain/interface/typeWss';

export class WebSocketService {
   wsClient;

   /**
    * 
    * @param {WebSocketClient} wsClient 
    */
   constructor(wsClient) {
      this.wsClient = wsClient;

      this.validateParams();
   }

   validateParams() {
      if (!this.wsClient) {
         throw new Error('WebSocketClient is not initialized');
      }
   }

   joinRoom(roomId, userId) {
      this.wsClient.sendMessage({ type: EtypeWss.JOINROOM, payload: { roomId, userId } });
   }

   /**
    * @param {(data: any) => void} callback 
    */
   onNewRoom(callback) {
      eventEmitter.on('ws:newRoom', callback);
   }

   onRooms(callback) {
      eventEmitter.on('ws:rooms', callback);
   }

   onJoinRoom(callback) {
      eventEmitter.on('ws:joinRoom', callback)
   }

   onPlayerOnlineRoom(callback) {
      eventEmitter.on('ws:playersOnlineRoom', callback);
   }

   onError(callback) {
      eventEmitter.on('ws:error', callback);
   }

   /**
    * @param {(data: any) => void} callback 
    */
   onMessage(callback) {
      eventEmitter.on('ws:message', callback);
   }

   closeConnection() {
      this.wsClient.close();
   }
}

