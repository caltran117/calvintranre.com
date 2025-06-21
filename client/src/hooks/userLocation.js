import { useState, useEffect, useCallback } from 'react';
import { locationAPI, ipLocationAPI } from '../utils/api';

const useLocation = () => {
  const [locationData, setLocationData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [permissionStatus, setPermissionStatus] = useState('prompt');

  const getIPLocation = async () => {
    try {
      const { data } = await ipLocationAPI.getLocation();
      
      if (data.latitude && data.longitude) {
        return {
          lat: parseFloat(data.latitude),
          lon: parseFloat(data.longitude),
          source: 'ip'
        };
      }
      throw new Error('Unable to get IP location');
    } catch (err) {
      console.warn('IP location failed:', err);
      return null;
    }
  };

  const getGPSLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported'));
        return;
      }

      const options = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000
      };

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
            source: 'gps'
          });
        },
        (error) => {
          let errorMessage = 'Location access denied';
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location permission denied';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information unavailable';
              break;
            case error.TIMEOUT:
              errorMessage = 'Location request timeout';
              break;
          }
          reject(new Error(errorMessage));
        },
        options
      );
    });
  };

  const sendLocationToAPI = async (locationData) => {
    try {
      const response = await locationAPI.saveLocation(locationData.lat, locationData.lon);
      return response.data;
    } catch (err) {
      console.error('Failed to send location to API:', err);
      throw err;
    }
  };

  const shouldRequestLocation = () => {
    const isLocationSaved = localStorage.getItem('isLocationSaved');
    const lastLocationRequest = localStorage.getItem('lastLocationRequest');
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;

    if (isLocationSaved === 'true') {
      return false;
    }

    if (isLocationSaved === 'false' && lastLocationRequest) {
      const timeSinceLastRequest = now - parseInt(lastLocationRequest);
      if (timeSinceLastRequest < oneDay) {
        return false;
      }
    }

    return true;
  };

  const getAndSaveLocation = useCallback(async (forceRequest = false) => {
    if (!forceRequest && !shouldRequestLocation()) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      let location = null;

      try {
        location = await getGPSLocation();
        setPermissionStatus('granted');
        console.log('GPS location obtained:', location);
      } catch (gpsError) {
        console.warn('GPS location failed:', gpsError.message);
        setPermissionStatus('denied');
        
        location = await getIPLocation();
        if (location) {
          console.log('IP location obtained:', location);
        }
      }

      if (location) {
        try {
          await sendLocationToAPI(location);
          localStorage.setItem('isLocationSaved', 'true');
          localStorage.setItem('lastLocationRequest', Date.now().toString());
          setLocationData(location);
          console.log('Location saved successfully');
        } catch (apiError) {
          console.error('Failed to save location to API:', apiError);
          localStorage.setItem('isLocationSaved', 'false');
          localStorage.setItem('lastLocationRequest', Date.now().toString());
          setError('Failed to save location data');
        }
      } else {
        localStorage.setItem('isLocationSaved', 'false');
        localStorage.setItem('lastLocationRequest', Date.now().toString());
        setError('Unable to determine location');
      }
    } catch (err) {
      console.error('Location error:', err);
      localStorage.setItem('isLocationSaved', 'false');
      localStorage.setItem('lastLocationRequest', Date.now().toString());
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    getAndSaveLocation();
  }, [getAndSaveLocation]);

  useEffect(() => {
    if (navigator.permissions) {
      navigator.permissions.query({ name: 'geolocation' })
        .then((permission) => {
          setPermissionStatus(permission.state);
          
          permission.onchange = () => {
            setPermissionStatus(permission.state);
            
            if (permission.state === 'granted') {
              getAndSaveLocation(true);
            }
          };
        })
        .catch((err) => {
          console.warn('Permission query failed:', err);
        });
    }
  }, [getAndSaveLocation]);

  const retryLocation = () => {
    getAndSaveLocation(true);
  };

  const resetLocationData = () => {
    localStorage.removeItem('isLocationSaved');
    localStorage.removeItem('lastLocationRequest');
    setLocationData(null);
    setError(null);
    setPermissionStatus('prompt');
  };

  return {
    locationData,
    isLoading,
    error,
    permissionStatus,
    retryLocation,
    resetLocationData,
    isLocationSaved: localStorage.getItem('isLocationSaved') === 'true'
  };
};

export default useLocation;