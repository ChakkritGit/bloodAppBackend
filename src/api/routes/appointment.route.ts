import { Router } from 'express'
import { findAppointmentById } from '../controllers/appointment.controller'

const appointment = Router()

appointment.get('/:id', findAppointmentById)

export default appointment
