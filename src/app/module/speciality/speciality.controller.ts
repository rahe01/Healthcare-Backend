import { Request, Response } from "express";
import { SpecialityService } from "./speciality.service";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";

const createSpeciality = catchAsync(async (req: Request, res: Response) => {

  console.log(req.body);
  console.log(req.file);
  const payload = {
    ...req.body,
    icon: req.file?.path,
    
  };

  const result = await SpecialityService.createSpeciality(payload);

  sendResponse(res, {
    httpStatusCode: 201,
    message: "Speciality created successfully",
    success: true,
    data: result,
  });
});

const getAllSpecialities = catchAsync(async (req: Request, res: Response) => {
  const result = await SpecialityService.getAllSpecialities();

  sendResponse(res, {
    httpStatusCode: 200,
    message: "Specialities fetched successfully",
    success: true,
    data: result,
  });
});

const deleteSpeciality = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await SpecialityService.deleteSpeciality(id as string);
  sendResponse(res, {
    httpStatusCode: 201,
    message: "Speciality deleted successfullyyy",
    success: true,
    data: result,
  });
});

export const SpecialityController = {
  createSpeciality,
  getAllSpecialities,
  deleteSpeciality,
};
