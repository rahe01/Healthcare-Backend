import { Prisma } from "../../../generated/prisma/client"


export const doctorScheduleSearchableFields = [
    'id',
    'doctorId',
    'scheduleId',
]

export const doctorScheduleFilterableFields = [
    'id',
    'doctorId',
    'scheduleId',
    'createdAt',
    'updatedAt',
    'isBooked',
    'schedule.startDateTime',
    'schedule.endDateTime',
]

export const doctorScheduleIncludeConfig: Partial<Record<keyof Prisma.DotcorSchedulesInclude, Prisma.DotcorSchedulesInclude[keyof Prisma.DotcorSchedulesInclude]>> = {
    doctor: {
        include: {
            user: true,
            appointments: true,
            specialties: true,
        }
    },
    schedule: true

}