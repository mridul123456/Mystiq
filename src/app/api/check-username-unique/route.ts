import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";

const UsernameQuerySchema = z.object({
    username: usernameValidation
})

export async function GET(req: Request) {
    await dbConnect();
    //ocalhost:3000/api/something?username=mridul
    try{
        const { searchParams } = new URL(req.url);
        const queryParam = {
            username : searchParams.get('username')
        }
        //validate with zod
        const result = UsernameQuerySchema.safeParse(queryParam);
        if(!result.success) {
            const usernameErrors = result.error.format().username?._errors || []
            return Response.json({
                success: false,
                message: usernameErrors?.length > 0 
                ? usernameErrors.join(', ') 
                : 'Invalid query parameters'
            }, {
                status: 400
            })
        }

        const { username } = result.data
        const existingUser = await UserModel.findOne({username, isVerified: true})

        if(existingUser) {
            return Response.json({
            success: false,
            message: `Username is already taken`
            }, {
                status: 400
            })
        }

        return Response.json({
            success: true,
            message: `Username is available`
        }, {
            status: 200
        })
    } catch(err) {
        console.log(`Error checking username : ${err}`)
        return Response.json({
            success: false,
            message: `Error checking username`
        }, {
            status: 500
        })
    }
}