import { prisma } from "../../lib/prisma"



const getAllDoctors = async () =>{
    const doctors = await prisma.doctor.findMany({
        include:{
            user:true,
            specialties:{
                include:{
                    speciality:true
                }
            }
        }
    })

    return doctors
}

// get doctor by id || doctor update || delete doctor

export const DoctorService = {
    getAllDoctors
}