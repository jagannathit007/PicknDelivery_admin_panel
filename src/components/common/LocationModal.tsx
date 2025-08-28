import React from 'react';
import { FaMapMarkerAlt, FaTimes, FaExternalLinkAlt } from 'react-icons/fa';

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  pickupLocation: {
    block: string;
    address: string;
    coordinates: string[];
    person: {
      name: string;
      mobile: string;
    };
  };
  dropLocation: {
    block: string;
    address: string;
    coordinates: string[];
    person: {
      name: string;
      mobile: string;
    };
  };
}

const LocationModal: React.FC<LocationModalProps> = ({
  isOpen,
  onClose,
  pickupLocation,
  dropLocation,
}) => {
  if (!isOpen) return null;

  const openGoogleMaps = (coordinates: string[]) => {
    if (coordinates.length >= 2) {
      const [lat, lng] = coordinates;
      const url = `https://www.google.com/maps?q=${lat},${lng}`;
      window.open(url, '_blank');
    }
  };

  const formatCoordinates = (coordinates: string[]) => {
    if (coordinates.length >= 2) {
      return `${coordinates[0]}, ${coordinates[1]}`;
    }
    return 'Coordinates not available';
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Order Locations</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        {/* Timeline Container */}
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-blue-500"></div>

          {/* Pickup Location */}
          <div className="relative mb-8">
            {/* Pickup Icon */}
            <div className="absolute left-4 top-0 w-4 h-4 bg-green-500 rounded-full border-4 border-white shadow-lg z-10"></div>
            
            <div className="ml-16">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-green-800 flex items-center">
                    <FaMapMarkerAlt className="w-5 h-5 mr-2" />
                    Pickup Location
                  </h3>
                  <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    Pickup
                  </span>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Address</p>
                    <p className="text-gray-800">{pickupLocation.address}</p>
                    {pickupLocation.block && (
                      <p className="text-sm text-gray-600 mt-1">Block: {pickupLocation.block}</p>
                    )}
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-600">Contact Person</p>
                    <p className="text-gray-800">{pickupLocation.person.name}</p>
                    <p className="text-sm text-gray-600">{pickupLocation.person.mobile}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-600">Coordinates</p>
                    <p className="text-sm text-gray-600 font-mono">{formatCoordinates(pickupLocation.coordinates)}</p>
                    <button
                      onClick={() => openGoogleMaps(pickupLocation.coordinates)}
                      className="mt-2 inline-flex items-center px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-100 rounded-md hover:bg-blue-200 transition-colors"
                    >
                      <FaExternalLinkAlt className="w-3 h-3 mr-1" />
                      Open in Google Maps
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Drop Location */}
          <div className="relative">
            {/* Drop Icon */}
            <div className="absolute left-4 top-0 w-4 h-4 bg-red-500 rounded-full border-4 border-white shadow-lg z-10"></div>
            
            <div className="ml-16">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-red-800 flex items-center">
                    <FaMapMarkerAlt className="w-5 h-5 mr-2" />
                    Drop Location
                  </h3>
                  <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    Drop
                  </span>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Address</p>
                    <p className="text-gray-800">{dropLocation.address}</p>
                    {dropLocation.block && (
                      <p className="text-sm text-gray-600 mt-1">Block: {dropLocation.block}</p>
                    )}
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-600">Contact Person</p>
                    <p className="text-gray-800">{dropLocation.person.name}</p>
                    <p className="text-sm text-gray-600">{dropLocation.person.mobile}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-600">Coordinates</p>
                    <p className="text-sm text-gray-600 font-mono">{formatCoordinates(dropLocation.coordinates)}</p>
                    <button
                      onClick={() => openGoogleMaps(dropLocation.coordinates)}
                      className="mt-2 inline-flex items-center px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-100 rounded-md hover:bg-blue-200 transition-colors"
                    >
                      <FaExternalLinkAlt className="w-3 h-3 mr-1" />
                      Open in Google Maps
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        {/* <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
          >
            Close
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default LocationModal;
