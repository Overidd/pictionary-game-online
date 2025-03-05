import { AvatarService } from "../../application";
import { UserService } from "../../application/service/UserService";
import { UserStorage } from "../../infrastructure/userStorage";


export const userService = new UserService(UserStorage, AvatarService); 
