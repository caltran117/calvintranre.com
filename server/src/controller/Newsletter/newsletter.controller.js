import responseMessage from "../../constant/responseMessage.js";
import httpError from "../../util/httpError.js";
import httpResponse from "../../util/httpResponse.js";
import quicker from "../../util/quicker.js";
import newsletterModel from "../../models/newsletter.model.js";
import config from "../../config/config.js";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";

dayjs.extend(utc);

export default {
    self: (req, res, next) => {
        try {
            httpResponse(req, res, 200, responseMessage.SERVICE('Newsletter'));
        } catch (err) {
            httpError(next, err, req, 500);
        }
    },

    subscribe: async (req, res, next) => {
        try {
            const { email, consent } = req.body;

            const existingSubscriber = await newsletterModel.findOne({ email });

            if (existingSubscriber) {
                if (existingSubscriber.isSubscribed) {
                    return httpError(next, responseMessage.ERROR.ALREADY_EXISTS('Subscriber'), req, 409);
                }
                
                // Resubscribe existing user
                existingSubscriber.isSubscribed = true;
                existingSubscriber.consent = consent;
                existingSubscriber.subscribedAt = dayjs().utc().toDate();
                existingSubscriber.unsubscribedAt = null;
                await existingSubscriber.save();

                httpResponse(req, res, 200, responseMessage.UPDATED, existingSubscriber);
            } else {
                // Create new subscriber
                const newSubscriber = new newsletterModel({
                    email,
                    consent,
                    subscribedAt: dayjs().utc().toDate()
                });
                await newSubscriber.save();

                httpResponse(req, res, 201, responseMessage.CREATED, newSubscriber);
            }
        } catch (err) {
            httpError(next, err, req, 500);
        }
    },

    unsubscribe: async (req, res, next) => {
        try {
            const { email } = req.body;

            const subscriber = await newsletterModel.findOne({ email });

            if (!subscriber) {
                return httpError(next, responseMessage.ERROR.NOT_FOUND('Subscriber'), req, 404);
            }

            if (!subscriber.isSubscribed) {
                return httpError(next, responseMessage.customMessage('Already unsubscribed'), req, 400);
            }

            subscriber.isSubscribed = false;
            subscriber.unsubscribedAt = dayjs().utc().toDate();
            await subscriber.save();

            httpResponse(req, res, 200, responseMessage.UPDATED, subscriber);
        } catch (err) {
            httpError(next, err, req, 500);
        }
    },

    getSubscriptionStatus: async (req, res, next) => {
        try {
            const { email } = req.params;

            const subscriber = await newsletterModel.findOne({ email });

            if (!subscriber) {
                return httpError(next, responseMessage.ERROR.NOT_FOUND('Subscriber'), req, 404);
            }

            httpResponse(req, res, 200, responseMessage.SUCCESS, subscriber);
        } catch (err) {
            httpError(next, err, req, 500);
        }
    },

    updatePreferences: async (req, res, next) => {
        try {
            const { email } = req.params;
            const updateData = req.body;

            const subscriber = await newsletterModel.findOne({ email });

            if (!subscriber) {
                return httpError(next, responseMessage.ERROR.NOT_FOUND('Subscriber'), req, 404);
            }

            // Update fields
            Object.keys(updateData).forEach(key => {
                subscriber[key] = updateData[key];
            });

            await subscriber.save();

            httpResponse(req, res, 200, responseMessage.UPDATED, subscriber);
        } catch (err) {
            httpError(next, err, req, 500);
        }
    },

    getAllSubscribers: async (req, res, next) => {
        try {
            if (req.authenticatedUser?.role !== 'admin') {
                return httpError(next, responseMessage.AUTH.FORBIDDEN, req, 403);
            }

            const { page = 1, limit = 10, isSubscribed, consent, sortBy = 'subscribedAt', sortOrder = 'desc' } = req.query;
            const skip = (page - 1) * limit;

            const filter = {};
            if (isSubscribed !== undefined) filter.isSubscribed = isSubscribed;
            if (consent !== undefined) filter.consent = consent;

            const sortOptions = {};
            sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

            const subscribers = await newsletterModel.find(filter)
                .sort(sortOptions)
                .skip(skip)
                .limit(parseInt(limit));

            const total = await newsletterModel.countDocuments(filter);

            // Get statistics
            const stats = await newsletterModel.aggregate([
                {
                    $group: {
                        _id: null,
                        totalSubscribers: { $sum: 1 },
                        activeSubscribers: {
                            $sum: { $cond: ['$isSubscribed', 1, 0] }
                        },
                        consentedSubscribers: {
                            $sum: { $cond: ['$consent', 1, 0] }
                        },
                        totalEmailsSent: { $sum: '$numberOfEmails' }
                    }
                }
            ]);

            httpResponse(req, res, 200, responseMessage.SUCCESS, {
                subscribers,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total,
                    pages: Math.ceil(total / limit)
                },
                statistics: stats[0] || {
                    totalSubscribers: 0,
                    activeSubscribers: 0,
                    consentedSubscribers: 0,
                    totalEmailsSent: 0
                }
            });
        } catch (err) {
            httpError(next, err, req, 500);
        }
    },

    getSubscriberById: async (req, res, next) => {
        try {
            if (req.authenticatedUser?.role !== 'admin') {
                return httpError(next, responseMessage.AUTH.FORBIDDEN, req, 403);
            }

            const { id } = req.params;
            const subscriber = await newsletterModel.findById(id);

            if (!subscriber) {
                return httpError(next, responseMessage.ERROR.NOT_FOUND('Subscriber'), req, 404);
            }

            httpResponse(req, res, 200, responseMessage.SUCCESS, subscriber);
        } catch (err) {
            httpError(next, err, req, 500);
        }
    },

    adminUpdateSubscriber: async (req, res, next) => {
        try {
            if (req.authenticatedUser?.role !== 'admin') {
                return httpError(next, responseMessage.AUTH.FORBIDDEN, req, 403);
            }

            const { id } = req.params;
            const updateData = req.body;

            const subscriber = await newsletterModel.findByIdAndUpdate(id, updateData, { new: true });

            if (!subscriber) {
                return httpError(next, responseMessage.ERROR.NOT_FOUND('Subscriber'), req, 404);
            }

            httpResponse(req, res, 200, responseMessage.UPDATED, subscriber);
        } catch (err) {
            httpError(next, err, req, 500);
        }
    },

    deleteSubscriber: async (req, res, next) => {
        try {
            if (req.authenticatedUser?.role !== 'admin') {
                return httpError(next, responseMessage.AUTH.FORBIDDEN, req, 403);
            }

            const { id } = req.params;
            const subscriber = await newsletterModel.findByIdAndDelete(id);

            if (!subscriber) {
                return httpError(next, responseMessage.ERROR.NOT_FOUND('Subscriber'), req, 404);
            }

            httpResponse(req, res, 200, responseMessage.DELETED, subscriber);
        } catch (err) {
            httpError(next, err, req, 500);
        }
    },

    sendBulkEmail: async (req, res, next) => {
        try {
            if (req.authenticatedUser?.role !== 'admin') {
                return httpError(next, responseMessage.AUTH.FORBIDDEN, req, 403);
            }

            const { subject, content, onlySubscribed = true, onlyConsented = true } = req.body;

            const filter = {};
            if (onlySubscribed) filter.isSubscribed = true;
            if (onlyConsented) filter.consent = true;

            const subscribers = await newsletterModel.find(filter);

            if (subscribers.length === 0) {
                return httpError(next, responseMessage.ERROR.NOT_FOUND('Active subscribers'), req, 404);
            }

            // Here you would integrate with your email service
            // For now, we'll just simulate sending and update the count
            const emailPromises = subscribers.map(async (subscriber) => {
                try {
                    // Simulate email sending
                    // await emailService.send(subscriber.email, subject, content);
                    
                    // Update email count and last sent date
                    subscriber.numberOfEmails += 1;
                    subscriber.lastEmailSent = dayjs().utc().toDate();
                    await subscriber.save();
                    
                    return { email: subscriber.email, status: 'sent' };
                } catch (error) {
                    return { email: subscriber.email, status: 'failed', error: error.message };
                }
            });

            const results = await Promise.all(emailPromises);
            const sentCount = results.filter(r => r.status === 'sent').length;
            const failedCount = results.filter(r => r.status === 'failed').length;

            httpResponse(req, res, 200, responseMessage.OPERATION_SUCCESS('Bulk email'), {
                totalRecipients: subscribers.length,
                sentCount,
                failedCount,
                results
            });
        } catch (err) {
            httpError(next, err, req, 500);
        }
    },

    getStats: async (req, res, next) => {
        try {
            if (req.authenticatedUser?.role !== 'admin') {
                return httpError(next, responseMessage.AUTH.FORBIDDEN, req, 403);
            }

            const stats = await newsletterModel.aggregate([
                {
                    $group: {
                        _id: null,
                        totalSubscribers: { $sum: 1 },
                        activeSubscribers: {
                            $sum: { $cond: ['$isSubscribed', 1, 0] }
                        },
                        consentedSubscribers: {
                            $sum: { $cond: ['$consent', 1, 0] }
                        },
                        totalEmailsSent: { $sum: '$numberOfEmails' },
                        avgEmailsPerSubscriber: { $avg: '$numberOfEmails' }
                    }
                }
            ]);

            // Get recent subscription trends
            const thirtyDaysAgo = dayjs().subtract(30, 'days').toDate();
            const recentSubscriptions = await newsletterModel.countDocuments({
                subscribedAt: { $gte: thirtyDaysAgo }
            });

            const recentUnsubscriptions = await newsletterModel.countDocuments({
                unsubscribedAt: { $gte: thirtyDaysAgo }
            });

            httpResponse(req, res, 200, responseMessage.SUCCESS, {
                ...stats[0],
                trends: {
                    recentSubscriptions,
                    recentUnsubscriptions,
                    netGrowth: recentSubscriptions - recentUnsubscriptions
                }
            });
        } catch (err) {
            httpError(next, err, req, 500);
        }
    }
}