import { CustomError } from "../../domain/error/custom.error";
import { userMapper } from "../mapper/user.mappers";


export class ApiUser {
   /**
    * 
    * @param {String} username 
    * @param {String} avatar 
    * @returns {UserEntity}
    */
   static async register(username, avatar) {
      // const response = await fetch('http://localhost:3000/api/user/create', {
      const response = await fetch(`${import.meta.env.VITE_API_URL_GAME}/user/create`, {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ username, avatar })
      });
      const data = await response.json();

      if (!response.ok) throw CustomError.fetchError(response.status, data.message);

      return userMapper(data);
   }
}

