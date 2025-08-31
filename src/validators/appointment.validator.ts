import z from 'zod'

export const AppointmentIdParamsSchema = z.object({
  id: z.string().min(12, { message: 'Appointment number must be 12 digits.' })
})

export const AppointmentBodyParamsSchema = z.object({
  f_appidno: z.string().min(12).max(12).optional(),
  f_appcreatebyname: z.string().optional(),
  f_appcreateforhn: z.string().optional(),
  f_appcreateforname: z.string().optional(),
  f_appcreatecontacttelephone: z.string().min(10).max(10).optional(),
  f_appcreatecontacttelephonetwo: z.string().min(10).max(10).optional(),
  f_appcreatecontactaddress: z.string().optional(),
  f_appcreatecontactlat: z.string().optional(),
  f_appcreatecontactlon: z.string().optional(),
  f_appdoctorduedate: z.string().optional(),
  f_apppictureappdoc: z.string().optional(),
  image: z.string().optional().nullable()
})

export type AppointmentIdRequestParams = z.infer<
  typeof AppointmentIdParamsSchema
>

export type AppointmentRequestBody = z.infer<typeof AppointmentBodyParamsSchema>
