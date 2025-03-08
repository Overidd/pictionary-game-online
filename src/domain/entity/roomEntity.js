


export class RoomEntity {

   constructor(
      id,
      roomName,  //Nombre de la sala
      creatorId,   // Id del user creador de la sala
      players = [], // cantidad de jugadores actuales en la sala
      maxPlayers, // Cantidad de jugadores en la sala
      roundQuantity,  // Cantidad de rondas en el juego
   ) {
      this.id = id;
      this.roomName = roomName;
      this.creatorId = creatorId;
      this.players = players;
      this.playersQuantity = this.players.length
      this.maxPlayersQuantity = maxPlayers;
      this.roundQuantity = roundQuantity;
   }

   static fromObject({ id, roomName, creatorId, players, maxPlaters, roundQuantity }) {
      return new RoomEntity(id, roomName, creatorId, players, maxPlaters, roundQuantity);
   }
}
