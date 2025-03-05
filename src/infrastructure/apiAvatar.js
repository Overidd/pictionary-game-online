export class ApiAvatar {
   static async getAvatarAsFile(avatarId) {
      const response = await fetch(`${import.meta.env.VITE_API_URL_AVATAR}/svg?seed=${avatarId}`);
      if (!response.ok) throw new Error("Error al obtener avatar");
      const blob = await response.blob();
      return new File([blob], 'avatar.svg', { type: blob.type });
   }
}
