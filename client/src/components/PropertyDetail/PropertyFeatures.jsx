import React from 'react';

const PropertyFeatures = ({ property }) => {
  const renderFeatureSection = (title, features) => {
    if (!features || features.length === 0) return null;
    
    return (
      <div>
        <h4 className="font-medium text-gray-900 mb-3">{title}</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {features.map((feature, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-gray-50 text-gray-700 text-sm border text-center"
            >
              {feature}
            </span>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-light mb-6 text-gray-900">Property Features</h2>
        
        <div className="space-y-6">
          {property.interior?.appliances?.length > 0 && 
            renderFeatureSection('Appliances', property.interior.appliances)
          }
          
          {property.interior?.flooring?.length > 0 && 
            renderFeatureSection('Flooring', property.interior.flooring)
          }
          
          {property.interior?.fireplace?.length > 0 && 
            renderFeatureSection('Fireplace Locations', property.interior.fireplace)
          }
          
          {property.interior?.laundryRoom?.length > 0 && 
            renderFeatureSection('Laundry', property.interior.laundryRoom)
          }
        </div>
      </div>

      <div>
        <h3 className="text-xl font-light mb-4 text-gray-900">Exterior Features</h3>
        <div className="space-y-6">
          {property.exterior?.pool?.hasPool && (
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Pool Features</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {property.exterior.pool.features.map((feature, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-50 text-blue-700 text-sm border border-blue-200 text-center"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {property.exterior?.parkingFeatures?.length > 0 && 
            renderFeatureSection('Parking Features', property.exterior.parkingFeatures)
          }
          
          {property.exterior?.securityFeatures?.length > 0 && 
            renderFeatureSection('Security Features', property.exterior.securityFeatures)
          }
        </div>
      </div>

      {(property.exterior?.heating || property.exterior?.airConditioning || property.exterior?.roof) && (
        <div>
          <h3 className="text-xl font-light mb-4 text-gray-900">Systems & Structure</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            {property.exterior?.heating && (
              <div className="flex justify-between">
                <span className="text-gray-600">Heating:</span>
                <span className="text-gray-900">{property.exterior.heating}</span>
              </div>
            )}
            {property.exterior?.airConditioning && (
              <div className="flex justify-between">
                <span className="text-gray-600">Air Conditioning:</span>
                <span className="text-gray-900">{property.exterior.airConditioning}</span>
              </div>
            )}
            {property.exterior?.roof && (
              <div className="flex justify-between">
                <span className="text-gray-600">Roof:</span>
                <span className="text-gray-900">{property.exterior.roof}</span>
              </div>
            )}
            {property.exterior?.waterSource && (
              <div className="flex justify-between">
                <span className="text-gray-600">Water Source:</span>
                <span className="text-gray-900">{property.exterior.waterSource}</span>
              </div>
            )}
            {property.exterior?.sewer && (
              <div className="flex justify-between">
                <span className="text-gray-600">Sewer:</span>
                <span className="text-gray-900">{property.exterior.sewer}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {(property.amenities?.community?.length > 0 || 
        property.amenities?.nearby?.length > 0 || 
        property.amenities?.transportation?.length > 0) && (
        <div>
          <h3 className="text-xl font-light mb-4 text-gray-900">Amenities & Location</h3>
          <div className="space-y-6">
            {property.amenities?.community?.length > 0 && 
              renderFeatureSection('Community Amenities', property.amenities.community)
            }
            
            {property.amenities?.nearby?.length > 0 && 
              renderFeatureSection('Nearby', property.amenities.nearby)
            }
            
            {property.amenities?.transportation?.length > 0 && 
              renderFeatureSection('Transportation', property.amenities.transportation)
            }
          </div>
        </div>
      )}

      {property.status === 'For Rent' && property.rental && (
        <div>
          <h3 className="text-xl font-light mb-4 text-gray-900">Rental Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            {property.rental.leaseTerms && (
              <div className="flex justify-between">
                <span className="text-gray-600">Lease Terms:</span>
                <span className="text-gray-900">
                  {property.rental.leaseTerms.minimum}-{property.rental.leaseTerms.maximum} {property.rental.leaseTerms.unit}
                </span>
              </div>
            )}
            {property.rental.furnished && (
              <div className="flex justify-between">
                <span className="text-gray-600">Furnished:</span>
                <span className="text-gray-900">{property.rental.furnished}</span>
              </div>
            )}
            {property.rental.availableDate && (
              <div className="flex justify-between">
                <span className="text-gray-600">Available Date:</span>
                <span className="text-gray-900">
                  {new Date(property.rental.availableDate).toLocaleDateString()}
                </span>
              </div>
            )}
            {property.rental.petPolicy?.allowed !== undefined && (
              <div className="flex justify-between">
                <span className="text-gray-600">Pets Allowed:</span>
                <span className="text-gray-900">{property.rental.petPolicy.allowed ? 'Yes' : 'No'}</span>
              </div>
            )}
            {property.rental.parking?.included && (
              <div className="flex justify-between">
                <span className="text-gray-600">Parking:</span>
                <span className="text-gray-900">
                  {property.rental.parking.spaces} {property.rental.parking.type} space(s)
                </span>
              </div>
            )}
          </div>

          {property.rental.utilities && (
            <div className="mt-4">
              <h4 className="font-medium text-gray-900 mb-3">Utilities</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {property.rental.utilities.included?.length > 0 && (
                  <div>
                    <span className="text-sm text-gray-600 block mb-2">Included:</span>
                    <div className="flex flex-wrap gap-1">
                      {property.rental.utilities.included.map((utility, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-green-50 text-green-700 text-xs border border-green-200"
                        >
                          {utility}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {property.rental.utilities.excluded?.length > 0 && (
                  <div>
                    <span className="text-sm text-gray-600 block mb-2">Not Included:</span>
                    <div className="flex flex-wrap gap-1">
                      {property.rental.utilities.excluded.map((utility, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-red-50 text-red-700 text-xs border border-red-200"
                        >
                          {utility}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {property.interior && (
        <div>
          <h3 className="text-xl font-light mb-4 text-gray-900">Interior Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            {property.interior.totalBedrooms && (
              <div className="flex justify-between">
                <span className="text-gray-600">Total Bedrooms:</span>
                <span className="text-gray-900">{property.interior.totalBedrooms}</span>
              </div>
            )}
            {property.interior.totalBathrooms && (
              <div className="flex justify-between">
                <span className="text-gray-600">Total Bathrooms:</span>
                <span className="text-gray-900">{property.interior.totalBathrooms}</span>
              </div>
            )}
            {property.interior.fullBathrooms && (
              <div className="flex justify-between">
                <span className="text-gray-600">Full Bathrooms:</span>
                <span className="text-gray-900">{property.interior.fullBathrooms}</span>
              </div>
            )}
            {property.interior.halfBathrooms && (
              <div className="flex justify-between">
                <span className="text-gray-600">Half Bathrooms:</span>
                <span className="text-gray-900">{property.interior.halfBathrooms}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {property.pricing && property.status === 'For Rent' && property.pricing.deposit && (
        <div>
          <h3 className="text-xl font-light mb-4 text-gray-900">Deposit Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            {property.pricing.deposit.security && (
              <div className="flex justify-between">
                <span className="text-gray-600">Security Deposit:</span>
                <span className="text-gray-900">${property.pricing.deposit.security.toLocaleString()}</span>
              </div>
            )}
            {property.pricing.deposit.pet && (
              <div className="flex justify-between">
                <span className="text-gray-600">Pet Deposit:</span>
                <span className="text-gray-900">${property.pricing.deposit.pet.toLocaleString()}</span>
              </div>
            )}
            {property.pricing.deposit.cleaning && (
              <div className="flex justify-between">
                <span className="text-gray-600">Cleaning Deposit:</span>
                <span className="text-gray-900">${property.pricing.deposit.cleaning.toLocaleString()}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyFeatures;