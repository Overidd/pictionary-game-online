
export class RoomApi {
   static async getAll() {
      const response = await fetch(`${import.meta.env.VITE_API_URL_GAME}/rooms`);
      const rooms = await response.json();
      return rooms;
   }

   static async create(nameRoom, creatorId, playerQuantity, roundQuantity) {
      const response = await fetch(`${import.meta.env.VITE_API_URL_GAME}/room/create`, {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({
            name: nameRoom,
            creatorId: creatorId,
            maxPlayerQuantity: playerQuantity,
            roundQuantity: roundQuantity
         }),
      });
      const room = await response.json();
      return room;
   }
}
