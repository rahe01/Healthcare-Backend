import { Router } from "express";
import { SpecialityRoutes } from "../module/speciality/speciality.router";
import { AuthRoutes } from "../module/auth/auth.routes";
import { UserRoutes } from "../module/user/user.route";
import { DoctorRoutes } from "../module/doctor/doctor.route";


const router = Router();


router.use("/specialities", SpecialityRoutes);
router.use("/auth", AuthRoutes);
router.use("/users", UserRoutes);
router.use("/doctors", DoctorRoutes)


export const IndexRoutes = router;