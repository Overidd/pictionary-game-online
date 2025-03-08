import { RoomEntity } from "../../domain/entity";



export const roomsMapper = (rooms = []) => {
   // console.log(rooms);
   return rooms.map(({ id, name, creatorId, players, player_quantity, round_quantity }) => {

      return RoomEntity.fromObject({
         id,
         roomName: name,
         creatorId: creatorId,
         players: players,
         maxPlaters: player_quantity,
         roundQuantity: round_quantity,
      });
   });
}
   ;


export const roomMapper = (room) => {
   const { id, name, creatorId, players, player_quantity, round_quantity } = room;

   return RoomEntity.fromObject({
      id,
      roomName: name,
      creatorId: creatorId,
      players: players,
      maxPlaters: player_quantity,
      roundQuantity: round_quantity,
   });
}
   ;