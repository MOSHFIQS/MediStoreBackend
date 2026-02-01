
import { prisma } from "../../lib/prisma"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "supersecret"


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


export const userService = {
     getMe,
     updateProfile
}
