import responseMessage from "../../constant/responseMessage.js";
import httpError from "../../util/httpError.js";
import httpResponse from "../../util/httpResponse.js";
import contactModel from "../../models/contact.model.js";
import newsletterModel from "../../models/newsletter.model.js";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";

dayjs.extend(utc);

export default {
    self: (req, res, next) => {
        try {
            httpResponse(req, res, 200, responseMessage.SERVICE('Contact'));
        } catch (err) {
            httpError(next, err, req, 500);
        }
    },

    createContact: async (req, res, next) => {
        try {
            const { firstName, lastName, email, phone, interest, message, subscribeNewsletter } = req.body;

            const userId = req.authenticatedUser?._id || null;

            const contactData = {
                firstName,
                lastName,
                email,
                phone,
                interest,
                message,
                subscribeNewsletter: subscribeNewsletter || false,
                userId
            };

            const contact = new contactModel(contactData);
            await contact.save();

            if (subscribeNewsletter) {
                try {
                    const existingSubscription = await newsletterModel.findOne({ email });
                    if (!existingSubscription) {
                        const newsletterData = {
                            email,
                            firstName,
                            lastName,
                            isActive: true
                        };
                        const newsletter = new newsletterModel(newsletterData);
                        await newsletter.save();
                    }
                } catch (newsletterError) {
                    console.error('Newsletter subscription error:', newsletterError);
                }
            }

            httpResponse(req, res, 201, responseMessage.CREATED, {
                contact: {
                    id: contact._id,
                    firstName: contact.firstName,
                    lastName: contact.lastName,
                    email: contact.email,
                    status: contact.status,
                    createdAt: contact.createdAt
                }
            });
        } catch (err) {
            httpError(next, err, req, 500);
        }
    },

    getAllContacts: async (req, res, next) => {
        try {
            if (req.authenticatedUser?.role !== 'admin') {
                return httpError(next, responseMessage.AUTH.FORBIDDEN, req, 403);
            }

            const { page = 1, limit = 10, status, interest, isActive, search } = req.query;
            const skip = (page - 1) * limit;

            const filter = {};
            if (status) filter.status = status;
            if (interest) filter.interest = interest;
            if (isActive !== undefined) filter.isActive = isActive;

            if (search) {
                filter.$or = [
                    { firstName: { $regex: search, $options: 'i' } },
                    { lastName: { $regex: search, $options: 'i' } },
                    { email: { $regex: search, $options: 'i' } },
                    { message: { $regex: search, $options: 'i' } }
                ];
            }

            const contacts = await contactModel.find(filter)
                .populate('userId', 'email role')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(parseInt(limit));

            const total = await contactModel.countDocuments(filter);

            httpResponse(req, res, 200, responseMessage.SUCCESS, {
                contacts,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total,
                    pages: Math.ceil(total / limit)
                }
            });
        } catch (err) {
            httpError(next, err, req, 500);
        }
    },

    getContactById: async (req, res, next) => {
        try {
            if (req.authenticatedUser?.role !== 'admin') {
                return httpError(next, responseMessage.AUTH.FORBIDDEN, req, 403);
            }

            const { id } = req.params;

            const contact = await contactModel.findById(id)
                .populate('userId', 'email role lastLogin');

            if (!contact) {
                return httpError(next, responseMessage.ERROR.NOT_FOUND('Contact'), req, 404);
            }

            if (contact.status === 'new') {
                contact.status = 'read';
                await contact.save();
            }

            httpResponse(req, res, 200, responseMessage.SUCCESS, contact);
        } catch (err) {
            httpError(next, err, req, 500);
        }
    },

    updateContact: async (req, res, next) => {
        try {
            if (req.authenticatedUser?.role !== 'admin') {
                return httpError(next, responseMessage.AUTH.FORBIDDEN, req, 403);
            }

            const { id } = req.params;
            const updateData = req.body;

            const contact = await contactModel.findByIdAndUpdate(
                id,
                updateData,
                { new: true }
            ).populate('userId', 'email role');

            if (!contact) {
                return httpError(next, responseMessage.ERROR.NOT_FOUND('Contact'), req, 404);
            }

            httpResponse(req, res, 200, responseMessage.UPDATED, contact);
        } catch (err) {
            httpError(next, err, req, 500);
        }
    },

    deleteContact: async (req, res, next) => {
        try {
            if (req.authenticatedUser?.role !== 'admin') {
                return httpError(next, responseMessage.AUTH.FORBIDDEN, req, 403);
            }

            const { id } = req.params;
            const contact = await contactModel.findByIdAndDelete(id);

            if (!contact) {
                return httpError(next, responseMessage.ERROR.NOT_FOUND('Contact'), req, 404);
            }

            httpResponse(req, res, 200, responseMessage.DELETED, {
                message: 'Contact deleted successfully',
                deletedContact: {
                    id: contact._id,
                    fullName: contact.fullName,
                    email: contact.email
                }
            });
        } catch (err) {
            httpError(next, err, req, 500);
        }
    },

    getUserContacts: async (req, res, next) => {
        try {
            const userId = req.authenticatedUser?._id;
            if (!userId) {
                return httpError(next, responseMessage.AUTH.UNAUTHORIZED, req, 401);
            }

            const { page = 1, limit = 10 } = req.query;
            const skip = (page - 1) * limit;

            const contacts = await contactModel.find({ userId })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(parseInt(limit))
                .select('-adminNotes');

            const total = await contactModel.countDocuments({ userId });

            httpResponse(req, res, 200, responseMessage.SUCCESS, {
                contacts,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total,
                    pages: Math.ceil(total / limit)
                }
            });
        } catch (err) {
            httpError(next, err, req, 500);
        }
    },

    getContactStats: async (req, res, next) => {
        try {
            if (req.authenticatedUser?.role !== 'admin') {
                return httpError(next, responseMessage.AUTH.FORBIDDEN, req, 403);
            }

            const totalContacts = await contactModel.countDocuments({ isActive: true });
            const newContacts = await contactModel.countDocuments({ status: 'new', isActive: true });
            const readContacts = await contactModel.countDocuments({ status: 'read', isActive: true });
            const repliedContacts = await contactModel.countDocuments({ status: 'replied', isActive: true });
            const closedContacts = await contactModel.countDocuments({ status: 'closed', isActive: true });

            const interestStats = await contactModel.aggregate([
                { $match: { isActive: true } },
                { $group: { _id: '$interest', count: { $sum: 1 } } },
                { $sort: { count: -1 } }
            ]);

            const thirtyDaysAgo = dayjs().subtract(30, 'day').toDate();
            const recentContacts = await contactModel.countDocuments({
                createdAt: { $gte: thirtyDaysAgo },
                isActive: true
            });

            httpResponse(req, res, 200, responseMessage.SUCCESS, {
                totalContacts,
                statusBreakdown: {
                    new: newContacts,
                    read: readContacts,
                    replied: repliedContacts,
                    closed: closedContacts
                },
                interestBreakdown: interestStats,
                recentContacts
            });
        } catch (err) {
            httpError(next, err, req, 500);
        }
    }
};