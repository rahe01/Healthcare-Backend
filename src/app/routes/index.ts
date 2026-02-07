import { Router } from "express";
import { SpecialityRoutes } from "../module/speciality/speciality.router";
import { AuthRoutes } from "../module/auth/auth.router";
import { UserRoutes } from "../module/user/user.route";


const router = Router();


router.use("/specialities", SpecialityRoutes);
router.use("/auth" , AuthRoutes);
router.use("/doctors" , UserRoutes)


export const IndexRoutes = router;