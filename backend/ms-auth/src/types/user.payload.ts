import { User } from "./user";

export interface UserPayload {
    token: string,
    user: User
}
