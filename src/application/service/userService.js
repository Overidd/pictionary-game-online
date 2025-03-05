import { UserEntity } from "../../domain/entity/UserEntity";

export class UserService {
   /**
    * @param {UserStorage} UserStorage 
    * @param {AvatarService} AvatarService 
    * @returns 
    */
   constructor(UserStorage, AvatarService) {
      this.userStorage = UserStorage;
      this.avatarService = AvatarService;

      if (UserService?.instance) {
         return UserService.instance;
      }

      this.user = this.userStorage.getUser();
      UserService.instance = this;
      this.#validate();
   }

   #validate() {
      if (!this.userStorage || !this.avatarService) {
         throw new Error("UserService is already initialized");
      }
   }

   // Crear un nuevo usuario y guardarlo
   async createUser(name) {
      this.user = new UserEntity({
         name,
         avatar: this.avatarService.getAvatarFromLocalStorage()
      });
      this.userStorage.saveUser(this.user);
   }

   // Obtener usuario actual
   async getUser() {
      return this.user;
   }

   async logout() {
      this.userStorage.logout();
      this.user = null;
   }

   static getInstance() {
      return new UserService();
   }
   // // Actualizar puntaje del usuario
   // updateScore(points) {
   //    this.user.score += points;
   // }

   // Cerrar sesión y limpiar usuario
}

