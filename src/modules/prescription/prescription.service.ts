import { prisma } from "../../lib/prisma"

const uploadPrescription = async (userId: string, payload: { images: string[]; notes?: string }) => {
     return prisma.prescription.create({
          data: { userId, images: payload.images, notes: payload.notes }
     })
}

const getMyPrescriptions = async (userId: string) => {
     return prisma.prescription.findMany({
          where: { userId },
          include: { items: { include: { medicine: true } } },
          orderBy: { createdAt: "desc" }
     })
}

const getAllPrescriptions = async () => {
     return prisma.prescription.findMany({
          include: {
               user: { select: { id: true, name: true, email: true, phone: true } },
               items: true
          },
          orderBy: { createdAt: "desc" }
     })
}

const reviewPrescription = async (
     id: string,
     payload: {
          status: "APPROVED" | "REJECTED"
          reviewedBy: string
          items?: { medicineId: string; medicineName: string; dosage?: string; quantity: number }[]
     }
) => {
     return prisma.$transaction(async (tx) => {
          const prescription = await tx.prescription.update({
               where: { id },
               data: { status: payload.status, reviewedBy: payload.reviewedBy }
          })

          if (payload.status === "APPROVED" && payload.items?.length) {
               await tx.prescriptionItem.createMany({
                    data: payload.items.map(item => ({ ...item, prescriptionId: id }))
               })
          }

          // Notify the user
          await tx.notification.create({
               data: {
                    userId: prescription.userId,
                    type: "PRESCRIPTION_STATUS",
                    title: `Prescription ${payload.status}`,
                    message: payload.status === "APPROVED"
                         ? "Your prescription has been approved. You can now order the medicines."
                         : "Your prescription was rejected. Please upload a valid prescription.",
                    meta: { prescriptionId: id }
               }
          })

          return prescription
     })
}

export const prescriptionService = {
     uploadPrescription, getMyPrescriptions,
     getAllPrescriptions, reviewPrescription
}