import { Request, Response } from "express";
import { SpecialityService } from "./speciality.service";


const createSpeciality = async (req:Request , res:Response) =>{
   try{
     const payload = req.body;

    const result = await SpecialityService.createSpeciality(payload);

    res.status(201).json({
        success:true,
        message:"Speciality created successfully",
        data:result
    })
   }catch(error){
    res.status(500).json({
        success:false,
        message:"Speciality creation failed",
        error:error
    })
   }
}


const getAllSpecialities = async (req:Request , res:Response) =>{
    try{
        const result = await SpecialityService.getAllSpecialities();

        res.status(200).json({
            success:true,
            message:"Specialities fetched successfully",
            data:result
        })
    }catch(error){
        res.status(500).json({
            success:false,
            message:"Failed to fetch specialities",
            error:error
        })
    }

}


const deleteSpeciality = async (req:Request , res:Response) =>{
    try{
        const {id} = req.params;

        const result = await SpecialityService.deleteSpeciality(id as string);

        res.status(200).json({
            success:true,
            message:"Speciality deleted successfully",
            data:result
        })
    }catch(error){
        res.status(500).json({
            success:false,
            message:"Failed to delete speciality",
            error:error
        })
    }
}







export const SpecialityController = {
    createSpeciality,
    getAllSpecialities,
    deleteSpeciality
}