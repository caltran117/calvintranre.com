import responseMessage from "../../constant/responseMessage.js";
import httpError from "../../util/httpError.js";
import httpResponse from "../../util/httpResponse.js";
import quicker from "../../util/quicker.js";
import userModel from "../../models/user.model.js";
import propertyModel from "../../models/property.model.js";
import config from "../../config/config.js";
import { EApplicationEnvironment } from "../../constant/application.js";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";

dayjs.extend(utc);

export default {
    self: (req, res, next) => {
        try {
            httpResponse(req, res, 200, responseMessage.SERVICE('Authentication'));
        } catch (err) {
            httpError(next, err, req, 500);
        }
    },

    signIn: async (req, res, next) => {
        try {
            const { email, role, password } = req.body;

            if (role === 'admin') {
                if (email !== config.admin.username || password !== config.admin.password) {
                    return httpError(next, responseMessage.AUTH.LOGIN_FAILED, req, 401);
                }
            } else if (password) {
                return httpError(next, responseMessage.ERROR.BAD_REQUEST, req, 400);
            }

            let user = await userModel.findOne({ email });

            if (!user) {
                const userData = {
                    email,
                    lastLogin: dayjs().utc().toDate()
                };

                if (role === 'admin') {
                    userData.role = 'admin';
                }

                user = new userModel(userData);
                await user.save();

                const accessToken = quicker.generateToken(
                    {
                        userId: user._id
                    },
                    config.auth.jwtSecret,
                    config.auth.jwtExpiresIn
                );

                const DOMAIN = quicker.getDomainFromUrl(config.server.url);
                res.cookie('accessToken', accessToken, {
                    path: EApplicationEnvironment.DEVELOPMENT ? '/v1' : '/api/v1',
                    domain: DOMAIN,
                    sameSite: 'strict',
                    maxAge: parseInt(process.env.JWT_EXPIRES_IN || '3600', 10) * 1000,
                    httpOnly: true,
                    secure: !(config.env === EApplicationEnvironment.DEVELOPMENT)
                });

                httpResponse(req, res, 201, responseMessage.CREATED, {
                    user,
                    accessToken
                });
            } else {
                if (!user.isActive) {
                    return httpError(next, responseMessage.COMMON.ACTION_NOT_ALLOWED, req, 403);
                }

                if (role === 'admin' && user.role === 'admin') {
                    if (email !== config.admin.username || password !== config.admin.password) {
                        return httpError(next, responseMessage.AUTH.LOGIN_FAILED, req, 401);
                    }
                } else if (role === 'admin' && user.role !== 'admin') {
                    return httpError(next, responseMessage.AUTH.UNAUTHORIZED, req, 403);
                }

                user.lastLogin = dayjs().utc().toDate();
                await user.save();

                const accessToken = quicker.generateToken(
                    {
                        userId: user._id
                    },
                    config.auth.jwtSecret,
                    config.auth.jwtExpiresIn
                );

                const DOMAIN = quicker.getDomainFromUrl(config.server.url);
                res.cookie('accessToken', accessToken, {
                    path: EApplicationEnvironment.DEVELOPMENT ? '/v1' : '/api/v1',
                    domain: DOMAIN,
                    sameSite: 'strict',
                    maxAge: parseInt(process.env.JWT_EXPIRES_IN || '3600', 10) * 1000,
                    httpOnly: true,
                    secure: !(config.env === EApplicationEnvironment.DEVELOPMENT)
                });

                httpResponse(req, res, 200, responseMessage.AUTH.LOGIN_SUCCESS, {
                    user,
                    accessToken
                });
            }
        } catch (err) {
            httpError(next, err, req, 500);
        }
    },

    getProfile: async (req, res, next) => {
        try {
            const userId = req.authenticatedUser?._id;
            if (!userId) {
                return httpError(next, responseMessage.AUTH.UNAUTHORIZED, req, 401);
            }

            const user = await userModel.findById(userId);
            if (!user) {
                return httpError(next, responseMessage.ERROR.NOT_FOUND('User'), req, 404);
            }

            httpResponse(req, res, 200, responseMessage.SUCCESS, user);
        } catch (err) {
            httpError(next, err, req, 500);
        }
    },

    updateProfile: async (req, res, next) => {
        try {
            const userId = req.authenticatedUser?._id;
            if (!userId) {
                return httpError(next, responseMessage.AUTH.UNAUTHORIZED, req, 401);
            }

            const updateData = req.body;
            
            if (updateData.role && req.authenticatedUser.role !== 'admin') {
                return httpError(next, responseMessage.AUTH.FORBIDDEN, req, 403);
            }

            const user = await userModel.findByIdAndUpdate(userId, updateData, { new: true });
            if (!user) {
                return httpError(next, responseMessage.ERROR.NOT_FOUND('User'), req, 404);
            }

            httpResponse(req, res, 200, responseMessage.UPDATED, user);
        } catch (err) {
            httpError(next, err, req, 500);
        }
    },

    getAllUsers: async (req, res, next) => {
        try {
            if (req.authenticatedUser?.role !== 'admin') {
                return httpError(next, responseMessage.AUTH.FORBIDDEN, req, 403);
            }

            const { page = 1, limit = 10, role, isActive } = req.query;
            const skip = (page - 1) * limit;

            const filter = {};
            if (role) filter.role = role;
            if (isActive !== undefined) filter.isActive = isActive;

            // TODO: Uncomment the populate line if favProperty is needed
            const users = await userModel.find(filter)
                .skip(skip)
                .limit(parseInt(limit))
                // .populate('favProperty');

            const total = await userModel.countDocuments(filter);

            httpResponse(req, res, 200, responseMessage.SUCCESS, {
                users,
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

    getUserById: async (req, res, next) => {
        try {
            if (req.authenticatedUser?.role !== 'admin') {
                return httpError(next, responseMessage.AUTH.FORBIDDEN, req, 403);
            }

            const { id } = req.params;
            
            // TODO: Add .populate('favProperty')
            const user = await userModel.findById(id)

            if (!user) {
                return httpError(next, responseMessage.ERROR.NOT_FOUND('User'), req, 404);
            }

            httpResponse(req, res, 200, responseMessage.SUCCESS, user);
        } catch (err) {
            httpError(next, err, req, 500);
        }
    },

    adminUpdateUser: async (req, res, next) => {
        try {
            if (req.authenticatedUser?.role !== 'admin') {
                return httpError(next, responseMessage.AUTH.FORBIDDEN, req, 403);
            }

            const { id } = req.params;
            const updateData = req.body;

            const user = await userModel.findByIdAndUpdate(id, updateData, { new: true });

            if (!user) {
                return httpError(next, responseMessage.ERROR.NOT_FOUND('User'), req, 404);
            }

            httpResponse(req, res, 200, responseMessage.UPDATED, user);
        } catch (err) {
            httpError(next, err, req, 500);
        }
    },

    deleteUser: async (req, res, next) => {
        try {
            if (req.authenticatedUser?.role !== 'admin') {
                return httpError(next, responseMessage.AUTH.FORBIDDEN, req, 403);
            }

            const { id } = req.params;
            const user = await userModel.findByIdAndDelete(id);

            if (!user) {
                return httpError(next, responseMessage.ERROR.NOT_FOUND('User'), req, 404);
            }

            httpResponse(req, res, 200, responseMessage.DELETED, user);
        } catch (err) {
            httpError(next, err, req, 500);
        }
    },

    addFavorite: async (req, res, next) => {
        try {
            const userId = req.authenticatedUser?._id;
            if (!userId) {
                return httpError(next, responseMessage.AUTH.UNAUTHORIZED, req, 401);
            }

            const { propertyId, propertyType, propertyData } = req.body;

            // Validate database property exists if it's a database property
            if (propertyType === 'database') {
                const property = await propertyModel.findById(propertyId);
                if (!property) {
                    return httpError(next, responseMessage.ERROR.NOT_FOUND('Property'), req, 404);
                }
            }

            const user = await userModel.findById(userId);
            if (!user) {
                return httpError(next, responseMessage.ERROR.NOT_FOUND('User'), req, 404);
            }

            // Check if property is already in favorites
            const existingFavorite = user.favorites.find(
                fav => fav.propertyId === propertyId && fav.propertyType === propertyType
            );

            if (existingFavorite) {
                return httpError(next, responseMessage.ERROR.ALREADY_EXISTS('Favorite'), req, 409);
            }

            // Add to favorites
            user.favorites.push({
                propertyId,
                propertyType,
                propertyData
            });

            await user.save();

            httpResponse(req, res, 201, responseMessage.CREATED, {
                message: 'Property added to favorites successfully',
                favorite: user.favorites[user.favorites.length - 1]
            });
        } catch (err) {
            httpError(next, err, req, 500);
        }
    },

    removeFavorite: async (req, res, next) => {
        try {
            const userId = req.authenticatedUser?._id;
            if (!userId) {
                return httpError(next, responseMessage.AUTH.UNAUTHORIZED, req, 401);
            }

            const { propertyId, propertyType } = req.body;

            const user = await userModel.findById(userId);
            if (!user) {
                return httpError(next, responseMessage.ERROR.NOT_FOUND('User'), req, 404);
            }

            // Find and remove the favorite
            const favoriteIndex = user.favorites.findIndex(
                fav => fav.propertyId === propertyId && fav.propertyType === propertyType
            );

            if (favoriteIndex === -1) {
                return httpError(next, responseMessage.ERROR.NOT_FOUND('Favorite'), req, 404);
            }

            user.favorites.splice(favoriteIndex, 1);
            await user.save();

            httpResponse(req, res, 200, responseMessage.DELETED, {
                message: 'Property removed from favorites successfully'
            });
        } catch (err) {
            httpError(next, err, req, 500);
        }
    },

    getFavorites: async (req, res, next) => {
        try {
            const userId = req.authenticatedUser?._id;
            if (!userId) {
                return httpError(next, responseMessage.AUTH.UNAUTHORIZED, req, 401);
            }

            const user = await userModel.findById(userId);
            if (!user) {
                return httpError(next, responseMessage.ERROR.NOT_FOUND('User'), req, 404);
            }

            httpResponse(req, res, 200, responseMessage.SUCCESS, {
                favorites: user.favorites
            });
        } catch (err) {
            httpError(next, err, req, 500);
        }
    }
}