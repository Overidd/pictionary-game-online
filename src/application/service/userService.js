export class UserService {
   /**
    * @param {UserStorage} UserStorage 
    * @param {ApiUser} apiUser
    * @param {AvatarService} AvatarService 
    * @param {WebSocketClient} WebSocketClient
    */
   constructor(UserStorage, apiUser, AvatarService, WebSocketClient) {
      this.userStorage = UserStorage;
      this.apiUser = apiUser;
      this.avatarService = AvatarService;
      this.wsClient = WebSocketClient; // Agregamos el cliente WebSocket

      if (UserService?.instance) {
         return UserService.instance;
      }
      this.user = this.userStorage.getUser(); // Si existe el usuario, retorna null
      UserService.instance = this;
      this.#validate();
   }

   #validate() {
      if (!this.userStorage || !this.avatarService || !this.apiUser || !this.wsClient) {
         throw new Error('Falta algunos de los servicios ');
      }
   }

   // Crear un nuevo usuario y guardarlo
   async createUser(name) {
      try {
         this.user = await this.apiUser.register(name, this.avatarService.getAvatarFromLocalStorage());
         await this.userStorage.saveUser(this.user);
         await this.wsClient.connect(`${import.meta.env.VITE_API_URL_SOCKET}?userId=${this.user.id}`);

      } catch (error) {
         throw error
      }
   }

   // Obtener usuario actual
   async getUser() {
      return this.user;
   }

   async logout() {
      this.userStorage.logout();
      this.user = null;
      this.wsClient.close(); // ✅ Cerramos la conexión del socket al cerrar sesión
   }

   static getInstance() {
      return new UserService();
   }
}
