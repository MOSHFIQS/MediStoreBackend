import { Prisma } from "../../../generated/prisma/client"
import { IQueryParams } from "../../interfaces/query.interface"
import { prisma } from "../../lib/prisma"
import { QueryBuilder } from "../../utils/QueryBuilder"


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

const getAuditLogs = async (query: IQueryParams = {}) => {
     const qb = new QueryBuilder(prisma.auditLog, query, {
          searchableFields: ['entity', 'action'], // adjust if you have 'action' or similar field
          filterableFields: ['entity', 'entityId', 'userId'],
     });

     const result = await qb
          .search()
          .filter()
          .include({
               user: {
                    select: { id: true, name: true, email: true, role: true },
               },
          })
          .sort()
          .paginate()
          .execute();

     return result;
};
export const auditService = { log, getAuditLogs }