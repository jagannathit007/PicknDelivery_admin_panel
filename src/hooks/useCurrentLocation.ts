import { useState, useEffect } from 'react';

interface LocationData {
  lat: number;
  lng: number;
  timestamp: number;
}

interface UseCurrentLocationReturn {
  location: LocationData | null;
  loading: boolean;
  error: string | null;
  getCurrentLocation: () => void;
  clearStoredLocation: () => void;
  showPermissionModal: boolean;
  setShowPermissionModal: (show: boolean) => void;
}

const STORAGE_KEY = 'picknDeliver_current_location';
const LOCATION_CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

export const useCurrentLocation = (): UseCurrentLocationReturn => {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPermissionModal, setShowPermissionModal] = useState(false);

  // Load stored location on mount
  useEffect(() => {
    const storedLocation = getStoredLocation();
    if (storedLocation) {
      setLocation(storedLocation);
    }
  }, []);

  const getStoredLocation = (): LocationData | null => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return null;

      const locationData: LocationData = JSON.parse(stored);
      const now = Date.now();
      
      // Check if location is still fresh (within cache duration)
      if (now - locationData.timestamp < LOCATION_CACHE_DURATION) {
        return locationData;
      } else {
        // Location is stale, remove it
        localStorage.removeItem(STORAGE_KEY);
        return null;
      }
    } catch (error) {
      console.error('Error reading stored location:', error);
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
  };

  const storeLocation = (lat: number, lng: number): void => {
    const locationData: LocationData = {
      lat,
      lng,
      timestamp: Date.now(),
    };
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(locationData));
      setLocation(locationData);
    } catch (error) {
      console.error('Error storing location:', error);
    }
  };

  const getCurrentLocation = (): void => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser');
      setShowPermissionModal(true);
      return;
    }

    setLoading(true);
    setError(null);

    const options: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 5 * 60 * 1000, // 5 minutes
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        storeLocation(latitude, longitude);
        setLoading(false);
        setShowPermissionModal(false);
      },
      (error) => {
        let errorMessage = 'Failed to get current location';
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied by user';
            setShowPermissionModal(true);
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out';
            break;
        }
        
        setError(errorMessage);
        setLoading(false);
      },
      options
    );
  };

  const clearStoredLocation = (): void => {
    localStorage.removeItem(STORAGE_KEY);
    setLocation(null);
  };

  return {
    location,
    loading,
    error,
    getCurrentLocation,
    clearStoredLocation,
    showPermissionModal,
    setShowPermissionModal,
  };
};
