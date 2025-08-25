export const EApplicationEnvironment = Object.freeze({
    PRODUCTION: 'production',
    DEVELOPMENT: 'development'
});

export const EUserRole = Object.freeze({
    ADMIN: 'admin',
    USER: 'user',
});


export const EPropertyStatus = Object.freeze({
    FOR_SALE: 'For Sale',
    FOR_RENT: 'For Rent',
    SOLD: 'Sold',
    RENTED: 'Rented',
    UNDER_CONTRACT: 'Under Contract',
    OFF_MARKET: 'Off Market',
    COMING_SOON: 'Coming Soon'
});

export const EPropertyType = Object.freeze({
    RESIDENTIAL: 'Residential',
    COMMERCIAL: 'Commercial',
    LAND: 'Land',
    MULTI_FAMILY: 'Multi-Family',
    CONDO: 'Condo',
    TOWNHOUSE: 'Townhouse'
});

export const ELotUnit = Object.freeze({
    SQFT: 'Sq.Ft.',
    ACRES: 'Acres',
    SQM: 'Sq.M.'
});

export const EWaterSource = Object.freeze({
    PUBLIC: 'Public',
    WELL: 'Well',
    OTHER: 'Other'
});

export const EHeatingType = Object.freeze({
    CENTRAL: 'Central',
    FORCED_AIR: 'Forced Air',
    RADIANT: 'Radiant',
    OTHER: 'Other',
    NONE: 'None'
});

export const EAirConditioningType = Object.freeze({
    CENTRAL: 'Central',
    WINDOW_UNITS: 'Window Units',
    NONE: 'None',
    OTHER: 'Other'
});

export const ESewerType = Object.freeze({
    PUBLIC_SEWER: 'Public Sewer',
    SEPTIC: 'Septic',
    OTHER: 'Other'
});

export const EFurnishedType = Object.freeze({
    FURNISHED: 'Furnished',
    UNFURNISHED: 'Unfurnished',
    PARTIALLY_FURNISHED: 'Partially Furnished'
});

export const EFrequency = Object.freeze({
    MONTHLY: 'monthly',
    QUARTERLY: 'quarterly',
    YEARLY: 'yearly'
});

export const ELeaseUnit = Object.freeze({
    MONTHS: 'months',
    YEARS: 'years'
});

export const EDocumentType = Object.freeze({
    FLOOR_PLAN: 'Floor Plan',
    DISCLOSURE: 'Disclosure',
    HOA_DOCUMENTS: 'HOA Documents',
    OTHER: 'Other'
});

export const ESortOrder = Object.freeze({
    ASC: 'asc',
    DESC: 'desc'
});