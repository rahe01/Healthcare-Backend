import { NextFunction, Request, Response } from "express";
import { IUpdatePatientInfoPayload, IUpdatePatientProfilePayload } from "./patient.interface";


export const updateMyPatientProfileMiddleware = (req: Request, res: Response, next: NextFunction) => {
    // যদি Frontend JSON data পাঠায়
    if (req.body.data) {
        req.body = JSON.parse(req.body.data);
    }

    const payload: IUpdatePatientProfilePayload = req.body;
    const files = req.files as { [fieldName: string]: Express.Multer.File[] | undefined };

    console.log("FILES RECEIVED:", files); // Debugging purpose

    // profilePhoto আপডেট
    if (files?.profilePhoto?.[0]) {
        if (!payload.patientInfo) {
            payload.patientInfo = {} as IUpdatePatientInfoPayload;
        }
        payload.patientInfo.profilePhoto =
            files.profilePhoto[0].path || files.profilePhoto[0].filename;
    }

    // medicalReports আপডেট
    if (files?.medicalReports && files.medicalReports.length > 0) {
        const newReports = files.medicalReports.map(file => ({
            reportName: file.originalname || `Medical Report - ${Date.now()}`,
            reportLink: file.path || file.filename
        }));

        payload.medicalReports = [...(payload.medicalReports || []), ...newReports];
    }

    req.body = payload;
    next();
};

