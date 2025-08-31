import { Router } from 'express'
import { loginController, registerController } from '../controllers/auth.controller'

const auth = Router()

auth.post('/login', loginController)
auth.post('/register', registerController)

export default auth
