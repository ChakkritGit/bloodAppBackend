import { Router } from 'express'
import { createAppointment, findAppointmentById, getAllAppointment, getAppointmentQueueToday, searchAppointmentById, updateStatusAppointment } from '../controllers/appointment.controller'
import { uploadAllAppointmentFiles } from '../../utils/multer.config'

const appointment = Router()

appointment.get('/list', getAllAppointment)
appointment.get('/check/:id', findAppointmentById)
appointment.get('/search/:id', searchAppointmentById)
appointment.get('/queue', getAppointmentQueueToday)
appointment.post('/', uploadAllAppointmentFiles, createAppointment)
appointment.patch('/status/:id', updateStatusAppointment)
appointment.patch('/confirm/:id', updateStatusAppointment)

export default appointment
