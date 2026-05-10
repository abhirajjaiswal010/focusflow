import { Router } from 'express'
import { generatePlan } from '../controllers/plannerController.js'
const router = Router()

router.post('/generate', generatePlan)

export default router
