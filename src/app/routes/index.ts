import { Router } from "express";
import { SpecialityRoutes } from "../module/speciality/speciality.router";


const router = Router();


router.use("/specialities", SpecialityRoutes)


export const IndexRoutes = router;