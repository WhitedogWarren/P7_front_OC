import { Post } from "src/app/interfaces/post.interface";

export interface PostApiResponse {
    message: string,
    newPost?: Post | null
}