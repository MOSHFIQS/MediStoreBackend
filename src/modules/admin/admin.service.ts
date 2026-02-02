import { UserStatus } from "../../../generated/prisma/enums"
import { prisma } from "../../lib/prisma"



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
               createdAt: true
          }
     })
}

const updateUserStatus = async (userId: string, status: UserStatus) => {
     return prisma.user.update({
          where: { id: userId },
          data: { status }
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
     const totalRevenue = await prisma.order.aggregate({
          _sum: { totalPrice: true },
     });

     return {
          users: {
               total: totalUsers,
               customers: totalCustomers,
               sellers: totalSellers,
               admins: totalAdmins,
          },
          medicines: totalMedicines,
          orders: {
               total: totalOrders,
               delivered: totalDeliveredOrders,
          },
          revenue: totalRevenue._sum.totalPrice || 0,
     };
}




export const adminService = {
     getAllUsers,
     updateUserStatus,
     getStatistics
}
