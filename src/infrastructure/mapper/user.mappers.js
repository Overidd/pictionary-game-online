import { UserEntity } from '../../domain/entity/userEntity';


export const userMapper = (user) => {
   const { username: name, avatar, score, isDrawing, isReady, id } = user;

   return new UserEntity({ name, avatar, score, isDrawing, isReady, id });
}
