import { RoomService } from "../../application";
import { RoomApi } from "../../infrastructure/api";


export const roomService = new RoomService(RoomApi)
