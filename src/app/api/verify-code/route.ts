import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";


export async function POST(req: Request) {
    await dbConnect();
    try{
        const {username, code} = await req.json();
        const decodedUsername = decodeURIComponent(username);
        const user = await UserModel.findOne({username: decodedUsername});
        
        if(!user) {
            return Response.json({
                success: false,
                message: `User not found`
            }, {
                status : 404
            })
        }

        const isCodeValid = code === user.verifyCode;
        const isCodeExpired = new Date(user.verifyCodeExpiry) > new Date();

        if(!isCodeValid) {
            return Response.json({
                success: false, 
                message: `Incorrect Verification code. Please enter correct code!`
            }, {
                status: 400
            })
        }
        if(!isCodeExpired) {
            return Response.json({
                success: false, 
                message: `Verification Code is expired. Please sign-up again to get a new code!`
            }, {
                status: 400
            })
        }

        user.isVerified = true;
        await user.save();

        return Response.json({
            success: true,
            message: `Account verified successfully`
        },{
            status: 200
        })

    } catch(err) {
        console.error(`Error verifying user`)
        return Response.json({
            success: false,
            message: `Error verifying user`
        }, {
            status : 500
        })
    }
}