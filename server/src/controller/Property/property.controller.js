import responseMessage from "../../constant/responseMessage.js";
import propertyModel from "../../models/property.model.js";
import httpError from "../../util/httpError.js";
import httpResponse from "../../util/httpResponse.js";

export default {
  self: (req, res, next) => {
    try {
      httpResponse(req, res, 200, responseMessage.SERVICE("Property"));
    } catch (err) {
      httpError(next, err, req, 500);
    }
  },

  addProperty: async (req, res, next) => {
    try {
      const propertyData = req.body;

      const property = await propertyModel.create(propertyData);

      if (!property) {
        return httpError(next, responseMessage.COMMON.FAILED_TO_SAVE("property"), req, 400);
      }

      httpResponse(req, res, 201, responseMessage.CREATED, property);
    } catch (err) {
      httpError(next, err, req, 500);
    }
  },

  getProperties: async (req, res, next) => {
    try {
      const { 
        page = 1, 
        limit = 10, 
        status,
        propertyType,
        minPrice, 
        maxPrice,
        minRent,
        maxRent,
        beds, 
        baths,
        minSqft,
        maxSqft,
        featured,
        isActive,
        city,
        state,
        furnished,
        petAllowed,
        sortBy = 'createdAt',
        sortOrder = 'desc'
      } = req.query;

      const filter = {};
      
      if (status) filter.status = status;
      if (propertyType) filter['areaAndLot.propertyType'] = propertyType;
      if (beds) filter['basicInfo.beds'] = { $gte: parseInt(beds) };
      if (baths) filter['basicInfo.baths'] = { $gte: parseInt(baths) };
      if (featured !== undefined) filter['listing.featured'] = featured === 'true';
      if (isActive !== undefined) filter['listing.isActive'] = isActive === 'true';
      if (city) filter['location.address.city'] = { $regex: city, $options: 'i' };
      if (state) filter['location.address.state'] = { $regex: state, $options: 'i' };
      if (furnished) filter['rental.furnished'] = furnished;
      if (petAllowed !== undefined) filter['rental.petPolicy.allowed'] = petAllowed === 'true';

      if (minSqft || maxSqft) {
        filter['basicInfo.sqft'] = {};
        if (minSqft) filter['basicInfo.sqft'].$gte = parseInt(minSqft);
        if (maxSqft) filter['basicInfo.sqft'].$lte = parseInt(maxSqft);
      }

      if (status === 'For Sale' || status === 'Sold') {
        if (minPrice || maxPrice) {
          filter['pricing.salesPrice'] = {};
          if (minPrice) filter['pricing.salesPrice'].$gte = parseInt(minPrice);
          if (maxPrice) filter['pricing.salesPrice'].$lte = parseInt(maxPrice);
        }
      } else if (status === 'For Rent' || status === 'Rented') {
        if (minRent || maxRent) {
          filter['pricing.rentPrice.monthly'] = {};
          if (minRent) filter['pricing.rentPrice.monthly'].$gte = parseInt(minRent);
          if (maxRent) filter['pricing.rentPrice.monthly'].$lte = parseInt(maxRent);
        }
      }

      const sortOptions = {};
      sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

      const skip = (parseInt(page) - 1) * parseInt(limit);
      
      const properties = await propertyModel
        .find(filter)
        .sort(sortOptions)
        .skip(skip)
        .limit(parseInt(limit))
        .populate('listing.agent', 'name company phone email');

      const total = await propertyModel.countDocuments(filter);

      httpResponse(req, res, 200, responseMessage.SUCCESS, {
        properties,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(total / parseInt(limit))
        }
      });
    } catch (err) {
      httpError(next, err, req, 500);
    }
  },

  searchProperties: async (req, res, next) => {
  try {
    const { 
      query, 
      page = 1, 
      limit = 10, 
      status,
      propertyType,
      featured, 
      isActive,
      lat,
      lon,
      radius = 10
    } = req.query;

    const filter = {};
    const hasLocationSearch = lat && lon;
    
    // Text search filters
    if (query) {
      filter.$or = [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { 'location.address.street': { $regex: query, $options: 'i' } },
        { 'location.address.city': { $regex: query, $options: 'i' } },
        { 'location.address.state': { $regex: query, $options: 'i' } },
        { 'areaAndLot.schoolDistrict': { $regex: query, $options: 'i' } }
      ];
    }

    // Other filters
    if (status) filter.status = status;
    if (propertyType) filter['areaAndLot.propertyType'] = propertyType;
    if (featured !== undefined) filter['listing.featured'] = featured === 'true';
    if (isActive !== undefined) filter['listing.isActive'] = isActive === 'true';

    const skip = (parseInt(page) - 1) * parseInt(limit);
    let properties;
    let total;

    if (hasLocationSearch) {
      // APPROACH 1: Use aggregation pipeline for location-based search
      const pipeline = [
        {
          $geoNear: {
            near: {
              type: 'Point',
              coordinates: [parseFloat(lon), parseFloat(lat)]
            },
            distanceField: 'distance',
            maxDistance: parseInt(radius) * 1000,
            spherical: true
          }
        }
      ];

      // Add match stage for other filters
      if (Object.keys(filter).length > 0) {
        pipeline.push({ $match: filter });
      }

      // Add sorting (featured first, then by distance)
      pipeline.push({
        $sort: { 
          'listing.featured': -1,
          distance: 1
        }
      });

      // Add skip and limit
      pipeline.push({ $skip: skip });
      pipeline.push({ $limit: parseInt(limit) });

      properties = await propertyModel.aggregate(pipeline);

      // Get total count for pagination
      const countPipeline = [
        {
          $geoNear: {
            near: {
              type: 'Point',
              coordinates: [parseFloat(lon), parseFloat(lat)]
            },
            distanceField: 'distance',
            maxDistance: parseInt(radius) * 1000,
            spherical: true
          }
        }
      ];

      if (Object.keys(filter).length > 0) {
        countPipeline.push({ $match: filter });
      }

      countPipeline.push({ $count: 'total' });
      
      const totalResult = await propertyModel.aggregate(countPipeline);
      total = totalResult.length > 0 ? totalResult[0].total : 0;

    } else {
      // APPROACH 2: Regular find query without location (when no lat/lon provided)
      properties = await propertyModel
        .find(filter)
        .sort({ 'listing.featured': -1, createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));

      total = await propertyModel.countDocuments(filter);
    }

    httpResponse(req, res, 200, responseMessage.SUCCESS, {
      properties,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (err) {
    httpError(next, err, req, 500);
  }
},

  getPropertyById: async (req, res, next) => {
    try {
      const { id } = req.params;
      const property = await propertyModel.findById(id);

      if (!property) {
        return httpError(next, responseMessage.ERROR.NOT_FOUND('property'), req, 404);
      }

      httpResponse(req, res, 200, responseMessage.SUCCESS, property);
    } catch (err) {
      httpError(next, err, req, 500);
    }
  },

  updateProperty: async (req, res, next) => {
    try {
      const { id } = req.params;
      const updateData = { ...req.body };

      if (updateData.listing) {
        updateData['listing.updatedDate'] = new Date();
        
        Object.keys(updateData.listing).forEach(key => {
          if (key !== 'updatedDate') {
            updateData[`listing.${key}`] = updateData.listing[key];
          }
        });
        
        delete updateData.listing;
      } else {
        updateData['listing.updatedDate'] = new Date();
      }

      if (updateData.pricing) {
        Object.keys(updateData.pricing).forEach(key => {
          updateData[`pricing.${key}`] = updateData.pricing[key];
        });
        delete updateData.pricing;
      }

      if (updateData.basicInfo) {
        Object.keys(updateData.basicInfo).forEach(key => {
          updateData[`basicInfo.${key}`] = updateData.basicInfo[key];
        });
        delete updateData.basicInfo;
      }

      if (updateData.location) {
        Object.keys(updateData.location).forEach(key => {
          if (key === 'address') {
            Object.keys(updateData.location.address).forEach(addressKey => {
              updateData[`location.address.${addressKey}`] = updateData.location.address[addressKey];
            });
          } else if (key === 'coordinates') {
            updateData[`location.coordinates`] = updateData.location.coordinates;
          } else {
            updateData[`location.${key}`] = updateData.location[key];
          }
        });
        delete updateData.location;
      }

      if (updateData.interior) {
        Object.keys(updateData.interior).forEach(key => {
          updateData[`interior.${key}`] = updateData.interior[key];
        });
        delete updateData.interior;
      }

      if (updateData.exterior) {
        Object.keys(updateData.exterior).forEach(key => {
          updateData[`exterior.${key}`] = updateData.exterior[key];
        });
        delete updateData.exterior;
      }

      if (updateData.financial) {
        Object.keys(updateData.financial).forEach(key => {
          updateData[`financial.${key}`] = updateData.financial[key];
        });
        delete updateData.financial;
      }

      if (updateData.areaAndLot) {
        Object.keys(updateData.areaAndLot).forEach(key => {
          updateData[`areaAndLot.${key}`] = updateData.areaAndLot[key];
        });
        delete updateData.areaAndLot;
      }

      if (updateData.amenities) {
        Object.keys(updateData.amenities).forEach(key => {
          updateData[`amenities.${key}`] = updateData.amenities[key];
        });
        delete updateData.amenities;
      }

      if (updateData.rental) {
        Object.keys(updateData.rental).forEach(key => {
          updateData[`rental.${key}`] = updateData.rental[key];
        });
        delete updateData.rental;
      }

      const result = await propertyModel.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true, runValidators: true }
      );

      if (!result) {
        return httpError(next, responseMessage.COMMON.FAILED_TO_UPDATE("property"), req, 400);
      }

      httpResponse(req, res, 200, responseMessage.UPDATED, result);
    } catch (err) {
      httpError(next, err, req, 500);
    }
  },

  deleteProperty: async (req, res, next) => {
    try {
      const { id } = req.params;
      const result = await propertyModel.findByIdAndDelete(id);

      if (!result) {
        return httpError(next, responseMessage.ERROR.NOT_FOUND('property'), req, 404);
      }

      httpResponse(req, res, 200, responseMessage.DELETED);
    } catch (err) {
      httpError(next, err, req, 500);
    }
  },

  getFeaturedProperties: async (req, res, next) => {
    try {
      const { limit = 6 } = req.query;

      const properties = await propertyModel
        .find({ 
          'listing.featured': true, 
          'listing.isActive': true 
        })
        .sort({ createdAt: -1 })
        .limit(parseInt(limit));

      httpResponse(req, res, 200, responseMessage.SUCCESS, properties);
    } catch (err) {
      httpError(next, err, req, 500);
    }
  },

  getSimilarProperties: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { limit = 4 } = req.query;

      const property = await propertyModel.findById(id);
      if (!property) {
        return httpError(next, responseMessage.ERROR.NOT_FOUND('property'), req, 404);
      }

      const priceRange = property.pricing.salesPrice ? 
        property.pricing.salesPrice * 0.2 : 
        property.pricing.rentPrice?.monthly * 0.3;

      const filter = {
        _id: { $ne: id },
        'listing.isActive': true,
        'areaAndLot.propertyType': property.areaAndLot.propertyType,
        'basicInfo.beds': { $in: [property.basicInfo.beds - 1, property.basicInfo.beds, property.basicInfo.beds + 1] }
      };

      if (property.pricing.salesPrice) {
        filter['pricing.salesPrice'] = {
          $gte: property.pricing.salesPrice - priceRange,
          $lte: property.pricing.salesPrice + priceRange
        };
      } else if (property.pricing.rentPrice?.monthly) {
        filter['pricing.rentPrice.monthly'] = {
          $gte: property.pricing.rentPrice.monthly - priceRange,
          $lte: property.pricing.rentPrice.monthly + priceRange
        };
      }

      const similarProperties = await propertyModel
        .find(filter)
        .limit(parseInt(limit))
        .sort({ createdAt: -1 });

      httpResponse(req, res, 200, responseMessage.SUCCESS, similarProperties);
    } catch (err) {
      httpError(next, err, req, 500);
    }
  }
};