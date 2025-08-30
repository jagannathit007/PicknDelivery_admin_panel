import React, { useMemo } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '400px',
};

const defaultCenter = {
  lat: 0,
  lng: 0,
};

const LiveRidersMap = ({ riders }) => {
  // Calculate map center and bounds based on riders' coordinates
  const mapCenter = useMemo(() => {
    if (!riders || riders.length === 0) return defaultCenter;

    // Calculate average coordinates for center
    const avgCoordinates = riders.reduce(
      (acc, rider) => ({
        lat: acc.lat + rider.coordinates.lat,
        lng: acc.lng + rider.coordinates.lng,
      }),
      { lat: 0, lng: 0 }
    );

    return {
      lat: avgCoordinates.lat / riders.length,
      lng: avgCoordinates.lng / riders.length,
    };
  }, [riders]);

  // Fit map bounds to show all riders
  const onLoad = (map) => {
    if (riders && riders.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();
      riders.forEach((rider) => {
        bounds.extend({
          lat: rider.coordinates.lat,
          lng: rider.coordinates.lng,
        });
      });
      map.fitBounds(bounds);
    }
  };

  return (
    <LoadScript googleMapsApiKey="AIzaSyD-9eHhlSOtkrv_hJ1yXohCmtrJ8mNEG2c">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={mapCenter}
        zoom={12} // Fallback zoom level, overridden by fitBounds
        onLoad={onLoad}
      >
        {riders?.map((rider, index) => (
          <Marker
            key={rider._id || index}
            position={{
              lat: rider.coordinates.lat,
              lng: rider.coordinates.lng,
            }}
            title={rider.name}
            icon={rider.image ? {
              url: rider.image,
              scaledSize: new window.google.maps.Size(40, 40), // Resize icon
            } : undefined}
          />
        ))}
      </GoogleMap>
    </LoadScript>
  );
};

export default LiveRidersMap;