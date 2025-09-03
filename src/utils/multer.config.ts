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

export const deleteFile = async (
  fileUrl: string | null | undefined
): Promise<void> => {
  if (!fileUrl) {
    return
  }

  try {
    const filePath = path.join(process.cwd(), `public${fileUrl}`)

    await fs.promises.unlink(filePath)
    console.log(`Successfully deleted file: ${filePath}`)
  } catch (error) {
    if (typeof error === 'object' && error !== null && 'code' in error) {
      const nodeError = error as { code: string }

      if (nodeError.code === 'ENOENT') {
        console.warn(`File not found, could not delete: ${fileUrl}`)
      } else {
        console.error(`Error deleting file ${fileUrl}:`, error)
      }
    } else {
      console.error(
        `An unexpected error occurred while deleting ${fileUrl}:`,
        error
      )
    }
  }
}

const deleteMultipleFiles = async (
  fileUrls: (string | null | undefined)[] | null | undefined
): Promise<void> => {
  if (!fileUrls || fileUrls.length === 0) {
    return
  }

  const validUrls = fileUrls.filter((url): url is string => !!url)

  const deletionPromises = validUrls.map(url => deleteFile(url))

  const results = await Promise.allSettled(deletionPromises)

  results.forEach((result, index) => {
    if (result.status === 'rejected') {
      console.error(
        `Failed to delete file (from multi-delete): ${validUrls[index]}`,
        result.reason
      )
    }
  })
}

export {
  uploadAppointmentDoc,
  uploadTestListDocs,
  uploadBloodTubes,
  uploadSlipDoc,
  uploadAllAppointmentFiles,
  getFileUrl,
  deleteMultipleFiles
}
