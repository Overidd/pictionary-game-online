import { roomMapper, userMapper } from "../../infrastructure/mapper";

export class RoomService {
   // Instancia única del singleton
   static instance = null;


   /**
    * @param {RoomApi} RoomApi
   */
   constructor(RoomApi) {
      this.roomApi = RoomApi;
      this.rooms = new Map();
   }

   static getInstance(RoomApi) {
      if (!RoomService.instance) {
         RoomService.instance = new RoomService(RoomApi);
      }
      return RoomService.instance;
   }

   async create({
      nameRoom,
      creatorId,
      playerQuantity,
      roundQuantity,
   }) {
      await this.roomApi.create(
         nameRoom,
         creatorId,
         playerQuantity,
         roundQuantity
      );
   }

   joinRoom({ players, ...data }) {
      try {
         this.currentRoom = roomMapper({
            ...data,
            players: players.map(player => userMapper(player)),
         });

         return true
      } catch (error) {
         console.error(`Error interno: ${error}`);
         return false
      }
   }

   appendAllRooms(rooms) {
      this.rooms = new Map(rooms.map(room => [room.id, room]));
   }
}
