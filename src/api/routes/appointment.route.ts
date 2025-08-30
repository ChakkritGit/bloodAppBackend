import { Router } from 'express'
import { createAppointment, findAppointmentById } from '../controllers/appointment.controller'
import { uploadAllAppointmentFiles } from '../../utils/multer.config'

const appointment = Router()

appointment.get('/:id', findAppointmentById)
appointment.post('/', uploadAllAppointmentFiles, createAppointment)

export default appointment
