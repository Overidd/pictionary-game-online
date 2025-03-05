export class AvatarService {

   /**
    * 
    * @param {ApiAvatar} ApiAvatar 
    */
   constructor(ApiAvatar) {
      this.repository = ApiAvatar;
   }

   /**
    * @param {number} id 
    * @returns {Promise<ArrayBuffer>}
    */
   async getAvatar(id) {
      const file = await this.repository.getAvatarAsFile(id);
      if (!file) throw new Error('Error al obtener avatar');

      const reader = new Promise((resolve, reject) => {
         const reader = new FileReader();
         reader.readAsDataURL(file); // Iniciamos la lectura del archivo

         reader.onload = () => resolve(reader.result); // Cuando termine, resolvemos la promesa con el resultado Base64
         reader.onerror = (error) => reject(error);
      });

      const Avatar64 = await reader;

      this.saveAvatarToLocalStorage(Avatar64);
      return Avatar64
   }

   /**
    * @returns {Promise<ArrayBuffer>}
    */
   async getRandomAvatar() {
      const random = Math.floor(Math.random() * 999);
      return this.getAvatar(random);
   }

   /**
    * @param {FileReader} reader
    */
   saveAvatarToLocalStorage(avatar) {
      localStorage.setItem('avatar', avatar);
   }

   /**
    * Recupera el avatar de localStorage
    * @returns {string | null}
    */
   static getAvatarFromLocalStorage() {
      return localStorage.getItem('avatar');
   }
}
