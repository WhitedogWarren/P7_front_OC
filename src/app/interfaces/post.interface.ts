import { User } from "./user.interface";

export interface Post {
    id: number;
    content: string;
    imageUrl: string;
    moderated: boolean;
    reasonForModeration: string;
    corrected: boolean;
    reported: string;
    liked: string;
    loved: string;
    laughed: string;
    angered: string;
    createdAt: Date;
    updatedAt: Date;
    UserId: number;
    User: User;
}