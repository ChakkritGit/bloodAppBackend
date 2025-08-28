import z from 'zod'

export const AppointmentIdParamsSchema = z.object({
  id: z.string().min(10, { message: 'Appointment Id must be 10 digits.' })
})

export type AppointmentIdRequestParams = z.infer<
  typeof AppointmentIdParamsSchema
>
