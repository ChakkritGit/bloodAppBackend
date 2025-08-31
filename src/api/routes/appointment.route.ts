import { Router } from 'express'
import { createAppointment, findAppointmentById, getAllAppointment, searchAppointmentById } from '../controllers/appointment.controller'
import { uploadAllAppointmentFiles } from '../../utils/multer.config'

const appointment = Router()

appointment.get('/list', getAllAppointment)
appointment.get('/check/:id', findAppointmentById)
appointment.get('/search/:id', searchAppointmentById)
appointment.post('/', uploadAllAppointmentFiles, createAppointment)

export default appointment
