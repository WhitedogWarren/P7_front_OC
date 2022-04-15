import { User } from "./user.interface";

export interface AuthStatus {
    isLogged: boolean;
    user: User | null
}