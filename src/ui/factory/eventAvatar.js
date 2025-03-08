import { AvatarService } from "../../application";
import { AvatarApi } from "../../infrastructure/api";

export const avatarService = new AvatarService(AvatarApi);