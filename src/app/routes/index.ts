import { Router } from "express";
import { SpecialityRoutes } from "../module/speciality/speciality.router";
import { AuthRoutes } from "../module/auth/auth.router";


const router = Router();


router.use("/specialities", SpecialityRoutes);
router.use("/auth" , AuthRoutes);


export const IndexRoutes = router;