import React, { useEffect, useState, useRef, useCallback } from 'react';
import { FaTimes, FaMapMarkerAlt, FaRoute, FaSpinner } from 'react-icons/fa';
import OrderService from '../../services/OrderService';
import toastHelper from '../../utils/toastHelper';
import { useCurrentLocation } from '../../hooks/useCurrentLocation';
import { useGoogleMaps } from '../../context/GoogleMapsContext';

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
  const { location: currentLocation, getCurrentLocation } = useCurrentLocation();
  const { isLoaded, loadError } = useGoogleMaps();

  const initializeMap = useCallback(() => {
    if (!mapRef.current || !window.google) return;

    try {
      // Use current location as default center, fallback to Delhi
      const defaultCenter = currentLocation 
        ? { lat: currentLocation.lat, lng: currentLocation.lng }
        : { lat: 28.6139, lng: 77.2090 }; // Delhi coordinates

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
  }, [currentLocation]);

  // Initialize map when modal opens and Google Maps is loaded
  useEffect(() => {
    if (!isOpen) return;

    // Get current location if not already available
    if (!currentLocation) {
      getCurrentLocation();
    }

    // Initialize map when Google Maps is loaded
    if (isLoaded && window.google && window.google.maps) {
      initializeMap();
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current = null;
      }
    };
  }, [isOpen, isLoaded, currentLocation, getCurrentLocation, initializeMap]);

  const plotLocationsOnMap = useCallback((data: LocationData) => {
    if (!mapInstanceRef.current || !window.google) return;

    const map = mapInstanceRef.current;
    
    // Clear existing markers and routes
    // Note: markerClusterer is not available by default, would need to be loaded separately

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
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 16,
            fillColor: '#3B82F6',
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 3,
          },
          label: {
            text: 'R',
            color: 'white',
            fontSize: '12px',
            fontWeight: 'bold',
          },
        });

        // Determine rider direction based on order type
        const riderDirection = data.type === 'pickup' ? 'pickup' : 'drop';
        const directionText = riderDirection === 'pickup' ? 'Moving to Pickup' : 'Moving to Drop';
        const directionIcon = riderDirection === 'pickup' ? '📦' : '🚚';

        const riderInfoWindow = new window.google.maps.InfoWindow({
          content: `
            <div style="
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              min-width: 280px;
              padding: 0;
              border-radius: 12px;
              overflow: hidden;
              box-shadow: 0 10px 25px rgba(0,0,0,0.15);
            ">
              <div style="
                background: linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%);
                color: white;
                padding: 16px;
                position: relative;
              ">
                <div style="
                  display: flex;
                  align-items: center;
                  gap: 12px;
                  margin-bottom: 8px;
                ">
                  <div style="
                    width: 40px;
                    height: 40px;
                    background: rgba(255,255,255,0.2);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 18px;
                  ">🏍️</div>
                  <div>
                    <h3 style="
                      margin: 0;
                      font-size: 16px;
                      font-weight: 600;
                      color: white;
                    ">Rider Location</h3>
                    <p style="
                      margin: 0;
                      font-size: 12px;
                      color: rgba(255,255,255,0.8);
                    ">Live Position</p>
                  </div>
                </div>
                <div style="
                  background: rgba(255,255,255,0.15);
                  padding: 8px 12px;
                  border-radius: 8px;
                  display: flex;
                  align-items: center;
                  gap: 8px;
                ">
                  <span style="font-size: 14px;">${directionIcon}</span>
                  <span style="
                    font-size: 13px;
                    font-weight: 500;
                    color: white;
                  ">${directionText}</span>
                </div>
              </div>
              <div style="padding: 16px; background: white;">
                <div style="margin-bottom: 12px;">
                  <p style="
                    margin: 0 0 4px 0;
                    font-size: 12px;
                    font-weight: 500;
                    color: #6B7280;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                  ">Coordinates</p>
                  <p style="
                    margin: 0;
                    font-size: 13px;
                    font-family: 'Monaco', 'Menlo', monospace;
                    color: #374151;
                    background: #F3F4F6;
                    padding: 6px 8px;
                    border-radius: 6px;
                    border: 1px solid #E5E7EB;
                  ">${riderPosition.lat.toFixed(6)}, ${riderPosition.lng.toFixed(6)}</p>
                </div>
                <div style="
                  display: flex;
                  gap: 8px;
                  margin-top: 12px;
                ">
                  <div style="
                    flex: 1;
                    background: #F0F9FF;
                    padding: 8px;
                    border-radius: 6px;
                    border: 1px solid #BAE6FD;
                    text-align: center;
                  ">
                    <p style="
                      margin: 0;
                      font-size: 11px;
                      color: #0369A1;
                      font-weight: 500;
                    ">Status</p>
                    <p style="
                      margin: 0;
                      font-size: 12px;
                      color: #0C4A6E;
                      font-weight: 600;
                    ">Active</p>
                  </div>
                  <div style="
                    flex: 1;
                    background: #F0FDF4;
                    padding: 8px;
                    border-radius: 6px;
                    border: 1px solid #BBF7D0;
                    text-align: center;
                  ">
                    <p style="
                      margin: 0;
                      font-size: 11px;
                      color: #166534;
                      font-weight: 500;
                    ">Speed</p>
                    <p style="
                      margin: 0;
                      font-size: 12px;
                      color: #14532D;
                      font-weight: 600;
                    ">25 km/h</p>
                  </div>
                </div>
              </div>
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
              path: window.google.maps.SymbolPath.CIRCLE,
              scale: 16,
              fillColor: '#10B981',
              fillOpacity: 1,
              strokeColor: '#ffffff',
              strokeWeight: 3,
            },
            label: {
              text: 'P',
              color: 'white',
              fontSize: '12px',
              fontWeight: 'bold',
            },
          });

          const pickupInfoWindow = new window.google.maps.InfoWindow({
            content: `
              <div style="
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                min-width: 300px;
                padding: 0;
                border-radius: 12px;
                overflow: hidden;
                box-shadow: 0 10px 25px rgba(0,0,0,0.15);
              ">
                <div style="
                  background: linear-gradient(135deg, #10B981 0%, #059669 100%);
                  color: white;
                  padding: 16px;
                  position: relative;
                ">
                  <div style="
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    margin-bottom: 8px;
                  ">
                    <div style="
                      width: 40px;
                      height: 40px;
                      background: rgba(255,255,255,0.2);
                      border-radius: 50%;
                      display: flex;
                      align-items: center;
                      justify-content: center;
                      font-size: 18px;
                    ">📦</div>
                    <div>
                      <h3 style="
                        margin: 0;
                        font-size: 16px;
                        font-weight: 600;
                        color: white;
                      ">Pickup Location</h3>
                      <p style="
                        margin: 0;
                        font-size: 12px;
                        color: rgba(255,255,255,0.8);
                      ">Collection Point</p>
                    </div>
                  </div>
                  <div style="
                    background: rgba(255,255,255,0.15);
                    padding: 8px 12px;
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                  ">
                    <span style="font-size: 14px;">🎯</span>
                    <span style="
                      font-size: 13px;
                      font-weight: 500;
                      color: white;
                    ">Target Destination</span>
                  </div>
                </div>
                <div style="padding: 16px; background: white;">
                  <div style="margin-bottom: 12px;">
                    <p style="
                      margin: 0 0 4px 0;
                      font-size: 12px;
                      font-weight: 500;
                      color: #6B7280;
                      text-transform: uppercase;
                      letter-spacing: 0.5px;
                    ">Address</p>
                    <p style="
                      margin: 0;
                      font-size: 14px;
                      color: #374151;
                      line-height: 1.4;
                      background: #F3F4F6;
                      padding: 8px 12px;
                      border-radius: 6px;
                      border: 1px solid #E5E7EB;
                    ">${data.locations.pickupLocation.address || 'Address not available'}</p>
                  </div>
                  ${data.locations.pickupLocation.person ? `
                    <div style="margin-bottom: 12px;">
                      <p style="
                        margin: 0 0 4px 0;
                        font-size: 12px;
                        font-weight: 500;
                        color: #6B7280;
                        text-transform: uppercase;
                        letter-spacing: 0.5px;
                      ">Contact Person</p>
                      <div style="
                        background: #F0F9FF;
                        padding: 8px 12px;
                        border-radius: 6px;
                        border: 1px solid #BAE6FD;
                      ">
                        <p style="
                          margin: 0 0 2px 0;
                          font-size: 13px;
                          font-weight: 600;
                          color: #0C4A6E;
                        ">${data.locations.pickupLocation.person.name}</p>
                        <p style="
                          margin: 0;
                          font-size: 12px;
                          color: #0369A1;
                          font-family: 'Monaco', 'Menlo', monospace;
                        ">${data.locations.pickupLocation.person.mobile}</p>
                      </div>
                    </div>
                  ` : ''}
                  <div style="margin-bottom: 12px;">
                    <p style="
                      margin: 0 0 4px 0;
                      font-size: 12px;
                      font-weight: 500;
                      color: #6B7280;
                      text-transform: uppercase;
                      letter-spacing: 0.5px;
                    ">Coordinates</p>
                    <p style="
                      margin: 0;
                      font-size: 13px;
                      font-family: 'Monaco', 'Menlo', monospace;
                      color: #374151;
                      background: #F3F4F6;
                      padding: 6px 8px;
                      border-radius: 6px;
                      border: 1px solid #E5E7EB;
                    ">${pickupPosition.lat.toFixed(6)}, ${pickupPosition.lng.toFixed(6)}</p>
                  </div>
                  <div style="
                    display: flex;
                    gap: 8px;
                    margin-top: 12px;
                  ">
                    <div style="
                      flex: 1;
                      background: #F0FDF4;
                      padding: 8px;
                      border-radius: 6px;
                      border: 1px solid #BBF7D0;
                      text-align: center;
                    ">
                      <p style="
                        margin: 0;
                        font-size: 11px;
                        color: #166534;
                        font-weight: 500;
                      ">Status</p>
                      <p style="
                        margin: 0;
                        font-size: 12px;
                        color: #14532D;
                        font-weight: 600;
                      ">Pending</p>
                    </div>
                    <div style="
                      flex: 1;
                      background: #FEF3C7;
                      padding: 8px;
                      border-radius: 6px;
                      border: 1px solid #FDE68A;
                      text-align: center;
                    ">
                      <p style="
                        margin: 0;
                        font-size: 11px;
                        color: #92400E;
                        font-weight: 500;
                      ">Priority</p>
                      <p style="
                        margin: 0;
                        font-size: 12px;
                        color: #78350F;
                        font-weight: 600;
                      ">High</p>
                    </div>
                  </div>
                </div>
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
                path: window.google.maps.SymbolPath.CIRCLE,
                scale: 16,
                fillColor: '#EF4444',
                fillOpacity: 1,
                strokeColor: '#ffffff',
                strokeWeight: 3,
              },
              label: {
                text: 'D',
                color: 'white',
                fontSize: '12px',
                fontWeight: 'bold',
              },
            });

            const dropInfoWindow = new window.google.maps.InfoWindow({
              content: `
                <div style="
                  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                  min-width: 300px;
                  padding: 0;
                  border-radius: 12px;
                  overflow: hidden;
                  box-shadow: 0 10px 25px rgba(0,0,0,0.15);
                ">
                  <div style="
                    background: linear-gradient(135deg, #EF4444 0%, #DC2626 100%);
                    color: white;
                    padding: 16px;
                    position: relative;
                  ">
                    <div style="
                      display: flex;
                      align-items: center;
                      gap: 12px;
                      margin-bottom: 8px;
                    ">
                      <div style="
                        width: 40px;
                        height: 40px;
                        background: rgba(255,255,255,0.2);
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 18px;
                      ">🏠</div>
                      <div>
                        <h3 style="
                          margin: 0;
                          font-size: 16px;
                          font-weight: 600;
                          color: white;
                        ">Drop Location ${index + 1}</h3>
                        <p style="
                          margin: 0;
                          font-size: 12px;
                          color: rgba(255,255,255,0.8);
                        ">Delivery Point</p>
                      </div>
                    </div>
                    <div style="
                      background: rgba(255,255,255,0.15);
                      padding: 8px 12px;
                      border-radius: 8px;
                      display: flex;
                      align-items: center;
                      gap: 8px;
                    ">
                      <span style="font-size: 14px;">${dropLocation.isDelivered ? '✅' : '⏳'}</span>
                      <span style="
                        font-size: 13px;
                        font-weight: 500;
                        color: white;
                      ">${dropLocation.isDelivered ? 'Delivered' : 'Pending Delivery'}</span>
                    </div>
                  </div>
                  <div style="padding: 16px; background: white;">
                    <div style="margin-bottom: 12px;">
                      <p style="
                        margin: 0 0 4px 0;
                        font-size: 12px;
                        font-weight: 500;
                        color: #6B7280;
                        text-transform: uppercase;
                        letter-spacing: 0.5px;
                      ">Address</p>
                      <p style="
                        margin: 0;
                        font-size: 14px;
                        color: #374151;
                        line-height: 1.4;
                        background: #F3F4F6;
                        padding: 8px 12px;
                        border-radius: 6px;
                        border: 1px solid #E5E7EB;
                      ">${dropLocation.address || 'Address not available'}</p>
                    </div>
                    ${dropLocation.person ? `
                      <div style="margin-bottom: 12px;">
                        <p style="
                          margin: 0 0 4px 0;
                          font-size: 12px;
                          font-weight: 500;
                          color: #6B7280;
                          text-transform: uppercase;
                          letter-spacing: 0.5px;
                        ">Contact Person</p>
                        <div style="
                          background: #FEF2F2;
                          padding: 8px 12px;
                          border-radius: 6px;
                          border: 1px solid #FECACA;
                        ">
                          <p style="
                            margin: 0 0 2px 0;
                            font-size: 13px;
                            font-weight: 600;
                            color: #991B1B;
                          ">${dropLocation.person.name}</p>
                          <p style="
                            margin: 0;
                            font-size: 12px;
                            color: #DC2626;
                            font-family: 'Monaco', 'Menlo', monospace;
                          ">${dropLocation.person.mobile}</p>
                        </div>
                      </div>
                    ` : ''}
                    <div style="margin-bottom: 12px;">
                      <p style="
                        margin: 0 0 4px 0;
                        font-size: 12px;
                        font-weight: 500;
                        color: #6B7280;
                        text-transform: uppercase;
                        letter-spacing: 0.5px;
                      ">Coordinates</p>
                      <p style="
                        margin: 0;
                        font-size: 13px;
                        font-family: 'Monaco', 'Menlo', monospace;
                        color: #374151;
                        background: #F3F4F6;
                        padding: 6px 8px;
                        border-radius: 6px;
                        border: 1px solid #E5E7EB;
                      ">${dropPosition.lat.toFixed(6)}, ${dropPosition.lng.toFixed(6)}</p>
                    </div>
                    <div style="
                      display: flex;
                      gap: 8px;
                      margin-top: 12px;
                    ">
                      <div style="
                        flex: 1;
                        background: ${dropLocation.isDelivered ? '#F0FDF4' : '#FEF2F2'};
                        padding: 8px;
                        border-radius: 6px;
                        border: 1px solid ${dropLocation.isDelivered ? '#BBF7D0' : '#FECACA'};
                        text-align: center;
                      ">
                        <p style="
                          margin: 0;
                          font-size: 11px;
                          color: ${dropLocation.isDelivered ? '#166534' : '#991B1B'};
                          font-weight: 500;
                        ">Status</p>
                        <p style="
                          margin: 0;
                          font-size: 12px;
                          color: ${dropLocation.isDelivered ? '#14532D' : '#DC2626'};
                          font-weight: 600;
                        ">${dropLocation.isDelivered ? 'Delivered' : 'Pending'}</p>
                      </div>
                      <div style="
                        flex: 1;
                        background: #FEF3C7;
                        padding: 8px;
                        border-radius: 6px;
                        border: 1px solid #FDE68A;
                        text-align: center;
                      ">
                        <p style="
                          margin: 0;
                          font-size: 11px;
                          color: #92400E;
                          font-weight: 500;
                        ">Sequence</p>
                        <p style="
                          margin: 0;
                          font-size: 12px;
                          color: #78350F;
                          font-weight: 600;
                        ">#${index + 1}</p>
                      </div>
                    </div>
                  </div>
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
  }, []);

  const fetchOrderLocations = useCallback(async () => {
    if (!orderId) return;

    setLoading(true);
    setMapError(null);

    try {
      const response = await OrderService.getOrderLocations({ orderId });
      
      if (response && response.status === 200 && response.data) {
        setLocationData(response.data);
        // Only plot locations if map is initialized
        if (mapInstanceRef.current) {
          plotLocationsOnMap(response.data);
        }
      } else {
        const errorMessage = response ? response.message : 'Failed to fetch order locations';
        toastHelper.error(errorMessage);
        setMapError(errorMessage);
      }
    } catch (error: any) {
      console.error('Error fetching order locations:', error);
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to fetch order locations';
      toastHelper.error(errorMessage);
      setMapError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [orderId, plotLocationsOnMap]);

  const drawRoute = (data: LocationData) => {
    if (!mapInstanceRef.current || !window.google) return;

    const map = mapInstanceRef.current;
    const directionsService = new window.google.maps.DirectionsService();
    
    // Clear any existing routes
    const existingRoutes = document.querySelectorAll('.route-polyline');
    existingRoutes.forEach(route => route.remove());

    try {
      let origin: any = null;
      let destination: any = null;
      let routeColor = '#3B82F6';
      let routeType = '';

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
        routeColor = '#10B981'; // Green for pickup route
        routeType = 'pickup';
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
        routeColor = '#EF4444'; // Red for drop route
        routeType = 'drop';
      }

      if (origin && destination) {
        const directionsRenderer = new window.google.maps.DirectionsRenderer({
          suppressMarkers: true, // We'll use our custom markers
          polylineOptions: {
            strokeColor: routeColor,
            strokeWeight: 5,
            strokeOpacity: 0.8,
          },
        });

        directionsRenderer.setMap(map);

        directionsService.route(
          {
            origin: origin,
            destination: destination,
            travelMode: window.google.maps.TravelMode.DRIVING,
            avoidHighways: false,
            avoidTolls: false,
          },
          (result: any, status: any) => {
            if (status === window.google.maps.DirectionsStatus.OK) {
              directionsRenderer.setDirections(result);
              
              // Add route info to the map
              const route = result.routes[0];
              const leg = route.legs[0];
              
              // Create a custom info window for route details
              const routeInfoWindow = new window.google.maps.InfoWindow({
                content: `
                  <div style="
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    padding: 12px;
                    min-width: 200px;
                  ">
                    <div style="
                      display: flex;
                      align-items: center;
                      gap: 8px;
                      margin-bottom: 8px;
                    ">
                      <div style="
                        width: 24px;
                        height: 24px;
                        background: ${routeColor};
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        color: white;
                        font-size: 12px;
                        font-weight: bold;
                      ">${routeType === 'pickup' ? 'P' : 'D'}</div>
                      <h4 style="
                        margin: 0;
                        font-size: 14px;
                        font-weight: 600;
                        color: #374151;
                      ">${routeType === 'pickup' ? 'To Pickup' : 'To Drop'}</h4>
                    </div>
                    <div style="
                      background: #F3F4F6;
                      padding: 8px;
                      border-radius: 6px;
                      border: 1px solid #E5E7EB;
                    ">
                      <p style="
                        margin: 0 0 4px 0;
                        font-size: 12px;
                        color: #6B7280;
                        font-weight: 500;
                      ">Distance</p>
                      <p style="
                        margin: 0 0 8px 0;
                        font-size: 13px;
                        color: #374151;
                        font-weight: 600;
                      ">${leg.distance.text}</p>
                      <p style="
                        margin: 0 0 4px 0;
                        font-size: 12px;
                        color: #6B7280;
                        font-weight: 500;
                      ">Duration</p>
                      <p style="
                        margin: 0;
                        font-size: 13px;
                        color: #374151;
                        font-weight: 600;
                      ">${leg.duration.text}</p>
                    </div>
                  </div>
                `,
              });

              // Position the info window at the midpoint of the route
              const midpoint = new window.google.maps.LatLng(
                (origin.lat() + destination.lat()) / 2,
                (origin.lng() + destination.lng()) / 2
              );
              
              routeInfoWindow.setPosition(midpoint);
              routeInfoWindow.open(map);
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
  }, [isOpen, orderId, fetchOrderLocations]);

  // Plot locations when map is initialized and data is available
  useEffect(() => {
    if (mapInstanceRef.current && locationData && isLoaded) {
      plotLocationsOnMap(locationData);
    }
  }, [locationData, isLoaded, plotLocationsOnMap]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-7xl max-h-[95vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold text-white flex items-center">
                <FaRoute className="w-5 h-5 mr-2" />
                Order Tracking
              </h2>
              {orderNo && (
                <p className="text-blue-100 text-sm mt-1">Order #{orderNo}</p>
              )}
              {locationData && (
                <div className="flex items-center space-x-4 mt-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                    <span className="text-blue-100 text-xs">Rider Location</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    <span className="text-blue-100 text-xs">Pickup Point</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <span className="text-blue-100 text-xs">Drop Point</span>
                  </div>
                </div>
              )}
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={fetchOrderLocations}
                disabled={loading}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-700 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-colors disabled:opacity-50"
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
                className="text-white/80 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Map Container */}
        <div className="relative">
          <div
            ref={mapRef}
            className="w-full h-[700px] bg-gray-100"
            style={{ minHeight: '700px' }}
          />
          
          {/* Google Maps Loading Overlay */}
          {!isLoaded && (
            <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
              <div className="text-center">
                <FaSpinner className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-2" />
                <p className="text-gray-600">Loading Google Maps...</p>
              </div>
            </div>
          )}

          {/* Google Maps Error Overlay */}
          {loadError && (
            <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
              <div className="text-center p-6">
                <div className="text-red-500 mb-2">
                  <FaMapMarkerAlt className="w-8 h-8 mx-auto" />
                </div>
                <p className="text-gray-600 mb-4">{loadError.message}</p>
              </div>
            </div>
          )}
          
          {/* Loading Overlay */}
          {loading && isLoaded && (
            <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
              <div className="text-center">
                <FaSpinner className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-2" />
                <p className="text-gray-600">Loading order locations...</p>
              </div>
            </div>
          )}

          {/* Error Overlay */}
          {mapError && isLoaded && (
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

        {/* Enhanced Legend */}
        {locationData && (
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-8 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-sm"></div>
                  <span className="text-gray-700 font-medium">Rider Location</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-sm"></div>
                  <span className="text-gray-700 font-medium">Pickup Location</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow-sm"></div>
                  <span className="text-gray-700 font-medium">Drop Location</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-1 bg-gradient-to-r from-green-500 to-red-500 rounded-full"></div>
                  <span className="text-gray-700 font-medium">Route Path</span>
                </div>
              </div>
              <div className="flex items-center space-x-4 text-xs text-gray-600">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>To Pickup</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span>To Drop</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              {locationData && (
                <span>
                  Tracking {locationData.type === 'pickup' ? 'pickup' : 'delivery'} route • 
                  Last updated: {new Date().toLocaleTimeString()}
                </span>
              )}
            </div>
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTrackingModal;
