import { User } from "src/app/interfaces/user.interface";

export interface UserApiResponse {
    message: string,
    newUser?: User | null,
    token?: string
}