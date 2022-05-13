import { User } from "./user.interface";
import { Post } from "./post.interface"

export interface Comment {
    id: number,
    PostId: number,
    content: string,
    moderated: boolean,
    reasonForModeration: string,
    corrected: boolean,
    reported: string,
    liked: string,
    loved: string,
    laughed: string,
    angered: string,
    createdAt: Date,
    updatedAt: Date,
    UserId: number,
    User: User,
    Post: Post
}