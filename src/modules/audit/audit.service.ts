import { Prisma } from "../../../generated/prisma/client"
import { prisma } from "../../lib/prisma"


const log = async (payload: {
     userId?: string
     action: string
     entity: string
     entityId: string
     oldValue?: object | null
     newValue?: object | null
     ipAddress?: string
}) => {
     return prisma.auditLog.create({
          data: {
               action: payload.action,
               entity: payload.entity,
               entityId: payload.entityId,
               userId: payload.userId ?? null,
               oldValue: payload.oldValue ?? null,
               newValue: payload.newValue ?? null,
               ipAddress: payload.ipAddress ?? null
          } as Prisma.AuditLogUncheckedCreateInput
     })
}

const getAuditLogs = async (query: {
     entity?: string
     entityId?: string
     userId?: string
     page?: string
     limit?: string
}) => {
     const page = parseInt(query.page || "1")
     const limit = parseInt(query.limit || "20")
     const skip = (page - 1) * limit

     const where: any = {}
     if (query.entity) where.entity = query.entity
     if (query.entityId) where.entityId = query.entityId
     if (query.userId) where.userId = query.userId

     const [data, total] = await Promise.all([
          prisma.auditLog.findMany({
               where,
               include: { user: { select: { id: true, name: true, email: true, role: true } } },
               orderBy: { createdAt: "desc" },
               skip,
               take: limit
          }),
          prisma.auditLog.count({ where })
     ])

     return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } }
}

export const auditService = { log, getAuditLogs }