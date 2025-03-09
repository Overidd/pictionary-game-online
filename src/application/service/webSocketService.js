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

   // Cuando el usuario se unirse a la sala
   joinRoom(roomId, userId) {
      this.wsClient.sendMessage({ type: EtypeWss.JOIN_ROOM, payload: { roomId, userId } });
   }

   // Cuando el usuario deja la sala
   leaveRoom(roomId, userId) {
      this.wsClient.sendMessage({ type: EtypeWss.LEAVE_ROOM, payload: { roomId, userId } });
   }

   // Cuando el usuario solicita que esta listo para recibir los datos de la sala
   requestRoomData(userId) {
      this.wsClient.sendMessage({ type: EtypeWss.REQUEST_ROOM_DATA, payload: { userId } });
   }

   // Start the game
   startGame(userId) {
      this.wsClient.sendMessage({ type: EtypeWss.START_GAME, payload: { userId } });
   }
   readyGame(userId) {
      this.wsClient.sendMessage({ type: EtypeWss.READY_GAME, payload: { userId } });
   }

   selectWord(userId, word) {
      this.wsClient.sendMessage({ type: EtypeWss.SELECT_WORD, payload: { userId, word } });
   }
   sendCanvasImage(userId, base64Image) {
      this.wsClient.sendMessage({ type: EtypeWss.CANVAS_IMAGE_ROOM, payload: { userId, base64Image } });
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

   onIsPlayerCreatorRoom(callback) {
      eventEmitter.on('ws:isPlayerCreatorRoom', callback);
   }

   onRoomState(callback) {
      eventEmitter.on('ws:roomState', callback);
   }

   onPlayerQuantityOnlineRoom(callback) {
      eventEmitter.on('ws:playersQuantityOnlineRoom', callback);
   }

   onStartGameRoomOk(callback) {
      eventEmitter.on('ws:startGameRoomOk', callback);
   }

   onIntervalStartGameRoom(callback) {
      eventEmitter.on('ws:intervalStartGameRoom', callback);
   }
   onWordSelectedRoom(callback) {
      eventEmitter.on('ws:wordSelectedRoom', callback);
   }
   onRoomStateGame(callback) {
      eventEmitter.on('ws:roomStateGame', callback);
   }
   onCurrentRoundTimeRoom(callback) {
      eventEmitter.on('ws:currentRoundTimeRoom', callback);
   }
   onCanvasImageRoom(callback) {
      eventEmitter.on('ws:canvasImageRoom', callback);
   }

   onErrorStartGameRoom(callback) {
      eventEmitter.on('ws:errorStartGameRoom', callback);
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

