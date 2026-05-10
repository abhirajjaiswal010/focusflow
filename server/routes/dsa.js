import { Router } from 'express'
import { explain } from '../controllers/dsaController.js'
const router = Router()

router.post('/explain', explain)

export default router
