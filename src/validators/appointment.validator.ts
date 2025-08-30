import z from 'zod'

export const AppointmentIdParamsSchema = z.object({
  id: z.string().min(12, { message: 'Appointment number must be 12 digits.' })
})

export const AppointmentBodyParamsSchema = z.object({
  id: z.string().min(12, { message: 'Appointment number must be 12 digits.' }),
  image: z
    .string()
    .min(12, { message: 'Appointment number must be 12 digits.' })
    .nullish()
})

export type AppointmentIdRequestParams = z.infer<
  typeof AppointmentIdParamsSchema
>

export type AppointmentRequestBody = z.infer<typeof AppointmentBodyParamsSchema>
