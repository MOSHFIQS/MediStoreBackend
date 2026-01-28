import express, { Router } from 'express';
import { authController } from './auth.controller';

const router = express.Router();


router.post(
     "/register",
     authController.signUpUser
)
router.post(
     "/login",
     authController.signInUser
)
router.get("/me", authController.getMe)

export const authRouter: Router = router;