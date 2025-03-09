import { RoomEntity } from "../../domain/entity";



export const roomsMapper = (rooms = []) => {
   return rooms.map(({ id, name, creatorId, players, maxPlayerQuantity, roundQuantity, playerQuantity }) => {

      return RoomEntity.fromObject({
         id,
         roomName: name,
         creatorId: creatorId,
         players: players,
         maxPlayerQuantity: maxPlayerQuantity,
         roundQuantity: roundQuantity,
         playerQuantity,
      });
   });
}
   ;


export const roomMapper = (room) => {
   const { id, name, creatorId, players, maxPlayerQuantity, roundQuantity, playerQuantity } = room;

   return RoomEntity.fromObject({
      id,
      roomName: name,
      creatorId: creatorId,
      players: players,
      maxPlayerQuantity: maxPlayerQuantity,
      roundQuantity: roundQuantity,
      playerQuantity,
   });
}
   ;