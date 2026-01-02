/*

we create function here . that function call 
and when we run this file then admin will be created  in database


*/


import { prisma } from "../lib/prisma";
import { UserRole } from "../middllewares/auth";



async function seedAdmin(){
    try{
 
        const adminData = {
            name:process.env.ADMIN_NAME,
            email:process.env.ADMIN_EMAIL ,
            role:UserRole.ADMIN,
            password:process.env.ADMIN_PASSWORD,
            
        }
        // cheack user exists user in db 
       
        const existingUser = await prisma.user.findUnique({
            where:{
                email:adminData.email as string
            }
        })
 
        if(existingUser){
            throw new Error('User already exists in db')
        }


        const signUpAdmin = await fetch('http://localhost:3000/api/auth/sign-up/email',{
            method:"POST",
            headers:{
                "Content-Type" : "application/json"
            },
            body:JSON.stringify(adminData)
        } )
  
        // update data in user table
        if(signUpAdmin.ok){
            await prisma.user.update({
                where:{
                    email:adminData.email!
                },
                data:{
                    emailVerified:true
                }

            })
        }

    }
    catch(err){
        console.error(err);
    }
}

seedAdmin()


// async function seedAdmin(){
//   try{
//    // create admin data
//     const adminData = {
//     name:process.env.ADMIN_NAME,
//   email:process.env.ADMIN_EMAIL ,
//  role: UserRole.ADMIN,
//  password:process.env.ADMIN_PASSWORD,
//     }

//     // chack admin acxists 

//     const existsAdmin = await prisma.user.findUnique({
//         where:{
//             email: adminData.email as string 
//         }
//     })

//     if(existsAdmin){
//         throw Error ('user already exists')
//     }


//     // if not exists created admin 

//     const signUpAdmin = await fetch ('http://localhost:3000/api/auth/sign-up/email', {
//         method:"POST",
//         headers:{
//             "Content-Type": "aplication/json"
//         },
//         body:JSON.stringify(adminData)
//     })
    

//     console.log(signUpAdmin);

//     if(signUpAdmin.ok){
//         await prisma.user.update({
//             where:{
//                 email:adminData.email !
//             },
//             data:{
//                 emailVerified:true
//             }
            

//         })
//     }
//   }



//   catch(err){
//     console.error(err)
//   }
  


// }

// seedAdmin()