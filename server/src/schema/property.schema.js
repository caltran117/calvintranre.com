import { z } from "zod"

const addressSchema = z.object({
  street: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  country: z.string().optional()
})

const coordinatesSchema = z.object({
  type: z.enum(['Point']).optional(),
  coordinates: z.array(z.number()).length(2).refine(
    (coords) => coords[0] >= -180 && coords[0] <= 180 && coords[1] >= -90 && coords[1] <= 90,
    { message: "Coordinates must be [longitude, latitude] with longitude between -180 and 180, latitude between -90 and 90" }
  ).optional()
})

const imageSchema = z.object({
  url: z.string().min(1, "Image URL is required"),
  caption: z.string().optional(),
  isPrimary: z.boolean().optional(),
  order: z.number().optional()
})

const pricingSchema = z.object({
  salesPrice: z.number().positive().optional(),
  offerPrice: z.number().positive().optional(),
  rentPrice: z.object({
    monthly: z.number().positive().optional(),
    weekly: z.number().positive().optional(),
    daily: z.number().positive().optional()
  }).optional(),
  pricePerSqft: z.number().positive().optional(),
  deposit: z.object({
    security: z.number().positive().optional(),
    pet: z.number().positive().optional(),
    cleaning: z.number().positive().optional()
  }).optional(),
  hoa: z.object({
    amount: z.number().positive().optional(),
    frequency: z.enum(['monthly', 'quarterly', 'yearly']).optional()
  }).optional()
})

const rentalSchema = z.object({
  leaseTerms: z.object({
    minimum: z.number().positive().optional(),
    maximum: z.number().positive().optional(),
    unit: z.enum(['months', 'years']).optional()
  }).optional(),
  availableDate: z.string().transform((str) => new Date(str)).optional(),
  petPolicy: z.object({
    allowed: z.boolean().optional(),
    types: z.array(z.string()).optional(),
    restrictions: z.string().optional(),
    fee: z.number().positive().optional(),
    deposit: z.number().positive().optional()
  }).optional(),
  utilities: z.object({
    included: z.array(z.string()).optional(),
    excluded: z.array(z.string()).optional(),
    estimatedCost: z.number().positive().optional()
  }).optional(),
  furnished: z.enum(['Furnished', 'Unfurnished', 'Partially Furnished']).optional(),
  parking: z.object({
    included: z.boolean().optional(),
    spaces: z.number().min(0).optional(),
    cost: z.number().positive().optional(),
    type: z.string().optional()
  }).optional()
})

export const propertySchema = z.object({
  title: z.string().min(1, "Title is required").trim(),
  description: z.string().min(1, "Description is required").trim(),
  
  pricing: pricingSchema,
  
  basicInfo: z.object({
    beds: z.number().min(0, "Beds must be 0 or greater"),
    baths: z.number().min(0, "Baths must be 0 or greater"),
    sqft: z.number().positive("Square feet must be positive")
  }),

  location: z.object({
    address: addressSchema.optional(),
    coordinates: coordinatesSchema.optional(),
    mapLink: z.string().optional()
  }).optional(),

  status: z.enum(['For Sale', 'For Rent', 'Sold', 'Rented', 'Under Contract', 'Off Market', 'Coming Soon']),

  images: z.array(imageSchema).min(1, "At least one image is required"),

  interior: z.object({
    totalBedrooms: z.number().min(0).optional(),
    totalBathrooms: z.number().min(0).optional(),
    fullBathrooms: z.number().min(0).optional(),
    halfBathrooms: z.number().min(0).optional(),
    laundryRoom: z.array(z.string()).optional(),
    fireplace: z.array(z.string()).optional(),
    appliances: z.array(z.string()).optional(),
    flooring: z.array(z.string()).optional(),
    additionalRooms: z.array(z.object({
      name: z.string().optional(),
      size: z.string().optional(),
      description: z.string().optional()
    })).optional()
  }).optional(),

  areaAndLot: z.object({
    livingArea: z.number().positive().optional(),
    lotArea: z.number().positive().optional(),
    lotUnit: z.enum(['Sq.Ft.', 'Acres', 'Sq.M.']).optional(),
    mlsId: z.string().optional(),
    propertyType: z.enum(['Residential', 'Commercial', 'Land', 'Multi-Family', 'Condo', 'Townhouse']).optional(),
    yearBuilt: z.number().min(1800).max(new Date().getFullYear()).optional(),
    viewDescription: z.array(z.string()).optional(),
    schoolDistrict: z.string().optional()
  }).optional(),

  exterior: z.object({
    stories: z.number().min(1).optional(),
    garageSpaces: z.number().min(0).optional(),
    waterSource: z.enum(['Public', 'Well', 'Other']).optional(),
    pool: z.object({
      hasPool: z.boolean().optional(),
      features: z.array(z.string()).optional()
    }).optional(),
    roof: z.string().optional(),
    parkingFeatures: z.array(z.string()).optional(),
    heating: z.enum(['Central', 'Forced Air', 'Radiant', 'Other', 'None']).optional(),
    airConditioning: z.enum(['Central', 'Window Units', 'None', 'Other']).optional(),
    sewer: z.enum(['Public Sewer', 'Septic', 'Other']).optional(),
    securityFeatures: z.array(z.string()).optional(),
    landscaping: z.array(z.string()).optional(),
    additionalFeatures: z.array(z.string()).optional()
  }).optional(),

  financial: z.object({
    taxes: z.object({
      annual: z.number().positive().optional(),
      year: z.number().min(2000).optional()
    }).optional(),
    insurance: z.object({
      estimated: z.number().positive().optional(),
      frequency: z.enum(['monthly', 'quarterly', 'yearly']).optional()
    }).optional(),
    utilities: z.object({
      electric: z.string().optional(),
      gas: z.string().optional(),
      water: z.string().optional(),
      internet: z.string().optional()
    }).optional()
  }).optional(),

  listing: z.object({
    listedDate: z.string().transform((str) => new Date(str)).optional(),
    updatedDate: z.string().transform((str) => new Date(str)).optional(),
    soldDate: z.string().transform((str) => new Date(str)).optional(),
    daysOnMarket: z.number().min(0).optional(),
    agent: z.object({
      name: z.string().optional(),
      company: z.string().optional(),
      phone: z.string().optional(),
      email: z.string().email().optional()
    }).optional(),
    featured: z.boolean().optional(),
    isActive: z.boolean().optional()
  }).optional(),

  amenities: z.object({
    community: z.array(z.string()).optional(),
    nearby: z.array(z.string()).optional(),
    transportation: z.array(z.string()).optional()
  }).optional(),

  rental: rentalSchema.optional(),

  virtualTour: z.object({
    url: z.string().optional(),
    provider: z.string().optional()
  }).optional(),

  documents: z.array(z.object({
    name: z.string().optional(),
    url: z.string().optional(),
    type: z.enum(['Floor Plan', 'Disclosure', 'HOA Documents', 'Other']).optional()
  })).optional()
})

export const updatePropertySchema = propertySchema.partial()

export const getPropertiesQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  status: z.enum(['For Sale', 'For Rent', 'Sold', 'Rented', 'Under Contract', 'Off Market', 'Coming Soon']).optional(),
  propertyType: z.enum(['Residential', 'Commercial', 'Land', 'Multi-Family', 'Condo', 'Townhouse']).optional(),
  minPrice: z.string().optional(),
  maxPrice: z.string().optional(),
  minRent: z.string().optional(),
  maxRent: z.string().optional(),
  beds: z.string().optional(),
  baths: z.string().optional(),
  minSqft: z.string().optional(),
  maxSqft: z.string().optional(),
  featured: z.string().optional(),
  isActive: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  furnished: z.enum(['Furnished', 'Unfurnished', 'Partially Furnished']).optional(),
  petAllowed: z.string().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional()
})

export const searchPropertiesQuerySchema = z.object({
  query: z.string().optional(),
  page: z.string().optional(),
  limit: z.string().optional(),
  status: z.enum(['For Sale', 'For Rent', 'Sold', 'Rented', 'Under Contract', 'Off Market', 'Coming Soon']).optional(),
  propertyType: z.enum(['Residential', 'Commercial', 'Land', 'Multi-Family', 'Condo', 'Townhouse']).optional(),
  featured: z.string().optional(),
  isActive: z.string().optional(),
  lat: z.string().optional(),
  lon: z.string().optional(),
  radius: z.string().optional()
})

export const similarPropertiesQuerySchema = z.object({
  limit: z.string().optional()
})