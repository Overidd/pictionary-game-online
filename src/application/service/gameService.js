import { RoomEntity } from "../../domain/entity";
import { eventEmitter } from "../../domain/event";
import { roomMapper } from "../../infrastructure/mapper";

export class GameService {
   // Instancia única del singleton
   static instance = null;

   // Sala actual que el usuario se unió

   constructor() {
      this.currentRoom = new RoomEntity();
   }

   //* --[ Metodos de instancia ]-- 
   static getInstance(RoomApi) {
      if (!RoomService.instance) {
         RoomService.instance = new RoomService(RoomApi);
      }
      return RoomService.instance;
   }

   getCurrentRoom() {
      return this.currentRoom;
   }


   //* --[ Metodos del juego ]--
   /**
    * 
    * @param {RoomEntity} room 
    */
   initRoom(room) {
      if (!room) return
      this.currentRoom = roomMapper(room);
   }

   setAllPlayers(players) {
      if (!players) return
      this.currentRoom.players = players;
      // eventEmitter.emit('game:players', this.currentRoom);
   }

   get getMaxPlayers() {
      return this.currentRoom.maxPlayerQuantity;
   }

   isPlayerCreatorRoom() {
      // return this.currentRoom.creatorId === useStore.getState().user.id;
   }

   setPlayerQuantity({ playerQuantity }) {
      if (!playerQuantity) return
      this.currentRoom.playerQuantity = playerQuantity;
      // eventEmitter.emit('game:playerQuantity', this.currentRoom.playerQuantity);
   }

   //* --[ Eventos ]--
   // onPlayers = (callback) => eventEmitter.on('game:players', callback);

   // onPlayerQuantity = (callback) => eventEmitter.on('game:playerQuantity', callback);

   intervalStartGame(callback, timeInterval = 1000, timeOut = 5000) {
      return new Promise((resolve) => {
         let timer = 0;

         const interval = setInterval(() => {
            timer += timeInterval;
            callback((timeOut - timer) / timeInterval);
            if (timer >= timeOut) {
               clearInterval(interval);
               resolve();
            };
         }, timeInterval);
      })
   }
}
