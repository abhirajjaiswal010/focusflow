import { Router } from 'express'
import multer from 'multer'
import { summarize } from '../controllers/pdfController.js'

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 15 * 1024 * 1024 } })
const router = Router()

router.post('/summarize', upload.single('pdf'), summarize)

export default router
