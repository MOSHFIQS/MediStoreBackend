import { prisma } from "../../lib/prisma"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "supersecret"

interface RegisterData {
     name: string
     email: string
     password: string
     role?: "CUSTOMER" | "SELLER"
}

interface LoginData {
     email: string
     password: string
}

const signUpUser = async (payload: RegisterData) => {
     const { name, email, password, role } = payload

     const existing = await prisma.user.findUnique({ where: { email } })
     if (existing) throw new Error("Email already exists")

     const hashed = await bcrypt.hash(password, 10)

     const user = await prisma.user.create({
          data: {
               name,
               email,
               password: hashed,
               role: role === "SELLER" ? "SELLER" : "CUSTOMER"
          }
     })

     const token = jwt.sign({ id: user.id, role: user.role, email: user.email, status: user.status }, JWT_SECRET, { expiresIn: "7d" })

     return { user, token }
}




const signInUser = async (payload: LoginData) => {
     const { email, password } = payload

     const user = await prisma.user.findUnique({ where: { email } })

     if (!user) throw new Error("Invalid credentials")

     const isMatch = await bcrypt.compare(password, user.password)
     if (!isMatch) throw new Error("Invalid credentials")

     const token = jwt.sign({ id: user.id, role: user.role, email: user.email, status: user.status }, JWT_SECRET, { expiresIn: "7d" })

     return { user, token }
}



const getCurrentUser = async (token: string) => {
     const decoded = jwt.verify(token, JWT_SECRET) as { id: string; role: string; email: string }
     const user = await prisma.user.findUnique({ where: { id: decoded.id } })
     if (!user) throw new Error("User not found")
     return user
}



export const authService = { signUpUser, signInUser, getCurrentUser }
