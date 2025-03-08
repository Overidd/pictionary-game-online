import { AvatarService, UserService } from '../../application';
import { ApiUser } from '../../infrastructure/api';
import { UserStorage } from '../../infrastructure/storage';
import { WebSocketClient } from '../../infrastructure/ws';


export const userService = new UserService(
   UserStorage,
   ApiUser,
   AvatarService,
   WebSocketClient.getInstance
); 
