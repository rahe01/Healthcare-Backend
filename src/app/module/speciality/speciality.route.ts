
import { SpecialityController } from "./speciality.controller";

import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";
import { Router } from "express";
import { multerUpload } from "../../../config/multer.config";
import { validateRequest } from "../../middleware/validateRequest";
import { SpecialityValidation } from "./speciality.validation";



const router = Router();

router.post("/",
    multerUpload.single("file"),
    validateRequest(SpecialityValidation.createSpecialityZodSchema),
    SpecialityController.createSpeciality);
router.get("/",
    // checkAuth(Role.ADMIN, Role.SUPER_ADMIN, Role.DOCTOR, Role.PAITENT),

    SpecialityController.getAllSpecialities);
router.delete("/:id",
    // checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    SpecialityController.deleteSpeciality);


export const SpecialityRoutes = router;
