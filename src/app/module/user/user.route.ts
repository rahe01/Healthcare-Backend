import { NextFunction, Request, Response, Router } from "express";
import { UserController } from "./user.controller";
import { createDoctorZodSchema } from "./user.validation";
import z from "zod";
import { validateRequest } from "../../middleware/validateRequest";




const router = Router()









router.post("/create-doctor" ,  
    //     (req: Request, res: Response, next: NextFunction) => {

    //     const parsedResult = createDoctorZodSchema.safeParse(req.body);

    //     if (!parsedResult.success) {
    //         next(parsedResult.error)
    //     }

    //     //sanitizing the data
    //     req.body = parsedResult.data;

    //     next()

    // }, 

    validateRequest(createDoctorZodSchema),
    
    UserController.createDoctor);

export const UserRoutes= router