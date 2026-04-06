import { Router } from "express"
import { auth } from "../../middlewares/auth"
import { Role } from "../../../generated/prisma/enums"
import { auditController } from "./audit.controller"

const router = Router()

// Only admins can read logs — nothing else needed here
router.get("/", auth(Role.ADMIN), auditController.getAuditLogs)

export const auditRouter = router