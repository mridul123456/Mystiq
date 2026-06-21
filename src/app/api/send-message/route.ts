import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { Message } from "@/model/User";

export async function POST(req: Request) {
    await dbConnect();
    
    try {

        const { username, content, createdBy } = await req.json();

        const user = await UserModel.findOne({username}) 

        if(!user) {
            return Response.json({
                success: false,
                message: `User not found`
            }, {
                status: 404
            })
        }

        //if user is not accepting the messages
        if(!user.isAcceptingMessage) {
            return Response.json({
                success: false,
                message: `User is not accepting the message`
            }, {
                status: 403
            })
        }

        const newMessage = { content, createdBy, createdAt: new Date() }
        user.messages.push(newMessage as Message)
        await user.save();

        return Response.json({
                success: true,
                message: `Message sent successfully`
            }, {
                status: 200
            })  

    } catch(err) {
        console.log(`Failed to send message : ${err}`)
        return Response.json({
            success: false,
            message: `Failed to send message`
        }, {
            status: 500
        })
    }
}