import express, { Application, Request, Response } from "express";
import { IndexRoutes } from "./app/routes";
import { globalErrorHandler } from "./app/middleware/globalErrorHandler";
import { notFound } from "./app/middleware/notFound";
import cookieParser from "cookie-parser";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./app/lib/auth";
import path from "path";
import cors from "cors";
import { envVars } from "./config/env";
import qs from "qs";
import { PaymentController } from "./app/module/payment/payment.controller";
import corn from "node-cron"
import { AppointmentService } from "./app/module/appointment/appointment.service";


const app: Application = express();
app.set("query parser", (str:string) =>{ qs.parse(str)
})

app.set("view engine", "ejs");
app.set("views", path.resolve(process.cwd(), `src/app/templates/`));

app.post("/webhook" , express.raw({type: "application/json"}), PaymentController.handleStripeWebhookEvent)

app.use(cors({
  origin:[envVars.FRONTEND_URL , envVars.BETTER_AUTH_URL, "http://localhost:3000"],
  credentials:true,
  methods:["GET", "POST", "PUT", "DELETE"],
  allowedHeaders:["Content-Type", "Authorization"]


}))


app.use("/api/auth", toNodeHandler(auth))

// Enable URL-encoded form data parsing
app.use(express.urlencoded({ extended: true }));

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }));


corn.schedule("*/25 * * * *" , async()=>{
 

  try{
    console.log("Running corn job to cancel unpaid appointments......");
    await AppointmentService.canceledUnpaidAppointments();
  }catch(error:any){
    console.log("Error from corn job cancel unpaid appointments...." , error.message);
  }











})

app.use("/api/v1/", IndexRoutes);






// Basic route
app.get("/", async (req: Request, res: Response) => {

  res
    
    .send( "HealthCare Backend is running!" );

  });





app.use(globalErrorHandler)
app.use(notFound)









export default app;
