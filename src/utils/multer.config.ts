import multer, { FileFilterCallback } from 'multer'
import path from 'path'
import fs from 'fs'
import { Request } from 'express'
import { v4 as uuidv4 } from 'uuid'

type DestinationCallback = (error: Error | null, destination: string) => void
type FileNameCallback = (error: Error | null, filename: string) => void

const fieldToSubfolderMap: { [key: string]: string } = {
  appointmentDoc: 'appointments',
  testListDocs: 'test-lists',
  bloodTubes: 'blood-tubes',
  slipDoc: 'slips'
}

const createFolderIfNotExists = (folderPath: string): void => {
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true })
  }
}

const imageFileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
): void => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true)
  } else {
    cb(new Error('กรุณาอัปโหลดไฟล์รูปภาพเท่านั้น!') as any, false)
  }
}

const dynamicDiskStorage = multer.diskStorage({
  destination: (
    req: Request,
    file: Express.Multer.File,
    cb: DestinationCallback
  ): void => {
    const subfolder = fieldToSubfolderMap[file.fieldname] || 'others'

    const uploadPath = path.join('public/images', subfolder)

    createFolderIfNotExists(uploadPath)

    cb(null, uploadPath)
  },
  filename: (
    req: Request,
    file: Express.Multer.File,
    cb: FileNameCallback
  ): void => {
    const fileExtension = path.extname(file.originalname)
    const uniqueFileName = uuidv4()
    const newFileName = file.fieldname + '-' + uniqueFileName + fileExtension
    cb(null, newFileName)
  }
})

const uploadAppointmentDoc = multer({
  storage: dynamicDiskStorage,
  fileFilter: imageFileFilter,
  limits: { fileSize: 1024 * 1024 * 5 }
}).single('appointmentDoc')

const uploadTestListDocs = multer({
  storage: dynamicDiskStorage,
  fileFilter: imageFileFilter,
  limits: { fileSize: 1024 * 1024 * 5 }
}).array('testListDocs', 10)

const uploadBloodTubes = multer({
  storage: dynamicDiskStorage,
  fileFilter: imageFileFilter,
  limits: { fileSize: 1024 * 1024 * 5 }
}).array('bloodTubes', 10)

const uploadSlipDoc = multer({
  storage: dynamicDiskStorage,
  fileFilter: imageFileFilter,
  limits: { fileSize: 1024 * 1024 * 5 }
}).single('slipDoc')

const uploadAllAppointmentFiles = multer({
  storage: dynamicDiskStorage,
  fileFilter: imageFileFilter,
  limits: { fileSize: 1024 * 1024 * 5 }
}).fields([
  { name: 'appointmentDoc', maxCount: 1 },
  { name: 'testListDocs', maxCount: 10 },
  { name: 'bloodTubes', maxCount: 10 },
  { name: 'slipDoc', maxCount: 1 }
])

const getFileUrl = (
  file: Express.Multer.File | null | undefined
): string | null | undefined => {
  if (!file || !file.path) {
    return null
  }
  const relativePath: string = file.path
    .replace(/\\/g, '/')
    .replace('public', '')

  return relativePath
}

export {
  uploadAppointmentDoc,
  uploadTestListDocs,
  uploadBloodTubes,
  uploadSlipDoc,
  uploadAllAppointmentFiles,
  getFileUrl
}
