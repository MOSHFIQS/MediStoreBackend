import { IQueryParams } from "../../interfaces/query.interface"
import { prisma } from "../../lib/prisma"
import { QueryBuilder } from "../../utils/QueryBuilder"

interface CouponPayload {
     code: string
     description?: string
     discountType: "PERCENTAGE" | "FIXED"
     discountValue: number
     minOrderAmount?: number
     maxDiscount?: number
     usageLimit?: number
     expiresAt?: string
}

const createCoupon = async (payload: CouponPayload) => {
     return prisma.coupon.create({
          data: {
               ...payload, expiresAt: payload.expiresAt
                    ? new Date(payload.expiresAt)
                    : null
          }
     })
}

const getAllCoupons = async (query: IQueryParams = {}) => {
     const queryBuilder = new QueryBuilder(prisma.coupon, query, {
          searchableFields: ['code', 'description'], 
          filterableFields: ['isActive', 'discountType' ], 
     });

     const result = await queryBuilder
          .search() // search by code or description
          .filter() // filter by isActive, type, discount
          .sort() // default sort
          .paginate()
          .execute();

     return result;
};

const updateCoupon = async (id: string, payload: Partial<CouponPayload>) => {
     return prisma.coupon.update({
          where: { id },
          data: {
               ...payload, ...(payload.expiresAt !== undefined && {
                    expiresAt: payload.expiresAt
                         ? new Date(payload.expiresAt)
                         : null
               })
          }
     })
}

const deleteCoupon = async (id: string) => {
     return prisma.coupon.delete({ where: { id } })
}

const validateCoupon = async (code: string, orderAmount: number) => {
     const coupon = await prisma.coupon.findFirst({
          where: {
               code,
               isActive: true,
               OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }]
          }
     })
     if (!coupon) throw new Error("Invalid or expired coupon")
     if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) throw new Error("Coupon usage limit reached")
     if (coupon.minOrderAmount && orderAmount < coupon.minOrderAmount)
          throw new Error(`Minimum order amount is ৳${coupon.minOrderAmount}`)

     const discount = coupon.discountType === "PERCENTAGE"
          ? Math.min((orderAmount * coupon.discountValue) / 100, coupon.maxDiscount ?? Infinity)
          : coupon.discountValue

     return { coupon, discount }
}

export const couponService = { createCoupon, getAllCoupons, updateCoupon, deleteCoupon, validateCoupon }