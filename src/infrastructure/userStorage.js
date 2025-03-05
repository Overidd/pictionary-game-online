import { UserEntity } from "../domain/entity/UserEntity";

export class UserStorage {

   /**
    * @param {UserEntity} user 
    * @returns {UserEntity}
    */
   // Guardar usuario en localStorage
   static saveUser(user) {
      localStorage.setItem('user', JSON.stringify(user));
      return user;
   }

   // Obtener la instancia única del usuario
   /**
    * @returns {UserEntity}
    */
   static getUser() {
      const data = localStorage.getItem('user');
      if (data) {
         const { id, name, score, avatar } = JSON.parse(data);
         return new UserEntity({ id, name, score, avatar });
      }
      return null;
   }

   static logout() {
      localStorage.removeItem("user");
      this.user = null;
   }
}

