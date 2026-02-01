import { Router } from "express";
import * as reviewController from "./review.controller";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.post("/", auth(Role.CUSTOMER), reviewController.createReview);

router.get("/", reviewController.getAllReviews);

export const reviewRouter = router;
