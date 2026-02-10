import status from "http-status";
import { envVars } from "../../../config/env";
import { UserStatus } from "../../../generated/prisma/enums";
import AppError from "../../errorHelpers/AppError";
import { IRequestUser } from "../../interfaces/requestUser.interface";
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import { jwtUtils } from "../../utils/jwt";
import { tokenUtils } from "../../utils/token";
import { JwtPayload } from "jsonwebtoken";
import { access } from "node:fs";

interface IRegisterPatientPayload {
  name: string;
  email: string;
  password: string;
}

const registerPatient = async (payload: IRegisterPatientPayload) => {
  const { name, email, password } = payload;

  const data = await auth.api.signUpEmail({
    body: {
      name,
      email,
      password,
      // needPasswordChange : false,
      // role:Role.PAITENT
    },
  });

  if (!data.user) {
    throw new Error("Faild to register paitent");
  }

  // create patient profile in transaction after signup
  try {
    const patient = await prisma.$transaction(async (tx) => {
      const patientTx = await tx.patient.create({
        data: {
          userId: data.user.id,
          name: payload.name,
          email: payload.email,
        },
      });

      return patientTx;
    });
    const accessToken = tokenUtils.getAccessToken({
      userId: data.user.id,
      role: data.user.role,
      name: data.user.name,
      email: data.user.email,
      status: data.user.status,
      isDeleted: data.user.isDeleted,
      emailVerified: data.user.emailVerified

    })

    const refreshToken = tokenUtils.getRefreshToken({
      userId: data.user.id,
      role: data.user.role,
      name: data.user.name,
      email: data.user.email,
      status: data.user.status,
      isDeleted: data.user.isDeleted,
      emailVerified: data.user.emailVerified

    })

    return {
      ...data,
      accessToken,
      refreshToken,
      patient,

    };
  } catch (error) {
    console.log("Transaction error", error);
    await prisma.user.delete({
      where: {
        id: data.user.id,
      },
    });
    throw error;
  }
};

interface ILoginUserPayload {
  email: string;
  password: string;
}

const logingUser = async (payload: ILoginUserPayload) => {
  const { email, password } = payload;

  const data = await auth.api.signInEmail({
    body: {
      email,
      password,
    },
  });

  if (data.user.status === UserStatus.BLOCKED) {
    throw new Error("User is Blocked");
  }

  if (data.user.isDeleted || data.user.status === UserStatus.DELETED) {
    throw new Error("user is deleted");
  }

  const accessToken = tokenUtils.getAccessToken({
    userId: data.user.id,
    role: data.user.role,
    name: data.user.name,
    email: data.user.email,
    status: data.user.status,
    isDeleted: data.user.isDeleted,
    emailVerified: data.user.emailVerified

  })

  const refreshToken = tokenUtils.getRefreshToken({
    userId: data.user.id,
    role: data.user.role,
    name: data.user.name,
    email: data.user.email,
    status: data.user.status,
    isDeleted: data.user.isDeleted,
    emailVerified: data.user.emailVerified

  })

  return {
    ...data,
    accessToken, refreshToken
  };
};


const getMe = async (user: IRequestUser) => {
  console.log({user});

  const isUserExist = await prisma.user.findUnique({
    where: {
      id: user.userId,
    },
    include: {
      patient: {
        include: {
          appointments: true,
          reviews: true,
          prescriptions: true,
          medicalReports: true,
          patientHealthData: true,

        },
      
      },
      doctor: {
        include: {
         specialties: true,
         appointments: true,
         reviews: true,
         prescriptions: true,
        },
      },
      admin: true,
    },
  });

  if (!isUserExist) {
    throw new Error("User not found");
  }

  return isUserExist;

}



const getNewToken = async (refreshToken : string , sessionToken : string ) =>{

  const isSessionTokenExist = await prisma.session.findUnique({
    where: {
      token: sessionToken,
      
    },
    include: {
      user: true
    }
  })

  if(!isSessionTokenExist){
    throw new AppError(status.UNAUTHORIZED , "Invalid session token")
  }

  const verifiedRefresToken = jwtUtils.verifyToken(refreshToken , envVars.REFRESH_TOKEN_SECRET);



  if(!verifiedRefresToken.success && verifiedRefresToken.error){
    throw new AppError(status.UNAUTHORIZED , "Invalid refresh token")
  } 
  const data  = verifiedRefresToken.data as JwtPayload;

  const newAccessToken = tokenUtils.getAccessToken({
    userId: data.userId,
    role: data.role,
    name: data.name,
    email: data.email,
    status: data.status,
    isDeleted: data.isDeleted,
    emailVerified: data.emailVerified

  })

  const newRefreshToken = tokenUtils.getRefreshToken({
    userId: data.userId,
    role: data.role,
    name: data.name,
    email: data.email,
    status: data.status,
    isDeleted: data.isDeleted,
    emailVerified: data.emailVerified

  })

  const {token} = await prisma.session.update({
    where: {
      token:sessionToken
    },
    data: {
      token: sessionToken,
      expiresAt: new Date(Date.now() + 60 * 60 * 60 * 24*1000),
      updatedAt: new Date()

    },
  });


  return {
   accessToken: newAccessToken,
   refreshToken: newRefreshToken,
   sessionToken: token
  
  }


}




export const AuthService = {
  registerPatient,
  logingUser,
  getMe,
  getNewToken
};
