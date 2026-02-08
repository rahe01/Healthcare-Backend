import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { AuthService } from "./auth.service";
import { sendResponse } from "../../shared/sendResponse";
import status from "http-status";
import { tokenUtils } from "../../utils/token";





const registerPatient = catchAsync(
    async(req:Request, res:Response)=>{
        const payload = req.body;
        const result = await AuthService.registerPatient(payload);

        const { accessToken, refreshToken, token, ...rest } = result;
        tokenUtils.setAccessTokenCookie(res, accessToken);
        tokenUtils.setRefreshToken(res, refreshToken);
        tokenUtils.setBetterAuthSessionCookie(res, token as string);
        

        sendResponse(res,{
            httpStatusCode:status.CREATED,
            success:true,
            message: "Patient registedred successfully",
            data: {
                token,
                accessToken,
                refreshToken,
                ...rest

            }
        })
    }
)

const logingUser = catchAsync(
    async(req:Request , res:Response) =>{
        const payload = req.body;
        const result = await AuthService.logingUser(payload);



        const { accessToken, refreshToken , token , ...rest} = result;
        tokenUtils.setAccessTokenCookie(res,accessToken);
        tokenUtils.setRefreshToken(res,refreshToken);
        tokenUtils.setBetterAuthSessionCookie(res,token);

        sendResponse(res,{
            httpStatusCode:status.OK,
            success:true,
            message:"User login successfully",
            data:{
                token,
                accessToken,
                refreshToken,
                ...rest
                
            }
        })

    }
)


export const AuthController ={
    registerPatient,
    logingUser
}