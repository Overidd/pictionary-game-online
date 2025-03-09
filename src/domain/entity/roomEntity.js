


export class RoomEntity {

   constructor(
      id,
      roomName,  //Nombre de la sala
      creatorId,   // Id del user creador de la sala
      players = [], // cantidad de jugadores actuales en la sala
      maxPlayerQuantity, // Cantidad de jugadores en la sala
      roundQuantity,  // Cantidad de rondas en el juego
      playerQuantity,
   ) {
      this.id = id;
      this.roomName = roomName;
      this.creatorId = creatorId;
      this.players = players;
      this.playerQuantity = playerQuantity || this.players.length
      this.maxPlayerQuantity = maxPlayerQuantity;
      this.roundQuantity = roundQuantity;
   }

   static fromObject({ id, roomName, creatorId, players, maxPlayerQuantity, roundQuantity, playerQuantity }) {
      return new RoomEntity(id, roomName, creatorId, players, maxPlayerQuantity, roundQuantity, playerQuantity);
   }
}
