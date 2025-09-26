import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { GoogleMap, Marker, InfoWindow } from '@react-google-maps/api';
import { useCurrentLocation } from '../../hooks/useCurrentLocation';
import { useGoogleMaps } from '../../context/GoogleMapsContext';
import LocationPermissionModal from '../common/LocationPermissionModal';

const containerStyle = {
  width: '100%',
  height: '320px',
  borderRadius: '6px',
};

const defaultCenter = {
  lat: 20.5937, // Center of India
  lng: 78.9629,
};

const LiveRidersMap = ({ riders }) => {
  const [selectedRider, setSelectedRider] = useState(null);
  const { isLoaded, loadError } = useGoogleMaps();
  const {
    location: currentLocation,
    getCurrentLocation,
    loading: locationLoading,
    error: locationError,
    showPermissionModal,
    setShowPermissionModal
  } = useCurrentLocation();

  // Get current location on component mount
  useEffect(() => {
    if (!currentLocation) {
      getCurrentLocation();
    }
  }, [currentLocation, getCurrentLocation]);

  // Normalize coordinates into numbers and filter out invalid ones
  const validRiders = useMemo(() => {
    return (
      riders?.map((rider) => {
        // Handle both array format [lat, lng] and object format {lat, lng}
        let coordinates;
        if (Array.isArray(rider.coordinates) && rider.coordinates.length === 2) {
          coordinates = {
            lat: parseFloat(rider.coordinates[0]),
            lng: parseFloat(rider.coordinates[1])
          };
        } else if (rider.coordinates && typeof rider.coordinates === 'object') {
          coordinates = {
            lat: parseFloat(rider.coordinates.lat),
            lng: parseFloat(rider.coordinates.lng)
          };
        } else {
          return null;
        }

        // Validate coordinates
        if (isNaN(coordinates.lat) || isNaN(coordinates.lng)) {
          return null;
        }

        return {
          ...rider,
          coordinates,
        };
      }).filter((r) => r !== null) || []
    );
  }, [riders]);
  // Auto-calculate map center
  const mapCenter = useMemo(() => {
    // If we have riders, calculate center based on riders
    if (validRiders.length > 0) {
      const avg = validRiders.reduce(
        (acc, r) => ({
          lat: acc.lat + r.coordinates.lat,
          lng: acc.lng + r.coordinates.lng,
        }),
        { lat: 0, lng: 0 }
      );
      return {
        lat: avg.lat / validRiders.length,
        lng: avg.lng / validRiders.length,
      };
    }

    // If we have current location, use it as center when no riders
    if (currentLocation) {
      return {
        lat: currentLocation.lat,
        lng: currentLocation.lng,
      };
    }

    // Fallback to default center
    return defaultCenter;
  }, [validRiders, currentLocation]);

  // Fit bounds to all riders
  const onLoad = useCallback((map) => {
    if (validRiders.length > 0 && window.google?.maps) {
      const bounds = new window.google.maps.LatLngBounds();
      validRiders.forEach((r) => {
        bounds.extend({
          lat: r.coordinates.lat,
          lng: r.coordinates.lng,
        });
      });
      map.fitBounds(bounds);
    }
  }, [validRiders]);

  // Show loading state while Google Maps is loading
  if (!isLoaded) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Live Riders Map
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Real-time rider locations</p>
        </div>
        <div className="flex items-center justify-center h-80">
          <div className="text-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-400 mx-auto mb-2"></div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Loading map...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state if Google Maps failed to load
  if (loadError) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Live Riders Map
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Real-time rider locations</p>
        </div>
        <div className="flex items-center justify-center h-80">
          <div className="text-center">
            <p className="text-red-600 mb-2 text-sm">Failed to load map</p>
            <p className="text-gray-500 text-xs">{loadError.message}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Live Riders Map
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {validRiders.length} active riders • Click markers for details
          </p>
        </div>
        {locationLoading && (
          <div className="flex items-center text-xs text-gray-500">
            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-gray-400 mr-2"></div>
            Getting location...
          </div>
        )}
      </div>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={mapCenter}
        zoom={10}
        onLoad={onLoad}
        options={{
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
        }}
      >
        {validRiders.map((rider, index) => (
          <Marker
            key={rider._id || index}
            position={{
              lat: rider.coordinates.lat,
              lng: rider.coordinates.lng,
            }}
            title={rider.name}
            onClick={() => setSelectedRider(rider)}
            icon={{
              url: '/motorbike.png', // file located at public/riderIcon.png
              scaledSize: new window.google.maps.Size(40, 40), // optional, adjust icon size
            }}
          />
        ))}

        {selectedRider && (
          <InfoWindow
            position={{
              lat: selectedRider.coordinates.lat,
              lng: selectedRider.coordinates.lng,
            }}
            onCloseClick={() => setSelectedRider(null)}
          >
            <div className="p-2 min-w-[180px]">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 2L3 7v11h4v-6h6v6h4V7l-7-5z"/>
                  </svg>
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm truncate">
                    {selectedRider.name || 'Unknown Rider'}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Delivery Rider
                  </p>
                </div>
              </div>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>

      <LocationPermissionModal
        isOpen={showPermissionModal}
        onClose={() => setShowPermissionModal(false)}
        onAllow={getCurrentLocation}
        error={locationError}
      />
    </div>
  );
};

export default LiveRidersMap;
