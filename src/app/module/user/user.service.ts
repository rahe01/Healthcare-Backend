/* eslint-disable @typescript-eslint/no-unused-vars */
import { Role, Speciality } from "../../../generated/prisma/client";
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import { ICreateAdmin, ICreateDoctorPayload } from "./user.interface";




const createDoctor = async (payload:ICreateDoctorPayload) =>{

    const specialties :Speciality [] =[];

    for(const SpecialityId of payload.specialties){
        const Speciality = await prisma.speciality.findUnique({
            where:{
                id:SpecialityId
            }
        })

        if(!Speciality){
            throw new Error(`Speciality with id ${SpecialityId} not found`);
        }

        specialties.push(Speciality)

    }

    const userExists = await prisma.user.findUnique({
        where:{
            email:payload.doctor.email
        }
    })

    if(userExists){
        throw new Error("user already exist with this email ")
    }

    const userData = await auth.api.signUpEmail({
        body:{
            email:payload.doctor.email,
            password:payload.password,
            role:Role.DOCTOR,
            name:payload.doctor.name,
            needPasswordChange:true

        }
    })

    try{

        const result = await prisma.$transaction(async (tx) =>{
            const doctorData = await tx.doctor.create({
                data:{
                    userId:userData.user.id,
                    ...payload.doctor,


                }
            })

            const DoctorSpecialityData = specialties.map((speciality) =>{
                return {
                    doctorId:doctorData.id,
                    specialityId : speciality.id
                }
            })

            await tx.doctorSpeciality.createMany({
                data:DoctorSpecialityData
            })

            const doctor = await tx.doctor.findUnique({
                where:{
                    id:doctorData.id
                },
                select:{
                    id: true,
                    userId: true,
                    name: true,
                    email: true,
                    profilePhoto: true,
                    contactNumber: true,
                    address: true,
                    registrationNumber: true,
                    experience: true,
                    gender: true,
                    appointmentFee: true,
                    qualification: true,
                    currentWorkingPlace: true,
                    designation: true,
                    createdAt: true,
                    updatedAt: true,
                    user: {
                        select: {
                            id: true,
                            email: true,
                            name: true,
                            role: true,
                            status: true,
                            emailVerified: true,
                            image: true,
                            isDeleted: true,
                            deletedAt: true,
                            createdAt: true,
                            updatedAt: true,
                        }
                    },
                    specialties: {
                        select: {
                            speciality: {
                                select: {
                                    title: true,
                                    id: true
                                }
                            }
                        }
                    }

                }

            })

            return doctor
        })

        return result

    }catch(error){
        console.log("Transection error " , error);

        await prisma.user.delete({
            where:{
                id:userData.user.id
            }
        })

    }


    
}













export const UserService ={
    createDoctor
}