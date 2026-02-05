import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { AuthService } from "./auth.service";
import { sendResponse } from "../../shared/sendResponse";





const registerPatient = catchAsync(
    async(req:Request, res:Response)=>{
        const payload = req.body;
        const result = await AuthService.registerPatient(payload);

        sendResponse(res,{
            httpStatusCode:201,
            success:true,
            message: "Patient registedred successfully",
            data:result
        })
    }
)

const logingUser = catchAsync(
    async(req:Request , res:Response) =>{
        const payload = req.body;
        const result = await AuthService.logingUser(payload);

        sendResponse(res,{
            httpStatusCode:201,
            success:true,
            message:"User login successfully",
            data:result
        })

    }
)


export const AuthController ={
    registerPatient,
    logingUser
}