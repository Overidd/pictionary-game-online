import { roomMapper, roomsMapper } from "../../infrastructure/mapper/room.mappers";
import { userMapper } from "../../infrastructure/mapper/user.mappers";

export class RoomService {
   // Instancia única del singleton
   static instance = null;

   // Sala actual que el usuario se unió

   /**
    * @param {RoomApi} RoomApi
   */
   constructor(RoomApi) {
      this.currentRooml = null;
      this.roomApi = RoomApi;
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
      const room = await this.roomApi.create(
         nameRoom,
         creatorId,
         playerQuantity,
         roundQuantity
      );
      console.log(room);
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

   getPlayers() {
      return this.currentRoom?.players || [];
   }

   getMaxPlayers() {
      return this.currentRoom?.maxPlayersQuantity || 0;
   }


   getCurrentRoom() {
      return this.currentRoom;
   }
}
