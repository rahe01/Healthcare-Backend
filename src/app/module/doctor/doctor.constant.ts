import { Prisma } from "../../../generated/prisma/client";

export const doctorSearchableFields = [
    'name',
    'qualification',
    'designation',
    'currentWorkingPlace',
    'registrationNumber',
    'specialties.speciality.title',
    'user.email'
];

export const doctorFilterableFields = [
    'gender',
    'isDeleted',
    'appointmentFee',
    'experience',
    'registrationNumber',
    'currentWorkingPlace',
    'designation',
    'qualification',
    'specialties.specialityId',
    'specialties.speciality.title',
    'user.role'
];

export const doctorIncludeConfig:
    Partial<Record<keyof Prisma.DoctorInclude, Prisma.DoctorInclude[keyof Prisma.DoctorInclude]>> = {
    user: true,
    specialties: {
        include: {
            speciality: true
        }
    },
    appointments: {
        include: {
            patient: true
        }
    },
    doctorSchedules: {
        include: {
            schedule: true
        }
    },
    prescriptions: true,
    reviews: true,
};
  