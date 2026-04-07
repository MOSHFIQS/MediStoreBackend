import { UserStatus } from "../../../generated/prisma/enums"
import { prisma } from "../../lib/prisma"
import { auditService } from "../audit/audit.service"

const getAllUsers = async () => {
     return prisma.user.findMany({
          orderBy: { createdAt: "desc" },
          select: {
               id: true,
               name: true,
               email: true,
               role: true,
               status: true,
               phone: true,
               image: true,
               isEmailVerified: true,
               lastLoginAt: true,
               createdAt: true,
          },
     })
}

const updateUserStatus = async (
     userId: string,
     newStatus: UserStatus,
     adminId: string,
     ipAddress?: string,
) => {
     const user = await prisma.user.findUnique({
          where: { id: userId },
          select: { status: true, role: true },
     })

     if (!user) throw new Error("User not found")

     // prevent self-ban
     if (userId === adminId) {
          throw new Error("You cannot change your own status")
     }

     // prevent banning another admin
     if (user.role === "ADMIN") {
          throw new Error("You cannot change another admin's status")
     }

     const updated = await prisma.user.update({
          where: { id: userId },
          data: { status: newStatus },
     })

     await auditService.log({
          userId: adminId,
          action: `USER_${newStatus}`,
          entity: "User",
          entityId: userId,
          oldValue: { status: user.status },
          newValue: { status: newStatus },
          ...(ipAddress !== undefined && { ipAddress }),
     })

     return updated
}

const deleteUser = async (
     userId: string,
     adminId: string,
     ipAddress?: string,
) => {
     const oldUser = await prisma.user.findUnique({ where: { id: userId } })

     if (!oldUser) throw new Error("User not found")

     await prisma.user.delete({ where: { id: userId } })

     await auditService.log({
          userId: adminId,
          action: "USER_DELETED",
          entity: "User",
          entityId: userId,
          oldValue: { name: oldUser.name, email: oldUser.email, role: oldUser.role },
          newValue: null,
          ...(ipAddress !== undefined && { ipAddress }),
     })
}

const getStatistics = async () => {
     const totalUsers = await prisma.user.count();
     const totalSellers = await prisma.user.count({ where: { role: "SELLER" } });
     const totalCustomers = await prisma.user.count({ where: { role: "CUSTOMER" } });
     const totalAdmins = await prisma.user.count({ where: { role: "ADMIN" } });
     const totalMedicines = await prisma.medicine.count();
     const totalOrders = await prisma.order.count();
     const totalDeliveredOrders = await prisma.order.count({ where: { status: "DELIVERED" } });
     const totalRevenue = await prisma.order.aggregate({ _sum: { totalPrice: true } });

     return {
          users: { total: totalUsers, customers: totalCustomers, sellers: totalSellers, admins: totalAdmins },
          medicines: totalMedicines,
          orders: { total: totalOrders, delivered: totalDeliveredOrders },
          revenue: totalRevenue._sum.totalPrice || 0,
     }
}

export const adminService = {
     getAllUsers,
     updateUserStatus,
     deleteUser,
     getStatistics,
}