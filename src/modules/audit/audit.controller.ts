import { Request, Response, NextFunction } from "express"
import status from "http-status"
import sendResponse from "../../utils/sendResponse"
import { auditService } from "./audit.service"

const getAuditLogs = async (req: Request, res: Response, next: NextFunction) => {
     try {
          const result = await auditService.getAuditLogs(req.query as any)
          sendResponse(res, { statusCode: status.OK, success: true, message: "Audit logs fetched", data: result })
     } catch (e) { next(e) }
}

export const auditController = { getAuditLogs }