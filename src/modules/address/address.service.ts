import { prisma } from "../../lib/prisma"

interface AddressPayload {
     label?: string
     line1: string
     line2?: string
     city: string
     district: string
     postalCode?: string
     isDefault?: boolean
}

const createAddress = async (userId: string, payload: AddressPayload) => {
     if (payload.isDefault) {
          await prisma.address.updateMany({ where: { userId }, data: { isDefault: false } })
     }
     return prisma.address.create({ data: { ...payload, userId } })
}

const getMyAddresses = async (userId: string) => {
     return prisma.address.findMany({ where: { userId }, orderBy: { isDefault: "desc" } })
}

const updateAddress = async (id: string, userId: string, payload: Partial<AddressPayload>) => {
     const address = await prisma.address.findFirst({ where: { id, userId } })
     if (!address) throw new Error("Address not found")
     if (payload.isDefault) {
          await prisma.address.updateMany({ where: { userId }, data: { isDefault: false } })
     }
     return prisma.address.update({ where: { id }, data: payload })
}

const deleteAddress = async (id: string, userId: string) => {
     const address = await prisma.address.findFirst({ where: { id, userId } })
     if (!address) throw new Error("Address not found")
     return prisma.address.delete({ where: { id } })
}

export const addressService = { createAddress, getMyAddresses, updateAddress, deleteAddress }