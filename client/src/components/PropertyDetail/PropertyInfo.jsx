import React from 'react';

const PropertyInfo = ({ property }) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-light mb-4 text-gray-900">About This Property</h2>
        <p className="text-gray-600 leading-relaxed">
          {property.description}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-xl font-light mb-4 text-gray-900">Property Details</h3>
          <div className="space-y-3 text-sm">
            {property.areaAndLot?.propertyType && (
              <div className="flex justify-between">
                <span className="text-gray-600">Property Type:</span>
                <span className="text-gray-900">{property.areaAndLot.propertyType}</span>
              </div>
            )}
            {property.areaAndLot?.yearBuilt && (
              <div className="flex justify-between">
                <span className="text-gray-600">Year Built:</span>
                <span className="text-gray-900">{property.areaAndLot.yearBuilt}</span>
              </div>
            )}
            {property.areaAndLot?.livingArea && (
              <div className="flex justify-between">
                <span className="text-gray-600">Living Area:</span>
                <span className="text-gray-900">{property.areaAndLot.livingArea.toLocaleString()} sqft</span>
              </div>
            )}
            {property.areaAndLot?.lotArea && (
              <div className="flex justify-between">
                <span className="text-gray-600">Lot Size:</span>
                <span className="text-gray-900">
                  {property.areaAndLot.lotArea} {property.areaAndLot.lotUnit || 'sqft'}
                </span>
              </div>
            )}
            {property.exterior?.stories && (
              <div className="flex justify-between">
                <span className="text-gray-600">Stories:</span>
                <span className="text-gray-900">{property.exterior.stories}</span>
              </div>
            )}
            {property.exterior?.garageSpaces && (
              <div className="flex justify-between">
                <span className="text-gray-600">Garage:</span>
                <span className="text-gray-900">{property.exterior.garageSpaces} spaces</span>
              </div>
            )}
            {property.areaAndLot?.mlsId && (
              <div className="flex justify-between">
                <span className="text-gray-600">MLS ID:</span>
                <span className="text-gray-900">{property.areaAndLot.mlsId}</span>
              </div>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-xl font-light mb-4 text-gray-900">Financial Information</h3>
          <div className="space-y-3 text-sm">
            {property.status === 'For Sale' && property.pricing?.salesPrice && (
              <div className="flex justify-between">
                <span className="text-gray-600">Sale Price:</span>
                <span className="text-gray-900">${property.pricing.salesPrice.toLocaleString()}</span>
              </div>
            )}
            {property.status === 'For Rent' && property.pricing?.rentPrice?.monthly && (
              <div className="flex justify-between">
                <span className="text-gray-600">Monthly Rent:</span>
                <span className="text-gray-900">${property.pricing.rentPrice.monthly.toLocaleString()}</span>
              </div>
            )}
            {property.pricing?.pricePerSqft && (
              <div className="flex justify-between">
                <span className="text-gray-600">Price per Sqft:</span>
                <span className="text-gray-900">${property.pricing.pricePerSqft}</span>
              </div>
            )}
            {property.pricing?.hoa?.amount && (
              <div className="flex justify-between">
                <span className="text-gray-600">HOA Fee:</span>
                <span className="text-gray-900">
                  ${property.pricing.hoa.amount}/{property.pricing.hoa.frequency}
                </span>
              </div>
            )}
            {property.financial?.taxes?.annual && (
              <div className="flex justify-between">
                <span className="text-gray-600">Annual Taxes:</span>
                <span className="text-gray-900">${property.financial.taxes.annual.toLocaleString()}</span>
              </div>
            )}
            {property.financial?.insurance?.estimated && (
              <div className="flex justify-between">
                <span className="text-gray-600">Insurance (Est.):</span>
                <span className="text-gray-900">
                  ${property.financial.insurance.estimated.toLocaleString()}/{property.financial.insurance.frequency}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {property.areaAndLot?.schoolDistrict && (
        <div>
          <h3 className="text-xl font-light mb-4 text-gray-900">School Information</h3>
          <p className="text-gray-600">
            School District: <span className="text-gray-900">{property.areaAndLot.schoolDistrict}</span>
          </p>
        </div>
      )}

      {property.areaAndLot?.viewDescription?.length > 0 && (
        <div>
          <h3 className="text-xl font-light mb-4 text-gray-900">Views</h3>
          <div className="flex flex-wrap gap-2">
            {property.areaAndLot.viewDescription.map((view, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-gray-100 text-gray-700 text-sm border"
              >
                {view}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyInfo;