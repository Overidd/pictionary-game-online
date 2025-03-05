import { AvatarService } from "../../application";
import { ApiAvatar } from "../../infrastructure/apiAvatar";

export const avatarService = new AvatarService(ApiAvatar);