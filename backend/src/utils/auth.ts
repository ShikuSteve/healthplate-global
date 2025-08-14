import jwt from "jsonwebtoken"
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import * as validator from 'validator';


const JWT_SECRET = process.env.JWT_SECRET!;
//Generate Token
export const generateToken=(userId:number)=>{
const accessToken=jwt.sign(
    {userId},
    JWT_SECRET,
    {expiresIn:"15m"}
)

const refreshToken=uuidv4()

return{accessToken,refreshToken}

}

//Hash Password
export const hashedPassword=async(password:string)=>{
return bcrypt.hash(password,10)
}

//validate password
export const passwordValidate=async(plainPassword:string,hashedPassword:string)=>{
return bcrypt.compare(plainPassword,hashedPassword)
}

//validate email format
export const emailValidator=(email:string)=>{
    return validator.isEmail(email)
}

//validate the password strenth
export const passwordStrength=(password:string)=>{
return validator.isStrongPassword(password,{
    minLength:8,
    minLowercase:1,
    minUppercase:1,
    minNumbers:1,
    minSymbols:1
})
}
