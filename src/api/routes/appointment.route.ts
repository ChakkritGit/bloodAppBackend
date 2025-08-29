import { Router } from 'express'
import { createAppointment, findAppointmentById } from '../controllers/appointment.controller'

const appointment = Router()

appointment.get('/:id', findAppointmentById)
appointment.post('/', createAppointment)

export default appointment
