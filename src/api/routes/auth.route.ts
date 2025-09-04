import { Router } from 'express'
import { getUserController, loginController, registerController } from '../controllers/auth.controller'

const auth = Router()

auth.get('/user', getUserController)
auth.post('/login', loginController)
auth.post('/register', registerController)

export default auth
