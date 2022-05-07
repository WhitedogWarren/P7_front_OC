import { Post } from "./post.interface";

export interface User {
    id: string;
    lastname: string;
    firstname: string;
    email: string;
    avatarUrl: string;
    bio: string;
    role: string;
    createdAt: Date;
    updatedAt: Date;
    posts: Array<Post>;
}