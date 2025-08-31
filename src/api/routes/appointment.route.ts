import { Router } from 'express'
import { createAppointment, findAppointmentById, searchAppointmentById } from '../controllers/appointment.controller'
import { uploadAllAppointmentFiles } from '../../utils/multer.config'

const appointment = Router()

appointment.get('/:id', findAppointmentById)
appointment.get('/search/:id', searchAppointmentById)
appointment.post('/', uploadAllAppointmentFiles, createAppointment)

export default appointment
