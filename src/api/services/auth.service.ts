import { tb_user } from '@prisma/client'
import {
  AuthLoginRequestBody,
  AuthRegisterRequestBody
} from '../../validators/auth.validator'
import { sign } from 'jsonwebtoken'
import { HttpError } from '../../types/global'
import prisma from '../../configs/prisma'
import { hashPassword, hashPasswordCompare } from '../../utils/hash'
import { v4 as uuidv4 } from 'uuid'

export const loginService = async (
  authBody: AuthLoginRequestBody
): Promise<tb_user | null> => {
  try {
    const findUser = await prisma.tb_user.findFirst({
      where: { f_username: authBody.f_username.toLowerCase() }
    })

    if (!findUser) throw new HttpError(404, 'User not found.')
    if (findUser.f_userstatus === 1)
      throw new HttpError(403, 'User is inactive.')

    const match = await hashPasswordCompare(
      authBody.f_userpass.toLowerCase(),
      findUser.f_userpass
    )

    if (!match) throw new HttpError(403, 'Password incorrect.')

    const { f_id, f_username, f_userfullname, f_userstatus } = findUser
    const token: string = sign(
      { f_id, f_username, f_userfullname, f_userstatus },
      String(process.env.JWT_SECRET),
      { expiresIn: '7d' }
    )
    return {
      token,
      f_id,
      f_userfullname,
      f_userstatus
    } as unknown as tb_user
  } catch (error) {
    throw error
  }
}

export const registerService = async (
  authBody: AuthRegisterRequestBody
): Promise<tb_user> => {
  try {
    const { f_userfullname, f_username, f_userpass, f_userstatus } = authBody
    const findUser = await prisma.tb_user.findUnique({
      where: { f_username }
    })

    if (findUser) {
      throw new HttpError(409, 'This username is already taken.')
    }

    const UUID = `UID-${uuidv4()}`
    const result = await prisma.tb_user.create({
      select: {
        f_id: true,
        f_username: true,
        f_userfullname: true,
        f_userstatus: true
      },
      data: {
        f_id: UUID,
        f_username: f_username.toLowerCase(),
        f_userpass: await hashPassword(f_userpass.toLowerCase()),
        f_userfullname: f_userfullname,
        f_userstatus: 0
      }
    })
    return result as unknown as tb_user
  } catch (error) {
    throw error
  }
}
