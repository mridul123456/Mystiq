import { Message } from "@/model/User"

//? -> It means the field is optional
export interface ApiResponse {
    success: boolean,
    message: string,
    isAcceptingMessage?: boolean,
    messages?: Array<Message>
}