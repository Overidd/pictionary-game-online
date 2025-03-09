// import { EtypeWss } from "../../domain/interface/typeWss";
import { WebSocketClient } from "../../infrastructure/ws";


export const wsService = new WebSocketService(WebSocketClient.getInstance);


