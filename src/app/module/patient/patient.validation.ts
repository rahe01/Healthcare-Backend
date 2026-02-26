import { z } from "zod";
import { BloodGroup, Gender } from "../../../generated/prisma/enums";

const updatePatientProfileZodSchema = z.object({
  patientInfo: z.object({
    name: z.string().min(1).max(100).optional(),
    profilePhoto: z.string().url().optional(),
    contactNumber: z.string().min(1).max(20).optional(),
    address: z.string().min(1).max(200).optional(),
  }).optional(),

  patientHealthData: z.object({
    gender: z.nativeEnum(Gender).optional(),

    dateOfBirth: z
      .string()
      .refine((date) => !isNaN(Date.parse(date)), {
        message: "Invalid date format",
      })
      .optional(),

    bloodGroup: z.nativeEnum(BloodGroup).optional(),

    hasAllergies: z.boolean().optional(),
    hasDiabetes: z.boolean().optional(),
    height: z.string().optional(),
    weight: z.string().optional(),
    smokingStatus: z.boolean().optional(),
    dietaryPreference: z.string().optional(), // ✅ fixed
    pregnancyStatus: z.boolean().optional(),
    mentalHealthHistory: z.string().optional(),
    immunizationStatus: z.string().optional(),
    hasPastSurgeries: z.boolean().optional(),
    recentAnxiety: z.boolean().optional(),
    recentDepression: z.boolean().optional(),
    maritalStatus: z.string().optional(),
  }).optional(),

  medicalReports: z.array(
    z.object({
      shouldDelete: z.boolean().optional(),
      reportId: z.string().uuid().optional(),
      reportName: z.string().optional(),
      reportLink: z.string().url().optional(),
    })
  )
  .optional()
  .refine((reports) => {
    if (!reports || reports.length === 0) return true;

    for (const report of reports) {

      if (report.shouldDelete === true && !report.reportId) {
        return false;
      }

      if (report.reportId && !report.shouldDelete) {
        return false;
      }

      if (report.reportName && !report.reportLink) {
        return false;
      }

      if (report.reportLink && !report.reportName) {
        return false;
      }
    }

    return true;
  }, {
    message:
      "Invalid medical report data. Check delete logic or reportName/reportLink pairing.",
  }),
});

export const PatientValidation = {
  updatePatientProfileZodSchema,
};
