import z from 'zod'

export const AuthLoginBodySchema = z.object({
  f_username: z.string(),
  f_userpass: z.string()
})

export const AuthRegisterBodySchema = z.object({
  f_username: z.string().max(64),
  f_userpass: z.string().min(6),
  f_userfullname: z.string(),
  f_userstatus: z.string().optional()
})

export type AuthLoginRequestBody = z.infer<typeof AuthLoginBodySchema>
export type AuthRegisterRequestBody = z.infer<typeof AuthRegisterBodySchema>
