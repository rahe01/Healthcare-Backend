import { Router } from "express";
import { UserController } from "./user.controller";
import { validateRequest } from "../../middleware/validateRequest";
import { UserValidation } from "./user.validation";


const router = Router()



router.post("/create-doctor",


    validateRequest(UserValidation.createDoctorZodSchema),

    UserController.createDoctor);

export const UserRoutes = router