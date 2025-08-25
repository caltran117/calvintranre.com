import responseMessage from "../../constant/responseMessage.js";
import locationStatModel from "../../models/location.stat.model.js";
import httpError from "../../util/httpError.js";
import httpResponse from "../../util/httpResponse.js";

export default {
  self: (req, res, next) => {
    try {
      httpResponse(req, res, 200, responseMessage.SERVICE("LocationStat"));
    } catch (err) {
      httpError(next, err, req, 500);
    }
  },
  addStat: async (req, res, next) => {
    try {
      const { lat, lon } = req.body;

      const LocationStat = await locationStatModel.create({
        lat,
        lon,
      });

      if (!LocationStat) {
        return httpError(next, responseMessage.COMMON.FAILED_TO_SAVE, req, 400);
      }

      httpResponse(req, res, 201, responseMessage.CREATED);
    } catch (err) {
      httpError(next, err, req, 500);
    }
  },
  getStats: async (req, res, next) => {
    try {
      const stats = await locationStatModel.find().sort({ createdAt: -1 });
      httpResponse(req, res, 200, responseMessage.SUCCESS, stats);
    } catch (err) {
      httpError(next, err, req, 500);
    }
  },
  getStatById: async (req, res, next) => {
    try {
      const { id } = req.params;
      const stat = await locationStatModel.findById(id);

      if (!stat) {
        return httpError(next, responseMessage.ERROR.NOT_FOUND('stat'), req, 400);
      }

      httpResponse(req, res, 200, responseMessage.SUCCESS, stat);
    } catch (err) {
      httpError(next, err, req, 500);
    }
  },
  updateStat: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { lat, lon } = req.body;

      const result = await locationStatModel.findByIdAndUpdate(
        id,
        { lat, lon },
        { new: true, runValidators: true }
      );

      if (!result) {
        return httpError(next, responseMessage.COMMON.FAILED_TO_UPDATE, req, 400);
      }

      httpResponse(req, res, 200, responseMessage.UPDATED);
    } catch (err) {
      httpError(next, err, req, 500);
    }
  },
  deleteStat: async (req, res, next) => {
    try {
      const { id } = req.params;
      const result = await locationStatModel.findByIdAndDelete(id);

      if (!result) {
        return httpError(next, responseMessage.ERROR.NOT_FOUND('Location'), req, 400);
      }

      httpResponse(req, res, 200, responseMessage.DELETED);
    } catch (err) {
      httpError(next, err, req, 500);
    }
  },
};
