import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs"

import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(req: Request) {
    await dbConnect();
    try{
        const {username, email, password} = await req?.json();

        const existingUserVerifiedByUsername = await UserModel.findOne({
            username,
            isVerified: true
        })

        if(existingUserVerifiedByUsername) {
            return Response.json({
                success: false,
                message: `Username already taken`
            }, {
                status: 400
            })
        }

        const existingUserByEmail = await UserModel.findOne({
            email
        })

        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

        if(existingUserByEmail) {
            if(existingUserByEmail.isVerified) {
                return Response.json({
                    success: false,
                    message: "User already exists with this email."
                },{
                    status: 500
                }) 
            } else {
                const salt = await bcrypt.genSalt(10);
                const encryptedPassword = await bcrypt.hash(password, salt); 
                existingUserByEmail.password = encryptedPassword;
                existingUserByEmail.verifyCode = verifyCode
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000)

                await existingUserByEmail.save();
            }
        } else {
            const salt = await bcrypt.genSalt(10);
            const encryptedPassword = await bcrypt.hash(password, salt);
            const expiryDate = new Date();
            //Set expiry time as 1 hr from now when the user is registering
            expiryDate.setHours(expiryDate.getHours() + 1);

            const newUser = new UserModel({
                username,
                email,
                password: encryptedPassword,
                verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false, 
                isAcceptingMessage: true,
                messages:  []
            })

            const createdUser = await UserModel.create(newUser);
        }

        //Send Verification email
        const emailResponse = await sendVerificationEmail(
            email,
            username, 
            verifyCode
        )

        if(!emailResponse.success) {
            return Response.json({
                success: false,
                message: emailResponse.message
            },{
                status: 500
            })
        }

        return Response.json({
                success: true,
                message: `User registered successfully. Please verify your email`
            },{
                status: 200
            })

    } catch(err) {
        console.error(`Error registering user`, err)
        return Response.json(
            {
                success: false,
                message: `Error registering user`
            }, 
            {
                status: 500
            }
        )
    }
}