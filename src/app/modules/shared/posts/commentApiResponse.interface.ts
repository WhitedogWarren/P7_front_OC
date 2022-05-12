import { Comment } from "src/app/interfaces/comment.interface"

export interface CommentApiResponse {
    message: string,
    newComment?: Comment | null
}