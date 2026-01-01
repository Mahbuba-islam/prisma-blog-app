import { betterAuth} from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
// If your Prisma file is located elsewhere, you can change the path
import nodemailer from "nodemailer"

//node mailer transport for mail send
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // use STARTTLS (upgrade connection to TLS after connecting)
  auth: {
    user: process.env.APP_USER,
    pass: process.env.APP_PASSWORD,
  },
});


//connect better auth in ur database with prisma adaftor
export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql", // or "mysql", "postgresql", ...etc
    }),
  

    // trusted origin fronted url
    trustedOrigins:[process.env.APP_URL!],
 
   //add user additional fields
    user:{
   additionalFields:{
    role:{
        type:"string",
       defaultValue:"USER",
       required:false
    },
    phone:{
        type:"string",
        required:false
    },
    status:{
        type:"string",
        defaultValue:"ACTIVE",
        required:false
    }
   }
    },



     /// use better auth for authentication
    emailAndPassword: { 
    enabled: true, 
    autoSignIn:false,
    requireEmailVerification:true
  }, 


  emailVerification: {
   sendOnSignUp : true,
   autoSignInAfterVerification:true,
    sendVerificationEmail: async ( { user, url, token }, request) => {
     console.log("verifivation emails sent");

     try{
      const verificationUrl = `${process.env.APP_URL}/verify-email?token=${token}`
     const info = await transporter.sendMail({
      from: '"prism blog" <prisma-blog@ph.com>', // sender address
      to: user.email, // list of recipients
      subject: "please verify your email", // subject line
      html: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Email Verification</title>
  </head>

  <body style="margin:0; padding:0; background:#f5f5f5; font-family:Arial, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5; padding:40px 0;">
      <tr>
        <td align="center">
          <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px; background:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,0.05);">
            
            <!-- Header -->
            <tr>
              <td style="background:#4f46e5; padding:24px; text-align:center; color:#ffffff; font-size:24px; font-weight:bold;">
                Prisma Blog
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding:32px; color:#333333; font-size:16px; line-height:1.6;">
                <p style="margin-top:0;">Hi ${user.email},</p>

                <p>
                  Thanks for signing up! Please verify your email address to activate your account.
                </p>

                <p style="margin:24px 0; text-align:center;">
                  <a href="${verificationUrl}" 
                     style="background:#4f46e5; color:#ffffff; padding:14px 28px; text-decoration:none; border-radius:6px; font-size:16px; display:inline-block;">
                    Verify Email
                  </a>
                </p>

                <p>
                  If the button above doesn’t work, copy and paste this link into your browser:
                </p>

                <p style="word-break:break-all; color:#4f46e5;">
                 ${verificationUrl}
                </p>

                <p>
                  If you didn’t create an account, you can safely ignore this email.
                </p>

                <p style="margin-bottom:0;">— Prisma Blog Team</p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="background:#f0f0f0; padding:16px; text-align:center; font-size:12px; color:#777;">
                © 2025 Prisma Blog. All rights reserved.
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`, // HTML body
    });

    
  } 
   catch(err:any){
    console.error(err);
    throw err
   }
   },
  
    },


    // google sign in

     socialProviders: {
        google: { 
            prompt: "select_account consent",
            accessType:"offline",
            clientId: process.env.GOOGLE_CLIENT_ID  as string, 
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string, 
            
        }, 
    },
  }

   

);



