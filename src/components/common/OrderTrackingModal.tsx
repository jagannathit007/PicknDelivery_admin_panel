import React, { useEffect, useState, useRef } from 'react';
import { FaTimes, FaMapMarkerAlt, FaRoute, FaSpinner } from 'react-icons/fa';
import OrderService from '../../services/OrderService';
import toastHelper from '../../utils/toastHelper';

interface OrderTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
  orderNo?: string;
}

interface LocationData {
  orderId: string;
  type: 'pickup' | 'drop';
  locations: {
    riderCurrentLocation: number[];
    pickupLocation: any;
    dropLocation: any;
  };
}

const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({
  isOpen,
  onClose,
  orderId,
  orderNo,
}) => {
  const [locationData, setLocationData] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  // Load map script dynamically
  useEffect(() => {
    if (!isOpen) return;

    const loadGoogleMapsScript = () => {
      if (window.google && window.google.maps) {
        initializeMap();
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&libraries=geometry`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        initializeMap();
      };
      script.onerror = () => {
        setMapError('Failed to load Google Maps. Please check your API key.');
      };
      document.head.appendChild(script);
    };

    loadGoogleMapsScript();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current = null;
      }
    };
  }, [isOpen]);

  const initializeMap = () => {
    if (!mapRef.current || !window.google) return;

    try {
      // Default center (you can adjust this)
      const defaultCenter = { lat: 28.6139, lng: 77.2090 }; // Delhi coordinates

      mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
        zoom: 12,
        center: defaultCenter,
        mapTypeId: window.google.maps.MapTypeId.ROADMAP,
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }],
          },
        ],
      });
    } catch (error) {
      console.error('Error initializing map:', error);
      setMapError('Failed to initialize map');
    }
  };

  const fetchOrderLocations = async () => {
    if (!orderId) return;

    setLoading(true);
    setMapError(null);

    try {
      const response = await OrderService.getOrderLocations({ orderId });
      
      if (response.status === 200 && response.data) {
        setLocationData(response.data);
        plotLocationsOnMap(response.data);
      } else {
        toastHelper.error(response.message || 'Failed to fetch order locations');
      }
    } catch (error: any) {
      console.error('Error fetching order locations:', error);
      toastHelper.error('Failed to fetch order locations');
      setMapError('Failed to fetch order locations');
    } finally {
      setLoading(false);
    }
  };

  const plotLocationsOnMap = (data: LocationData) => {
    if (!mapInstanceRef.current || !window.google) return;

    const map = mapInstanceRef.current;
    
    // Clear existing markers and routes
    if (window.google.maps.markerClusterer) {
      window.google.maps.markerClusterer.clearMarkers();
    }

    const markers: any[] = [];
    const bounds = new window.google.maps.LatLngBounds();

    try {
      // Plot rider current location
      if (data.locations.riderCurrentLocation && data.locations.riderCurrentLocation.length >= 2) {
        const riderPosition = {
          lat: data.locations.riderCurrentLocation[0],
          lng: data.locations.riderCurrentLocation[1],
        };

        const riderMarker = new window.google.maps.Marker({
          position: riderPosition,
          map: map,
          title: 'Rider Current Location',
          icon: {
            url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
              <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                <circle cx="16" cy="16" r="12" fill="#3B82F6" stroke="#ffffff" stroke-width="3"/>
                <text x="16" y="20" text-anchor="middle" fill="white" font-size="12" font-weight="bold">R</text>
              </svg>
            `),
            scaledSize: new window.google.maps.Size(32, 32),
          },
        });

        const riderInfoWindow = new window.google.maps.InfoWindow({
          content: `
            <div class="p-2">
              <h3 class="font-semibold text-blue-600">Rider Location</h3>
              <p class="text-sm text-gray-600">Current position</p>
              <p class="text-xs text-gray-500">${riderPosition.lat.toFixed(6)}, ${riderPosition.lng.toFixed(6)}</p>
            </div>
          `,
        });

        riderMarker.addListener('click', () => {
          riderInfoWindow.open(map, riderMarker);
        });

        markers.push(riderMarker);
        bounds.extend(riderPosition);
      }

      // Plot pickup location
      if (data.locations.pickupLocation && data.locations.pickupLocation.coordinates) {
        const pickupCoords = data.locations.pickupLocation.coordinates;
        if (pickupCoords.length >= 2) {
          const pickupPosition = {
            lat: parseFloat(pickupCoords[0]),
            lng: parseFloat(pickupCoords[1]),
          };

          const pickupMarker = new window.google.maps.Marker({
            position: pickupPosition,
            map: map,
            title: 'Pickup Location',
            icon: {
              url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="16" cy="16" r="12" fill="#10B981" stroke="#ffffff" stroke-width="3"/>
                  <text x="16" y="20" text-anchor="middle" fill="white" font-size="12" font-weight="bold">P</text>
                </svg>
              `),
              scaledSize: new window.google.maps.Size(32, 32),
            },
          });

          const pickupInfoWindow = new window.google.maps.InfoWindow({
            content: `
              <div class="p-2">
                <h3 class="font-semibold text-green-600">Pickup Location</h3>
                <p class="text-sm text-gray-600">${data.locations.pickupLocation.address || 'Address not available'}</p>
                <p class="text-xs text-gray-500">${pickupPosition.lat.toFixed(6)}, ${pickupPosition.lng.toFixed(6)}</p>
                ${data.locations.pickupLocation.person ? `
                  <p class="text-xs text-gray-500 mt-1">
                    Contact: ${data.locations.pickupLocation.person.name} - ${data.locations.pickupLocation.person.mobile}
                  </p>
                ` : ''}
              </div>
            `,
          });

          pickupMarker.addListener('click', () => {
            pickupInfoWindow.open(map, pickupMarker);
          });

          markers.push(pickupMarker);
          bounds.extend(pickupPosition);
        }
      }

      // Plot drop locations
      if (data.locations.dropLocation && Array.isArray(data.locations.dropLocation)) {
        data.locations.dropLocation.forEach((dropLocation: any, index: number) => {
          if (dropLocation.coordinates && dropLocation.coordinates.length >= 2) {
            const dropPosition = {
              lat: parseFloat(dropLocation.coordinates[0]),
              lng: parseFloat(dropLocation.coordinates[1]),
            };

            const dropMarker = new window.google.maps.Marker({
              position: dropPosition,
              map: map,
              title: `Drop Location ${index + 1}`,
              icon: {
                url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                  <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="16" cy="16" r="12" fill="#EF4444" stroke="#ffffff" stroke-width="3"/>
                    <text x="16" y="20" text-anchor="middle" fill="white" font-size="12" font-weight="bold">D</text>
                  </svg>
                `),
                scaledSize: new window.google.maps.Size(32, 32),
              },
            });

            const dropInfoWindow = new window.google.maps.InfoWindow({
              content: `
                <div class="p-2">
                  <h3 class="font-semibold text-red-600">Drop Location ${index + 1}</h3>
                  <p class="text-sm text-gray-600">${dropLocation.address || 'Address not available'}</p>
                  <p class="text-xs text-gray-500">${dropPosition.lat.toFixed(6)}, ${dropPosition.lng.toFixed(6)}</p>
                  ${dropLocation.person ? `
                    <p class="text-xs text-gray-500 mt-1">
                      Contact: ${dropLocation.person.name} - ${dropLocation.person.mobile}
                    </p>
                  ` : ''}
                </div>
              `,
            });

            dropMarker.addListener('click', () => {
              dropInfoWindow.open(map, dropMarker);
            });

            markers.push(dropMarker);
            bounds.extend(dropPosition);
          }
        });
      }

      // Draw route based on order status
      drawRoute(data);

      // Fit map to show all markers
      if (markers.length > 0) {
        map.fitBounds(bounds);
      }

    } catch (error) {
      console.error('Error plotting locations:', error);
      setMapError('Failed to plot locations on map');
    }
  };

  const drawRoute = (data: LocationData) => {
    if (!mapInstanceRef.current || !window.google) return;

    const map = mapInstanceRef.current;
    const directionsService = new window.google.maps.DirectionsService();
    const directionsRenderer = new window.google.maps.DirectionsRenderer({
      suppressMarkers: true, // We'll use our custom markers
      polylineOptions: {
        strokeColor: '#3B82F6',
        strokeWeight: 4,
        strokeOpacity: 0.8,
      },
    });

    directionsRenderer.setMap(map);

    try {
      let origin: any = null;
      let destination: any = null;

      // Determine route based on order status
      if (data.type === 'pickup') {
        // Route from rider to pickup location
        if (data.locations.riderCurrentLocation && data.locations.riderCurrentLocation.length >= 2) {
          origin = new window.google.maps.LatLng(
            data.locations.riderCurrentLocation[0],
            data.locations.riderCurrentLocation[1]
          );
        }
        
        if (data.locations.pickupLocation && data.locations.pickupLocation.coordinates) {
          const pickupCoords = data.locations.pickupLocation.coordinates;
          if (pickupCoords.length >= 2) {
            destination = new window.google.maps.LatLng(
              parseFloat(pickupCoords[0]),
              parseFloat(pickupCoords[1])
            );
          }
        }
      } else {
        // Route from rider to first undelivered drop location
        if (data.locations.riderCurrentLocation && data.locations.riderCurrentLocation.length >= 2) {
          origin = new window.google.maps.LatLng(
            data.locations.riderCurrentLocation[0],
            data.locations.riderCurrentLocation[1]
          );
        }

        // Find first undelivered drop location
        if (data.locations.dropLocation && Array.isArray(data.locations.dropLocation)) {
          const undeliveredDrop = data.locations.dropLocation.find(
            (drop: any) => !drop.isDelivered
          );
          
          if (undeliveredDrop && undeliveredDrop.coordinates) {
            const dropCoords = undeliveredDrop.coordinates;
            if (dropCoords.length >= 2) {
              destination = new window.google.maps.LatLng(
                parseFloat(dropCoords[0]),
                parseFloat(dropCoords[1])
              );
            }
          }
        }
      }

      if (origin && destination) {
        directionsService.route(
          {
            origin: origin,
            destination: destination,
            travelMode: window.google.maps.TravelMode.DRIVING,
          },
          (result: any, status: any) => {
            if (status === window.google.maps.DirectionsStatus.OK) {
              directionsRenderer.setDirections(result);
            } else {
              console.warn('Directions request failed:', status);
            }
          }
        );
      }
    } catch (error) {
      console.error('Error drawing route:', error);
    }
  };

  // Fetch locations when modal opens
  useEffect(() => {
    if (isOpen && orderId) {
      fetchOrderLocations();
    }
  }, [isOpen, orderId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-6xl mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 flex items-center">
              <FaRoute className="w-5 h-5 mr-2 text-blue-600" />
              Order Tracking
            </h2>
            {orderNo && (
              <p className="text-sm text-gray-600 mt-1">Order #{orderNo}</p>
            )}
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={fetchOrderLocations}
              disabled={loading}
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-700 bg-blue-100 rounded-md hover:bg-blue-200 transition-colors disabled:opacity-50"
            >
              {loading ? (
                <FaSpinner className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <FaMapMarkerAlt className="w-4 h-4 mr-2" />
              )}
              Refresh
            </button>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <FaTimes className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Map Container */}
        <div className="relative">
          <div
            ref={mapRef}
            className="w-full h-[600px] bg-gray-100"
            style={{ minHeight: '600px' }}
          />
          
          {/* Loading Overlay */}
          {loading && (
            <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
              <div className="text-center">
                <FaSpinner className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-2" />
                <p className="text-gray-600">Loading order locations...</p>
              </div>
            </div>
          )}

          {/* Error Overlay */}
          {mapError && (
            <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
              <div className="text-center p-6">
                <div className="text-red-500 mb-2">
                  <FaMapMarkerAlt className="w-8 h-8 mx-auto" />
                </div>
                <p className="text-gray-600 mb-4">{mapError}</p>
                <button
                  onClick={fetchOrderLocations}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-700 bg-blue-100 rounded-md hover:bg-blue-200 transition-colors"
                >
                  <FaMapMarkerAlt className="w-4 h-4 mr-2" />
                  Try Again
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Legend */}
        {locationData && (
          <div className="p-4 bg-gray-50 border-t border-gray-200">
            <div className="flex items-center justify-center space-x-6 text-sm">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-blue-500 rounded-full mr-2"></div>
                <span className="text-gray-600">Rider Location</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
                <span className="text-gray-600">Pickup Location</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-red-500 rounded-full mr-2"></div>
                <span className="text-gray-600">Drop Location</span>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-1 bg-blue-500 mr-2"></div>
                <span className="text-gray-600">Route</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderTrackingModal;
