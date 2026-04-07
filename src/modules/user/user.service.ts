
import { envVars } from "../../config/env"
import { prisma } from "../../lib/prisma"
import jwt from "jsonwebtoken"
import { subDays, startOfDay, endOfDay, startOfMonth, endOfMonth, subMonths } from "date-fns";
import { OrderStatus, PaymentStatus, Role, UserStatus } from "../../../generated/prisma/enums";

const JWT_SECRET = envVars.JWT_SECRET || "supersecret"


const getMe = async (token: string) => {
     const decoded = jwt.verify(token, JWT_SECRET) as { id: string; role: string; email: string }
     const user = await prisma.user.findUnique({ where: { id: decoded.id } })
     if (!user) throw new Error("User not found")
     return user
}

export const updateProfile = async (token: string, payload: any) => {
     const decoded = jwt.verify(token, JWT_SECRET) as { id: string }

     delete payload.role
     delete payload.status
     delete payload.email
     delete payload.password

     const updatedUser = await prisma.user.update({
          where: { id: decoded.id },
          data: {
               name: payload.name,
               phone: payload.phone,
               image: payload.image,
          },
          select: {
               id: true,
               name: true,
               email: true,
               role: true,
               status: true,
               phone: true,
               image: true,
               createdAt: true,
          },
     })

     return updatedUser
}






const getAdminStatistics = async () => {
     const now = new Date();
     const todayStart = startOfDay(now);
     const todayEnd = endOfDay(now);
     const thisMonthStart = startOfMonth(now);
     const thisMonthEnd = endOfMonth(now);
     const lastMonthStart = startOfMonth(subMonths(now, 1));
     const lastMonthEnd = endOfMonth(subMonths(now, 1));
     const last7Days = subDays(now, 7);
     const last30Days = subDays(now, 30);

     const [
          // Users
          totalUsers, totalCustomers, totalSellers, totalAdmins,
          activeUsers, bannedUsers, suspendedUsers,
          verifiedUsers, newUsersToday, newUsersThisMonth, newUsersLastMonth,

          // Medicines
          totalMedicines, activeMedicines, inactiveMedicines,
          outOfStockMedicines, lowStockMedicines,

          // Orders
          totalOrders, placedOrders, confirmedOrders, processingOrders,
          shippedOrders, deliveredOrders, cancelledOrders, refundedOrders,
          ordersToday, ordersThisMonth, ordersLastMonth, ordersLast7Days,

          // Revenue
          totalRevenue, revenueThisMonth, revenueLastMonth, revenueToday,
          revenueByPaymentMethod,

          // Payments
          totalPayments, successPayments, pendingPayments,
          failedPayments, refundedPayments, totalRefunded,



          // Reviews
          totalReviews, avgRating,

          // Categories
          totalCategories,

          // Coupons
          totalCoupons, activeCoupons,

          // Top selling medicines
          topSellingMedicines,

          // Recent orders
          recentOrders,

          // Order status breakdown for chart
          orderStatusBreakdown,

          // Revenue last 7 days (daily)
          revenueDaily,

     ] = await Promise.all([
          // Users
          prisma.user.count(),
          prisma.user.count({ where: { role: Role.CUSTOMER } }),
          prisma.user.count({ where: { role: Role.SELLER } }),
          prisma.user.count({ where: { role: Role.ADMIN } }),
          prisma.user.count({ where: { status: UserStatus.ACTIVE } }),
          prisma.user.count({ where: { status: UserStatus.BANNED } }),
          prisma.user.count({ where: { status: UserStatus.SUSPENDED } }),
          prisma.user.count({ where: { isEmailVerified: true } }),
          prisma.user.count({ where: { createdAt: { gte: todayStart, lte: todayEnd } } }),
          prisma.user.count({ where: { createdAt: { gte: thisMonthStart, lte: thisMonthEnd } } }),
          prisma.user.count({ where: { createdAt: { gte: lastMonthStart, lte: lastMonthEnd } } }),

          // Medicines
          prisma.medicine.count(),
          prisma.medicine.count({ where: { isActive: true } }),
          prisma.medicine.count({ where: { isActive: false } }),
          prisma.medicine.count({ where: { stock: 0 } }),
          prisma.medicine.count({ where: { stock: { gt: 0, lte: 10 } } }),

          // Orders
          prisma.order.count(),
          prisma.order.count({ where: { status: OrderStatus.PLACED } }),
          prisma.order.count({ where: { status: OrderStatus.CONFIRMED } }),
          prisma.order.count({ where: { status: OrderStatus.PROCESSING } }),
          prisma.order.count({ where: { status: OrderStatus.SHIPPED } }),
          prisma.order.count({ where: { status: OrderStatus.DELIVERED } }),
          prisma.order.count({ where: { status: OrderStatus.CANCELLED } }),
          prisma.order.count({ where: { status: OrderStatus.REFUNDED } }),
          prisma.order.count({ where: { createdAt: { gte: todayStart, lte: todayEnd } } }),
          prisma.order.count({ where: { createdAt: { gte: thisMonthStart, lte: thisMonthEnd } } }),
          prisma.order.count({ where: { createdAt: { gte: lastMonthStart, lte: lastMonthEnd } } }),
          prisma.order.count({ where: { createdAt: { gte: last7Days } } }),

          // Revenue
          prisma.order.aggregate({ _sum: { totalPrice: true }, where: { status: OrderStatus.DELIVERED } }),
          prisma.order.aggregate({ _sum: { totalPrice: true }, where: { status: OrderStatus.DELIVERED, createdAt: { gte: thisMonthStart, lte: thisMonthEnd } } }),
          prisma.order.aggregate({ _sum: { totalPrice: true }, where: { status: OrderStatus.DELIVERED, createdAt: { gte: lastMonthStart, lte: lastMonthEnd } } }),
          prisma.order.aggregate({ _sum: { totalPrice: true }, where: { status: OrderStatus.DELIVERED, createdAt: { gte: todayStart, lte: todayEnd } } }),
          prisma.payment.groupBy({ by: ["method"], _sum: { amount: true }, where: { status: PaymentStatus.SUCCESS } }),

          // Payments
          prisma.payment.count(),
          prisma.payment.count({ where: { status: PaymentStatus.SUCCESS } }),
          prisma.payment.count({ where: { status: PaymentStatus.PENDING } }),
          prisma.payment.count({ where: { status: PaymentStatus.FAILED } }),
          prisma.payment.count({ where: { status: PaymentStatus.REFUNDED } }),
          prisma.payment.aggregate({ _sum: { refundAmount: true }, where: { status: PaymentStatus.REFUNDED } }),



          // Reviews
          prisma.review.count(),
          prisma.review.aggregate({ _avg: { rating: true } }),

          // Categories
          prisma.category.count(),

          // Coupons
          prisma.coupon.count(),
          prisma.coupon.count({ where: { isActive: true } }),

          // Top selling medicines
          prisma.orderItem.groupBy({
               by: ["medicineId", "medicineName"],
               _sum: { quantity: true, totalPrice: true },
               orderBy: { _sum: { quantity: "desc" } },
               take: 5,
          }),

          // Recent orders
          prisma.order.findMany({
               take: 5,
               orderBy: { createdAt: "desc" },
               include: {
                    customer: { select: { name: true, email: true, image: true } },
                    payment: { select: { method: true, status: true } },
               },
          }),

          // Order status breakdown
          prisma.order.groupBy({
               by: ["status"],
               _count: { status: true },
          }),

          // Revenue daily last 7 days (raw)
          prisma.order.findMany({
               where: { status: OrderStatus.DELIVERED, createdAt: { gte: last7Days } },
               select: { createdAt: true, totalPrice: true },
               orderBy: { createdAt: "asc" },
          }),
     ]);

     // Group daily revenue
     const dailyRevenueMap: Record<string, number> = {};
     for (let i = 6; i >= 0; i--) {
          const d = subDays(now, i);
          const key = d.toISOString().split("T")[0];
          dailyRevenueMap[key] = 0;
     }
     for (const order of revenueDaily) {
          const key = order.createdAt.toISOString().split("T")[0];
          if (key in dailyRevenueMap) dailyRevenueMap[key] += order.totalPrice;
     }

     const revenueGrowth = (() => {
          const thisM = revenueThisMonth._sum.totalPrice || 0;
          const lastM = revenueLastMonth._sum.totalPrice || 0;
          if (!lastM) return thisM > 0 ? 100 : 0;
          return Number((((thisM - lastM) / lastM) * 100).toFixed(1));
     })();

     const orderGrowth = (() => {
          if (!ordersLastMonth) return ordersThisMonth > 0 ? 100 : 0;
          return Number((((ordersThisMonth - ordersLastMonth) / ordersLastMonth) * 100).toFixed(1));
     })();

     const userGrowth = (() => {
          if (!newUsersLastMonth) return newUsersThisMonth > 0 ? 100 : 0;
          return Number((((newUsersThisMonth - newUsersLastMonth) / newUsersLastMonth) * 100).toFixed(1));
     })();

     return {
          users: {
               total: totalUsers, customers: totalCustomers, sellers: totalSellers, admins: totalAdmins,
               active: activeUsers, banned: bannedUsers, suspended: suspendedUsers,
               verified: verifiedUsers,
               newToday: newUsersToday, newThisMonth: newUsersThisMonth, newLastMonth: newUsersLastMonth,
               growth: userGrowth,
          },
          medicines: {
               total: totalMedicines, active: activeMedicines, inactive: inactiveMedicines,
               outOfStock: outOfStockMedicines, lowStock: lowStockMedicines,
          },
          orders: {
               total: totalOrders,
               byStatus: {
                    placed: placedOrders, confirmed: confirmedOrders, processing: processingOrders,
                    shipped: shippedOrders, delivered: deliveredOrders, cancelled: cancelledOrders, refunded: refundedOrders,
               },
               today: ordersToday, thisMonth: ordersThisMonth, lastMonth: ordersLastMonth, last7Days: ordersLast7Days,
               growth: orderGrowth,
               statusBreakdown: orderStatusBreakdown.map((s) => ({ status: s.status, count: s._count.status })),
          },
          revenue: {
               total: totalRevenue._sum.totalPrice || 0,
               today: revenueToday._sum.totalPrice || 0,
               thisMonth: revenueThisMonth._sum.totalPrice || 0,
               lastMonth: revenueLastMonth._sum.totalPrice || 0,
               growth: revenueGrowth,
               byPaymentMethod: revenueByPaymentMethod.map((p) => ({ method: p.method, amount: p._sum.amount || 0 })),
               daily: Object.entries(dailyRevenueMap).map(([date, amount]) => ({ date, amount })),
          },
          payments: {
               total: totalPayments, success: successPayments, pending: pendingPayments,
               failed: failedPayments, refunded: refundedPayments,
               totalRefunded: totalRefunded._sum.refundAmount || 0,
          },

          reviews: {
               total: totalReviews, avgRating: Number((avgRating._avg.rating || 0).toFixed(1)),
          },
          categories: { total: totalCategories },
          coupons: { total: totalCoupons, active: activeCoupons },
          topSellingMedicines: topSellingMedicines.map((m) => ({
               medicineId: m.medicineId, medicineName: m.medicineName,
               totalQuantity: m._sum.quantity || 0, totalRevenue: m._sum.totalPrice || 0,
          })),
          recentOrders: recentOrders.map((o) => ({
               id: o.id, status: o.status, totalPrice: o.totalPrice, createdAt: o.createdAt,
               customer: o.customer, payment: o.payment,
          })),
     };
}




const getCustomerStatistics = async (userId: string) => {
     const now = new Date();
     const todayStart = startOfDay(now);
     const todayEnd = endOfDay(now);
     const thisMonthStart = startOfMonth(now);
     const thisMonthEnd = endOfMonth(now);
     const lastMonthStart = startOfMonth(subMonths(now, 1));
     const lastMonthEnd = endOfMonth(subMonths(now, 1));
     const last30Days = subDays(now, 30);

     const [
          // Orders
          totalOrders, placedOrders, confirmedOrders, processingOrders,
          shippedOrders, deliveredOrders, cancelledOrders, refundedOrders,
          ordersThisMonth, ordersLastMonth,

          // Spending
          totalSpent, spentThisMonth, spentLastMonth, spentToday,

          // Payments
          totalPayments, successPayments, pendingPayments, failedPayments,



          // Reviews
          totalReviews, avgRatingGiven,

          // Addresses
          totalAddresses,

          // Notifications
          totalNotifications, unreadNotifications,

          // Favourite / repeat purchase (most ordered medicine)
          topOrderedMedicines,

          // Recent orders
          recentOrders,



          // Coupon savings
          couponSavings,

     ] = await Promise.all([
          // Orders
          prisma.order.count({ where: { customerId: userId } }),
          prisma.order.count({ where: { customerId: userId, status: OrderStatus.PLACED } }),
          prisma.order.count({ where: { customerId: userId, status: OrderStatus.CONFIRMED } }),
          prisma.order.count({ where: { customerId: userId, status: OrderStatus.PROCESSING } }),
          prisma.order.count({ where: { customerId: userId, status: OrderStatus.SHIPPED } }),
          prisma.order.count({ where: { customerId: userId, status: OrderStatus.DELIVERED } }),
          prisma.order.count({ where: { customerId: userId, status: OrderStatus.CANCELLED } }),
          prisma.order.count({ where: { customerId: userId, status: OrderStatus.REFUNDED } }),
          prisma.order.count({ where: { customerId: userId, createdAt: { gte: thisMonthStart, lte: thisMonthEnd } } }),
          prisma.order.count({ where: { customerId: userId, createdAt: { gte: lastMonthStart, lte: lastMonthEnd } } }),

          // Spending (delivered only)
          prisma.order.aggregate({ _sum: { totalPrice: true }, where: { customerId: userId, status: OrderStatus.DELIVERED } }),
          prisma.order.aggregate({ _sum: { totalPrice: true }, where: { customerId: userId, status: OrderStatus.DELIVERED, createdAt: { gte: thisMonthStart, lte: thisMonthEnd } } }),
          prisma.order.aggregate({ _sum: { totalPrice: true }, where: { customerId: userId, status: OrderStatus.DELIVERED, createdAt: { gte: lastMonthStart, lte: lastMonthEnd } } }),
          prisma.order.aggregate({ _sum: { totalPrice: true }, where: { customerId: userId, status: OrderStatus.DELIVERED, createdAt: { gte: todayStart, lte: todayEnd } } }),

          // Payments
          prisma.payment.count({ where: { order: { customerId: userId } } }),
          prisma.payment.count({ where: { order: { customerId: userId }, status: PaymentStatus.SUCCESS } }),
          prisma.payment.count({ where: { order: { customerId: userId }, status: PaymentStatus.PENDING } }),
          prisma.payment.count({ where: { order: { customerId: userId }, status: PaymentStatus.FAILED } }),



          // Reviews
          prisma.review.count({ where: { userId } }),
          prisma.review.aggregate({ _avg: { rating: true }, where: { userId } }),

          // Addresses
          prisma.address.count({ where: { userId } }),

          // Notifications
          prisma.notification.count({ where: { userId } }),
          prisma.notification.count({ where: { userId, isRead: false } }),

          // Top ordered medicines
          prisma.orderItem.groupBy({
               by: ["medicineId", "medicineName"],
               where: { order: { customerId: userId } },
               _sum: { quantity: true, totalPrice: true },
               orderBy: { _sum: { quantity: "desc" } },
               take: 5,
          }),

          // Recent orders
          prisma.order.findMany({
               where: { customerId: userId },
               orderBy: { createdAt: "desc" },
               take: 5,
               include: {
                    items: { select: { medicineName: true, quantity: true, unitPrice: true, medicineImage: true } },
                    payment: { select: { method: true, status: true } },
               },
          }),



          // Coupon savings
          prisma.order.aggregate({ _sum: { couponDiscount: true }, where: { customerId: userId } }),
     ]);

     const spendingGrowth = (() => {
          const thisM = spentThisMonth._sum.totalPrice || 0;
          const lastM = spentLastMonth._sum.totalPrice || 0;
          if (!lastM) return thisM > 0 ? 100 : 0;
          return Number((((thisM - lastM) / lastM) * 100).toFixed(1));
     })();

     return {
          orders: {
               total: totalOrders,
               byStatus: {
                    placed: placedOrders, confirmed: confirmedOrders, processing: processingOrders,
                    shipped: shippedOrders, delivered: deliveredOrders, cancelled: cancelledOrders, refunded: refundedOrders,
               },
               thisMonth: ordersThisMonth, lastMonth: ordersLastMonth,
               active: placedOrders + confirmedOrders + processingOrders + shippedOrders,
          },
          spending: {
               total: totalSpent._sum.totalPrice || 0,
               today: spentToday._sum.totalPrice || 0,
               thisMonth: spentThisMonth._sum.totalPrice || 0,
               lastMonth: spentLastMonth._sum.totalPrice || 0,
               growth: spendingGrowth,
               couponSavings: couponSavings._sum.couponDiscount || 0,
          },
          payments: {
               total: totalPayments, success: successPayments,
               pending: pendingPayments, failed: failedPayments,
          },

          reviews: {
               total: totalReviews,
               avgRating: Number((avgRatingGiven._avg.rating || 0).toFixed(1)),
          },
          addresses: { total: totalAddresses },
          notifications: { total: totalNotifications, unread: unreadNotifications },
          topOrderedMedicines: topOrderedMedicines.map((m) => ({
               medicineId: m.medicineId, medicineName: m.medicineName,
               totalQuantity: m._sum.quantity || 0, totalSpent: m._sum.totalPrice || 0,
          })),
          recentOrders,
     };
}





const getSellerStatistics = async (userId: string) => {
     const now = new Date();
     const todayStart = startOfDay(now);
     const todayEnd = endOfDay(now);
     const thisMonthStart = startOfMonth(now);
     const thisMonthEnd = endOfMonth(now);
     const lastMonthStart = startOfMonth(subMonths(now, 1));
     const lastMonthEnd = endOfMonth(subMonths(now, 1));
     const last7Days = subDays(now, 7);

     const [
          // Medicines
          totalMedicines, activeMedicines, inactiveMedicines,
          outOfStockMedicines, lowStockMedicines,
          medicinesAddedThisMonth,

          // Orders through seller's medicines
          totalOrders, deliveredOrders, processingOrders, cancelledOrders,
          ordersThisMonth, ordersLastMonth, ordersToday,

          // Revenue from delivered orders containing seller's medicines
          topSellingMedicines,

          // Reviews on seller's medicines
          totalReviews, avgRating,

          // Batches
          totalBatches, activeBatches, expiredBatches,

          // Recent orders containing seller's medicines
          recentOrders,

          // Category breakdown
          medicinesByCategory,

          // Revenue raw data for daily chart
          revenueOrders,

     ] = await Promise.all([
          // Medicines
          prisma.medicine.count({ where: { sellerId: userId } }),
          prisma.medicine.count({ where: { sellerId: userId, isActive: true } }),
          prisma.medicine.count({ where: { sellerId: userId, isActive: false } }),
          prisma.medicine.count({ where: { sellerId: userId, stock: 0 } }),
          prisma.medicine.count({ where: { sellerId: userId, stock: { gt: 0, lte: 10 } } }),
          prisma.medicine.count({ where: { sellerId: userId, createdAt: { gte: thisMonthStart, lte: thisMonthEnd } } }),

          // Orders via orderItems → medicine → seller
          prisma.order.count({ where: { items: { some: { medicine: { sellerId: userId } } } } }),
          prisma.order.count({ where: { items: { some: { medicine: { sellerId: userId } } }, status: OrderStatus.DELIVERED } }),
          prisma.order.count({ where: { items: { some: { medicine: { sellerId: userId } } }, status: { in: [OrderStatus.PROCESSING, OrderStatus.CONFIRMED, OrderStatus.SHIPPED] } } }),
          prisma.order.count({ where: { items: { some: { medicine: { sellerId: userId } } }, status: OrderStatus.CANCELLED } }),
          prisma.order.count({ where: { items: { some: { medicine: { sellerId: userId } } }, createdAt: { gte: thisMonthStart, lte: thisMonthEnd } } }),
          prisma.order.count({ where: { items: { some: { medicine: { sellerId: userId } } }, createdAt: { gte: lastMonthStart, lte: lastMonthEnd } } }),
          prisma.order.count({ where: { items: { some: { medicine: { sellerId: userId } } }, createdAt: { gte: todayStart, lte: todayEnd } } }),

          // Top selling medicines (by quantity sold)
          prisma.orderItem.groupBy({
               by: ["medicineId", "medicineName"],
               where: { medicine: { sellerId: userId } },
               _sum: { quantity: true, totalPrice: true },
               orderBy: { _sum: { quantity: "desc" } },
               take: 5,
          }),

          // Reviews
          prisma.review.count({ where: { medicine: { sellerId: userId } } }),
          prisma.review.aggregate({ _avg: { rating: true }, where: { medicine: { sellerId: userId } } }),

          // Batches
          prisma.medicineBatch.count({ where: { medicine: { sellerId: userId } } }),
          prisma.medicineBatch.count({ where: { medicine: { sellerId: userId }, isActive: true } }),
          prisma.medicineBatch.count({ where: { medicine: { sellerId: userId }, expiryDate: { lt: now } } }),

          // Recent orders
          prisma.order.findMany({
               where: { items: { some: { medicine: { sellerId: userId } } } },
               orderBy: { createdAt: "desc" },
               take: 5,
               include: {
                    customer: { select: { name: true, email: true, image: true } },
                    items: {
                         where: { medicine: { sellerId: userId } },
                         select: { medicineName: true, quantity: true, unitPrice: true, totalPrice: true },
                    },
                    payment: { select: { method: true, status: true } },
               },
          }),

          // Medicines by category
          prisma.medicine.groupBy({
               by: ["categoryId"],
               where: { sellerId: userId },
               _count: { categoryId: true },
          }),

          // Revenue raw for daily chart (last 7 days, delivered)
          prisma.orderItem.findMany({
               where: {
                    medicine: { sellerId: userId },
                    order: { status: OrderStatus.DELIVERED, createdAt: { gte: last7Days } },
               },
               select: { totalPrice: true, order: { select: { createdAt: true } } },
          }),
     ]);

     // Aggregate revenue from orderItems (only seller's items)
     const sellerItemsAll = await prisma.orderItem.aggregate({
          _sum: { totalPrice: true },
          where: { medicine: { sellerId: userId }, order: { status: OrderStatus.DELIVERED } },
     });
     const sellerItemsThisMonth = await prisma.orderItem.aggregate({
          _sum: { totalPrice: true },
          where: { medicine: { sellerId: userId }, order: { status: OrderStatus.DELIVERED, createdAt: { gte: thisMonthStart, lte: thisMonthEnd } } },
     });
     const sellerItemsLastMonth = await prisma.orderItem.aggregate({
          _sum: { totalPrice: true },
          where: { medicine: { sellerId: userId }, order: { status: OrderStatus.DELIVERED, createdAt: { gte: lastMonthStart, lte: lastMonthEnd } } },
     });
     const sellerItemsToday = await prisma.orderItem.aggregate({
          _sum: { totalPrice: true },
          where: { medicine: { sellerId: userId }, order: { status: OrderStatus.DELIVERED, createdAt: { gte: todayStart, lte: todayEnd } } },
     });

     // Daily revenue map
     const dailyRevenueMap: Record<string, number> = {};
     for (let i = 6; i >= 0; i--) {
          const d = subDays(now, i);
          dailyRevenueMap[d.toISOString().split("T")[0]] = 0;
     }
     for (const item of revenueOrders) {
          const key = item.order.createdAt.toISOString().split("T")[0];
          if (key in dailyRevenueMap) dailyRevenueMap[key] += item.totalPrice;
     }

     const revenueGrowth = (() => {
          const thisM = sellerItemsThisMonth._sum.totalPrice || 0;
          const lastM = sellerItemsLastMonth._sum.totalPrice || 0;
          if (!lastM) return thisM > 0 ? 100 : 0;
          return Number((((thisM - lastM) / lastM) * 100).toFixed(1));
     })();

     const orderGrowth = (() => {
          if (!ordersLastMonth) return ordersThisMonth > 0 ? 100 : 0;
          return Number((((ordersThisMonth - ordersLastMonth) / ordersLastMonth) * 100).toFixed(1));
     })();

     // Category names
     const categoryIds = medicinesByCategory.map((m) => m.categoryId);
     const categories = await prisma.category.findMany({
          where: { id: { in: categoryIds } },
          select: { id: true, name: true },
     });
     const categoryMap = Object.fromEntries(categories.map((c) => [c.id, c.name]));

     return {
          medicines: {
               total: totalMedicines, active: activeMedicines, inactive: inactiveMedicines,
               outOfStock: outOfStockMedicines, lowStock: lowStockMedicines,
               addedThisMonth: medicinesAddedThisMonth,
               byCategory: medicinesByCategory.map((m) => ({
                    categoryId: m.categoryId,
                    categoryName: categoryMap[m.categoryId] || "Unknown",
                    count: m._count.categoryId,
               })),
          },
          orders: {
               total: totalOrders, delivered: deliveredOrders, processing: processingOrders,
               cancelled: cancelledOrders, today: ordersToday,
               thisMonth: ordersThisMonth, lastMonth: ordersLastMonth,
               growth: orderGrowth,
          },
          revenue: {
               total: sellerItemsAll._sum.totalPrice || 0,
               today: sellerItemsToday._sum.totalPrice || 0,
               thisMonth: sellerItemsThisMonth._sum.totalPrice || 0,
               lastMonth: sellerItemsLastMonth._sum.totalPrice || 0,
               growth: revenueGrowth,
               daily: Object.entries(dailyRevenueMap).map(([date, amount]) => ({ date, amount })),
          },
          reviews: {
               total: totalReviews,
               avgRating: Number((avgRating._avg.rating || 0).toFixed(1)),
          },
          batches: {
               total: totalBatches, active: activeBatches, expired: expiredBatches,
          },
          topSellingMedicines: topSellingMedicines.map((m) => ({
               medicineId: m.medicineId, medicineName: m.medicineName,
               totalQuantity: m._sum.quantity || 0, totalRevenue: m._sum.totalPrice || 0,
          })),
          recentOrders,
     };
}

export const userService = {
     getMe,
     updateProfile,
     getAdminStatistics,
     getCustomerStatistics,
     getSellerStatistics
}
