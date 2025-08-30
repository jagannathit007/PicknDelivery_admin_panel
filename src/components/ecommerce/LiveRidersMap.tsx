import React, { useMemo, useState } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '400px',
  borderRadius: '8px',
};

const defaultCenter = {
  lat: 20.5937, // Center of India
  lng: 78.9629,
};

const LiveRidersMap = ({ riders }) => {
  const [selectedRider, setSelectedRider] = useState(null);

  // Normalize coordinates into numbers and filter out invalid ones
  const validRiders = useMemo(() => {
    return (
      riders?.map((rider) => {
        const lat = parseFloat(rider.coordinates?.lat);
        const lng = parseFloat(rider.coordinates?.lng);
        return {
          ...rider,
          coordinates: {
            lat: isNaN(lat) ? 0 : lat,
            lng: isNaN(lng) ? 0 : lng,
          },
        };
      })
      .filter(
        (r) =>
          r.coordinates.lat !== 0 &&
          r.coordinates.lng !== 0
      ) || []
    );
  }, [riders]);

  // Auto-calculate map center
  const mapCenter = useMemo(() => {
    if (!validRiders.length) return defaultCenter;
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
  }, [validRiders]);

  // Fit bounds to all riders
  const onLoad = (map) => {
    if (validRiders.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();
      validRiders.forEach((r) => {
        bounds.extend({
          lat: r.coordinates.lat,
          lng: r.coordinates.lng,
        });
      });
      map.fitBounds(bounds);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-default p-6">
      <h3 className="text-xl font-semibold text-black dark:text-white mb-4">
        Live Riders Map ({validRiders.length} active)
      </h3>
      <LoadScript googleMapsApiKey="AIzaSyD-9eHhlSOtkrv_hJ1yXohCmtrJ8mNEG2c">
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
              icon={
                rider.image
                  ? {
                      url: rider.image.replace(/\\/g, '/'), // fix Windows-style path
                      scaledSize: new window.google.maps.Size(40, 40),
                    }
                  : undefined
              }
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
              <div className="p-2">
                <h3 className="font-semibold">{selectedRider.name}</h3>
                <p>Lat: {selectedRider.coordinates.lat.toFixed(4)}</p>
                <p>Lng: {selectedRider.coordinates.lng.toFixed(4)}</p>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default LiveRidersMap;
