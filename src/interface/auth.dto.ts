import { UserPayload } from "./user.dto";
import { AdminPayload } from "./admin.dto";

export type AuthPayLoad = UserPayload | AdminPayload;