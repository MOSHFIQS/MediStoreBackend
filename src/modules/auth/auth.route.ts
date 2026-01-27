import express, { Router } from 'express';
import { authController } from './auth.controller';

const router = express.Router();


// router.get(
//      "/my-posts",
//      auth(UserRole.USER, UserRole.ADMIN),
//      PostController.getMyPosts
// )

// router.get(
//      "/:postId",
//      PostController.getPostById
// )

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