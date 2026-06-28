// import {resend} from '@/lib/resend'
// import VerificationEmail from '../../emails/VerificationEmail'
// import { ApiResponse } from '@/types/ApiResponse'

// export async function sendVerificationEmail(
//     email: string,
//     username: string,
//     verifyCode: string
// ) : Promise<ApiResponse> { 
//     try{
//         await resend.emails.send({
//             from: 'onboarding@resend.dev',
//             to: email,
//             subject: 'Mystiq | Verification Code',
//             react: VerificationEmail({username, otp: verifyCode})
//         });
//         return {success: true, message: `Verification email send successfullly`}

//     } catch(err) {
//         console.log(`Error sending verification email : ${err}`)
//         return {success: false, message: `Failed to send verification email`}
//     }
// }

import { transporter } from "@/lib/nodemailer";
import VerificationEmail from "../../emails/VerificationEmail";
import { render } from "@react-email/render";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    const html = await render(
      VerificationEmail({
        username,
        otp: verifyCode,
      })
    );

    await transporter.sendMail({
      from: `"Mystiq" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Mystiq | Verification Code",
      html,
    });

    return {
      success: true,
      message: "Verification email sent successfully",
    };
  } catch (err) {
    console.error("Error sending verification email:", err);

    return {
      success: false,
      message: "Failed to send verification email",
    };
  }
}