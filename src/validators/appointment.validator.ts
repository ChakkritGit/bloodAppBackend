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

export const AppointmentParamsSchema = z.object({
  id: z.string().min(1, 'Appointment ID is required')
})

export const UpdateAppointmentBodySchema = z
  .object({
    f_appcreateconfirmname: z.string().optional(),
    f_appcreateconfirmdatetime: z.preprocess(arg => {
      if (typeof arg == 'string' || arg instanceof Date) return new Date(arg)
    }, z.date().optional()),

    f_appadminduedate: z.string().optional(),
    f_appadminduequemax: z.preprocess(arg => {
      if (typeof arg === 'string') return parseInt(arg, 10)
      return arg
    }, z.number().int().optional()),

    f_appadminconfirmvisitedate: z.preprocess(arg => {
      if (typeof arg == 'string' || arg instanceof Date) return new Date(arg)
    }, z.date().optional()),

    f_apppatientproveinfobyname: z.string().optional(),

    removedImageIds: z.preprocess(arg => {
      if (typeof arg === 'string') return JSON.parse(arg)
      return arg
    }, z.array(z.string()).optional())
  })
  .partial()

export type UpdateAppointmentBody = z.infer<typeof UpdateAppointmentBodySchema>
export type AppointmentIdRequestParams = z.infer<
  typeof AppointmentIdParamsSchema
>
export type AppointmentRequestBody = z.infer<typeof AppointmentBodyParamsSchema>
