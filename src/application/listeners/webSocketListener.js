// import { EtypeWss } from "../../domain/interface/typeWss";
import { WebSocketClient } from "../../infrastructure/ws";
import { WebSocketService } from "../service/WebSocketService";


export const wsService = new WebSocketService(WebSocketClient.getInstance);


// wsService.onRooms((rooms) => {
//    console.log("Salas disponibles:", rooms);
//    // Aquí podrías actualizar el estado de React, mostrar un modal, etc.
// });

// // Listener cuando se crea una nueva sala
// wsService.onNewRoom((room) => {
//    console.log("Nueva sala creada:", room);
//    // Aquí podrías actualizar el estado de React, mostrar un modal, etc.
// });

// // Listener para cualquier mensaje recibido
// wsService.onMessage((data) => {
//    console.log("Mensaje recibido del servidor:", data);
// });



// export class listenWebSocketEvents {
//    constructor() {
//       this.wsService = new WebSocketService(WebSocketClient.getInstance);
//    }

//    // Listener cuando se crea una nueva sala
//    onNewRoom(callback) {
//       this.wsService.onNewRoom(callback);
//    }

//    // Listener para cualquier mensaje recibido
//    onMessage(callback) {
//       this.wsService.onMessage((data) => {
//          if (data.type === EtypeWss.ROOMSTATE) {
//             console.log("Estado de la sala actualizado:", data);
//             callback(data);
//          }

//          if (data.type === EtypeWss.NEWROOM) {
//             console.log("Nueva sala creada:", data);
//             callback(data);
//          }
//       });
//    }
// };