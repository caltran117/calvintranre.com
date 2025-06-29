import mongoose from 'mongoose'
import { 
  EPropertyStatus, 
  EPropertyType, 
  ELotUnit, 
  EWaterSource, 
  EHeatingType, 
  EAirConditioningType, 
  ESewerType, 
  EFurnishedType, 
  EFrequency, 
  ELeaseUnit, 
  EDocumentType 
} from '../constant/application.js'

const propertySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  
  pricing: {
    salesPrice: {
      type: Number
    },
    offerPrice: {
      type: Number
    },
    rentPrice: {
      monthly: Number,
      weekly: Number,
      daily: Number
    },
    pricePerSqft: {
      type: Number
    },
    deposit: {
      security: Number,
      pet: Number,
      cleaning: Number
    },
    hoa: {
      amount: Number,
      frequency: {
        type: String,
        enum: Object.values(EFrequency)
      }
    }
  },

  basicInfo: {
    beds: {
      type: Number,
      required: true,
      min: 0
    },
    baths: {
      type: Number,
      required: true,
      min: 0
    },
    sqft: {
      type: Number,
      required: true
    }
  },

  location: {
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: { type: String, default: 'USA' }
    },
    coordinates: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number],
        validate: {
          validator: function(arr) {
            return arr.length === 2 && 
                   arr[0] >= -180 && arr[0] <= 180 && 
                   arr[1] >= -90 && arr[1] <= 90;
          },
          message: 'Coordinates must be [longitude, latitude] with valid ranges'
        }
      }
    },
    mapLink: String
  },

  status: {
    type: String,
    required: true,
    enum: Object.values(EPropertyStatus),
    default: EPropertyStatus.FOR_SALE
  },

  images: [{
    url: {
      type: String,
      required: true
    },
    caption: String,
    isPrimary: {
      type: Boolean,
      default: false
    },
    order: {
      type: Number,
      default: 0
    }
  }],

  interior: {
    totalBedrooms: Number,
    totalBathrooms: Number,
    fullBathrooms: Number,
    halfBathrooms: Number,
    laundryRoom: [String],
    fireplace: [String],
    appliances: [String],
    flooring: [String],
    additionalRooms: [{
      name: String,
      size: String,
      description: String
    }]
  },

  areaAndLot: {
    livingArea: Number,
    lotArea: Number,
    lotUnit: {
      type: String,
      enum: Object.values(ELotUnit),
      default: ELotUnit.SQFT
    },
    mlsId: String,
    propertyType: {
      type: String,
      enum: Object.values(EPropertyType),
      default: EPropertyType.RESIDENTIAL
    },
    yearBuilt: Number,
    viewDescription: [String],
    schoolDistrict: String
  },

  exterior: {
    stories: Number,
    garageSpaces: Number,
    waterSource: {
      type: String,
      enum: Object.values(EWaterSource)
    },
    pool: {
      hasPool: {
        type: Boolean,
        default: false
      },
      features: [String]
    },
    roof: String,
    parkingFeatures: [String],
    heating: {
      type: String,
      enum: Object.values(EHeatingType)
    },
    airConditioning: {
      type: String,
      enum: Object.values(EAirConditioningType)
    },
    sewer: {
      type: String,
      enum: Object.values(ESewerType)
    },
    securityFeatures: [String],
    landscaping: [String],
    additionalFeatures: [String]
  },

  financial: {
    taxes: {
      annual: Number,
      year: Number
    },
    insurance: {
      estimated: Number,
      frequency: {
        type: String,
        enum: Object.values(EFrequency)
      }
    },
    utilities: {
      electric: String,
      gas: String,
      water: String,
      internet: String
    }
  },

  listing: {
    listedDate: {
      type: Date,
      default: Date.now
    },
    updatedDate: Date,
    soldDate: Date,
    daysOnMarket: Number,
    agent: {
      name: String,
      company: String,
      phone: String,
      email: String
    },
    featured: {
      type: Boolean,
      default: false
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },

  amenities: {
    community: [String],
    nearby: [String],
    transportation: [String]
  },

  rental: {
    leaseTerms: {
      minimum: Number,
      maximum: Number,
      unit: {
        type: String,
        enum: Object.values(ELeaseUnit),
        default: ELeaseUnit.MONTHS
      }
    },
    availableDate: Date,
    petPolicy: {
      allowed: {
        type: Boolean,
        default: false
      },
      types: [String],
      restrictions: String,
      fee: Number,
      deposit: Number
    },
    utilities: {
      included: [String],
      excluded: [String],
      estimatedCost: Number
    },
    furnished: {
      type: String,
      enum: Object.values(EFurnishedType),
      default: EFurnishedType.UNFURNISHED
    },
    parking: {
    included: { type: Boolean },
    spaces: { type: Number, min: 0 },
    cost: { type: Number, min: 0 },
    type: { type: String }
  }
  },

  virtualTour: {
    url: String,
    provider: String
  },

  documents: [{
    name: String,
    url: String,
    type: {
      type: String,
      enum: Object.values(EDocumentType)
    }
  }]

}, {
  timestamps: true
})

propertySchema.index({ 'location.coordinates': '2dsphere' })
propertySchema.index({ status: 1 })
propertySchema.index({ 'pricing.salesPrice': 1 })
propertySchema.index({ 'basicInfo.beds': 1, 'basicInfo.baths': 1 })
propertySchema.index({ 'areaAndLot.propertyType': 1 })
propertySchema.index({ 'listing.featured': 1 })
propertySchema.index({ 'listing.isActive': 1 })

propertySchema.pre('save', function(next) {
  if (this.images && this.images.length > 0) {
    const primaryExists = this.images.some(img => img.isPrimary);
    if (!primaryExists) {
      this.images[0].isPrimary = true;
    }
  }
  
  if (this.listing.listedDate && (this.status === EPropertyStatus.FOR_SALE || this.status === EPropertyStatus.FOR_RENT)) {
    const now = new Date();
    const diffTime = Math.abs(now - this.listing.listedDate);
    this.listing.daysOnMarket = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
  
  next();
})

export default mongoose.model('Property', propertySchema)