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


export const adminService = {
     getAllUsers,
     updateUserStatus
}
