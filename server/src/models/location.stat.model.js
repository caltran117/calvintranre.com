import mongoose from 'mongoose'

const locationStatSchema = new mongoose.Schema({
  lat: {
    type: Number,
    required: true,
    min: -90,
    max: 90
  },
  lon: {
    type: Number,
    required: true,
    min: -180,
    max: 180
  }
}, {
  timestamps: true
})

export default mongoose.model('LocationStat', locationStatSchema)