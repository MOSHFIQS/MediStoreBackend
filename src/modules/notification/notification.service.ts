import { prisma } from "../../lib/prisma"

const getMyNotifications = async (userId: string) => {
     return prisma.notification.findMany({
          where: { userId },
          orderBy: { createdAt: "desc" },
          take: 50
     })
}

const markAsRead = async (id: string, userId: string) => {
     return prisma.notification.update({ where: { id, userId } as any, data: { isRead: true } })
}

const markAllAsRead = async (userId: string) => {
     return prisma.notification.updateMany({ where: { userId, isRead: false }, data: { isRead: true } })
}

const getUnreadCount = async (userId: string) => {
     return prisma.notification.count({ where: { userId, isRead: false } })
}

export const notificationService = { getMyNotifications, markAsRead, markAllAsRead, getUnreadCount }