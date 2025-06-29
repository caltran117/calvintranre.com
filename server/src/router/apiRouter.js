import { Router } from 'express'
import healthController from '../controller/Health/health.controller.js'
import locationStatController from '../controller/LocationStat/location.stat.controller.js'
import { validateRequest } from '../middleware/validateRequest.js';
import { locationStatSchema } from '../schema/location.stat.schema.js';
import { 
    propertySchema, 
    updatePropertySchema, 
    getPropertiesQuerySchema, 
    searchPropertiesQuerySchema,
    similarPropertiesQuerySchema
} from '../schema/property.schema.js';
import authController from '../controller/Authentication/auth.controller.js';
import newsletterController from '../controller/Newsletter/newsletter.controller.js'
import { 
    signInSchema, 
    updateUserSchema, 
    adminUpdateUserSchema, 
    addFavoritePropertySchema, 
    removeFavoritePropertySchema,
    getUsersQuerySchema 
} from '../schema/auth.schema.js';
import { 
    subscribeNewsletterSchema,
    unsubscribeNewsletterSchema,
    updateNewsletterSchema,
    adminUpdateNewsletterSchema,
    getNewsletterSubscribersSchema,
    sendBulkEmailSchema
} from '../schema/newsletters.schema.js';
import authentication from '../middleware/authentication.js';
import authorization from '../middleware/authorization.js'
import { EUserRole } from '../constant/application.js';
import propertyController from '../controller/Property/property.controller.js';

const router = Router()

// Health check routes
router.route('/self').get(healthController.self)
router.route('/health').get(healthController.health)

// Auth routes
router.route('/auth/self').get(authController.self)
router.route('/auth/signin').post(validateRequest(signInSchema), authController.signIn)
router.route('/auth/profile').get(authentication, authController.getProfile)
router.route('/auth/profile').put(authentication, validateRequest(updateUserSchema), authController.updateProfile)

// Admin routes
router.route('/auth/admin/users').get(authentication,authorization([EUserRole.ADMIN]), validateRequest(getUsersQuerySchema, 'query'), authController.getAllUsers)
router.route('/auth/admin/users/:id').get(authentication,authorization([EUserRole.ADMIN]), authController.getUserById)
router.route('/auth/admin/users/:id').put(authentication,authorization([EUserRole.ADMIN]), validateRequest(adminUpdateUserSchema), authController.adminUpdateUser)
router.route('/auth/admin/users/:id').delete(authentication,authorization([EUserRole.ADMIN]), authController.deleteUser)

// Location Stat routes
router.route('/location-stat/self').get(locationStatController.self)
router.route('/location-stat').get(locationStatController.getStats)
router.route('/location-stat').post(validateRequest(locationStatSchema), locationStatController.addStat)
router.route('/location-stat/:id').get(locationStatController.getStatById)
router.route('/location-stat/:id').put(validateRequest(locationStatSchema), locationStatController.updateStat)
router.route('/location-stat/:id').delete(locationStatController.deleteStat)

// Property routes - Public
router.route('/property/self').get(propertyController.self)
router.route('/property').get(validateRequest(getPropertiesQuerySchema, 'query'), propertyController.getProperties)
router.route('/property/search').get(validateRequest(searchPropertiesQuerySchema, 'query'), propertyController.searchProperties)
router.route('/property/featured').get(propertyController.getFeaturedProperties)
router.route('/property/:id').get(propertyController.getPropertyById)
router.route('/property/:id/similar').get(validateRequest(similarPropertiesQuerySchema, 'query'), propertyController.getSimilarProperties)

// Property routes - Admin only
router.route('/property/admin/add').post(authentication, authorization([EUserRole.ADMIN]), validateRequest(propertySchema), propertyController.addProperty)
router.route('/property/admin/:id').put(authentication, authorization([EUserRole.ADMIN]), validateRequest(updatePropertySchema), propertyController.updateProperty)
router.route('/property/admin/:id').delete(authentication, authorization([EUserRole.ADMIN]), propertyController.deleteProperty)

// Newsletter routes
router.route('/newsletter/self').get(newsletterController.self)
router.route('/newsletter/subscribe').post(validateRequest(subscribeNewsletterSchema), newsletterController.subscribe)
router.route('/newsletter/unsubscribe').post(validateRequest(unsubscribeNewsletterSchema), newsletterController.unsubscribe)
router.route('/newsletter/status/:email').get(newsletterController.getSubscriptionStatus)
router.route('/newsletter/preferences/:email').put(validateRequest(updateNewsletterSchema), newsletterController.updatePreferences)

// Admin newsletter routes
router.route('/newsletter/admin/subscribers').get(authentication, authorization([EUserRole.ADMIN]), validateRequest(getNewsletterSubscribersSchema, 'query'), newsletterController.getAllSubscribers)
router.route('/newsletter/admin/subscribers/:id').get(authentication, authorization([EUserRole.ADMIN]), newsletterController.getSubscriberById)
router.route('/newsletter/admin/subscribers/:id').put(authentication, authorization([EUserRole.ADMIN]), validateRequest(adminUpdateNewsletterSchema), newsletterController.adminUpdateSubscriber)
router.route('/newsletter/admin/subscribers/:id').delete(authentication, authorization([EUserRole.ADMIN]), newsletterController.deleteSubscriber)
router.route('/newsletter/admin/send-bulk').post(authentication, authorization([EUserRole.ADMIN]), validateRequest(sendBulkEmailSchema), newsletterController.sendBulkEmail)
router.route('/newsletter/admin/stats').get(authentication, authorization([EUserRole.ADMIN]), newsletterController.getStats)

export default router