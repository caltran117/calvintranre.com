import { Router } from 'express'
import healthController from '../controller/Health/health.controller.js'
import locationStatController from '../controller/LocationStat/location.stat.controller.js'
import { validateRequest } from '../middleware/validateRequest.js';
import { locationStatSchema } from '../schema/location.stat.schema.js';

const router = Router()

// Health check routes
router.route('/self').get(healthController.self)
router.route('/health').get(healthController.health)

// Location Stat routes
router.route('/location-stat/self').get(locationStatController.self)
router.route('/location-stat').get(locationStatController.getStats)
router.route('/location-stat').post(validateRequest(locationStatSchema), locationStatController.addStat)
router.route('/location-stat/:id').get(locationStatController.getStatById)
router.route('/location-stat/:id').put(validateRequest(locationStatSchema), locationStatController.updateStat)
router.route('/location-stat/:id').delete(locationStatController.deleteStat)

export default router