import React, { useState } from 'react';
import { FaMapMarkerAlt, FaTimes, FaExternalLinkAlt, FaCopy, FaPhone, FaUser, FaMapPin, FaCheck } from 'react-icons/fa';

interface Location {
  block?: string;
  address: string;
  coordinates: string[];
  person: {
    name: string;
    mobile: string;
  };
  _id?: string;
}

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  pickupLocation: Location;
  dropLocation: Location[];
}

const LocationModal: React.FC<LocationModalProps> = ({
  isOpen,
  onClose,
  pickupLocation,
  dropLocation,
}) => {
  const [copiedItems, setCopiedItems] = useState<Set<string>>(new Set());

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

  const copyToClipboard = async (text: string, itemId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedItems(prev => new Set(prev).add(itemId));
      setTimeout(() => {
        setCopiedItems(prev => {
          const newSet = new Set(prev);
          newSet.delete(itemId);
          return newSet;
        });
      }, 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gray-900 dark:bg-gray-700 px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold text-white dark:text-gray-100 flex items-center">
                <FaMapPin className="w-5 h-5 mr-2" />
                Order Locations
              </h2>
              <p className="text-gray-300 dark:text-gray-400 text-sm mt-1">
                Pickup and delivery locations for this order
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-300 dark:text-gray-400 hover:text-white dark:hover:text-gray-100 transition-colors p-2 hover:bg-white/10 dark:hover:bg-gray-600 rounded-lg"
            >
              <FaTimes className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">

          {/* Timeline Container */}
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-8 top-0 bottom-0 w-1 bg-gray-300 dark:bg-gray-600 rounded-full"></div>

            {/* Pickup Location */}
            <div className="relative mb-8">
              {/* Pickup Icon */}
              <div className="absolute left-4 top-2 w-8 h-8 bg-gray-600 dark:bg-gray-500 rounded-full border-4 border-white dark:border-gray-800 shadow-lg z-10 flex items-center justify-center">
                <FaMapMarkerAlt className="w-4 h-4 text-white" />
              </div>
              
              <div className="ml-20">
                <div className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                      <FaMapMarkerAlt className="w-5 h-5 mr-2" />
                      Pickup Location
                    </h3>
                    <span className="bg-gray-600 dark:bg-gray-500 text-white text-xs font-medium px-3 py-1 rounded-full">
                      Pickup
                    </span>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Address</p>
                          <p className="text-gray-800 dark:text-gray-200 leading-relaxed">{pickupLocation.address}</p>
                          {pickupLocation.block && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                              <span className="font-medium">Block:</span> {pickupLocation.block}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Contact Person</p>
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gray-100 dark:bg-gray-600 rounded-full flex items-center justify-center">
                          <FaUser className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                        </div>
                        <div className="flex-1">
                          <p className="text-gray-800 dark:text-gray-200 font-medium">{pickupLocation.person.name}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <FaPhone className="w-3 h-3 text-gray-400 dark:text-gray-500" />
                            <span className="text-sm text-gray-600 dark:text-gray-400">{pickupLocation.person.mobile}</span>
                            <button
                              onClick={() => copyToClipboard(pickupLocation.person.mobile, `pickup-phone-${pickupLocation._id}`)}
                              className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                              title="Copy phone number"
                            >
                              {copiedItems.has(`pickup-phone-${pickupLocation._id}`) ? (
                                <FaCheck className="w-3 h-3 text-green-500 dark:text-green-400" />
                              ) : (
                                <FaCopy className="w-3 h-3" />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Coordinates</p>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-600 dark:text-gray-400 font-mono bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded border border-gray-200 dark:border-gray-600">
                          {formatCoordinates(pickupLocation.coordinates)}
                        </p>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => copyToClipboard(formatCoordinates(pickupLocation.coordinates), `pickup-coords-${pickupLocation._id}`)}
                            className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-2"
                            title="Copy coordinates"
                          >
                            {copiedItems.has(`pickup-coords-${pickupLocation._id}`) ? (
                              <FaCheck className="w-4 h-4 text-green-500 dark:text-green-400" />
                            ) : (
                              <FaCopy className="w-4 h-4" />
                            )}
                          </button>
                          <button
                            onClick={() => openGoogleMaps(pickupLocation.coordinates)}
                            className="inline-flex items-center px-3 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-600 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors"
                          >
                            <FaExternalLinkAlt className="w-3 h-3 mr-1" />
                            Open in Maps
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Drop Locations */}
            {dropLocation.map((location, index) => (
              <div key={location._id || index} className="relative mb-8">
                {/* Drop Icon */}
                <div className="absolute left-4 top-2 w-8 h-8 bg-gray-600 dark:bg-gray-500 rounded-full border-4 border-white dark:border-gray-800 shadow-lg z-10 flex items-center justify-center">
                  <FaMapMarkerAlt className="w-4 h-4 text-white" />
                </div>
                
                <div className="ml-20">
                  <div className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                        <FaMapMarkerAlt className="w-5 h-5 mr-2" />
                        Drop Location {index + 1}
                      </h3>
                      <span className="bg-gray-600 dark:bg-gray-500 text-white text-xs font-medium px-3 py-1 rounded-full">
                        Drop
                      </span>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Address</p>
                            <p className="text-gray-800 dark:text-gray-200 leading-relaxed">{location.address}</p>
                            {location.block && (
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                                <span className="font-medium">Block:</span> {location.block}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Contact Person</p>
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gray-100 dark:bg-gray-600 rounded-full flex items-center justify-center">
                            <FaUser className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                          </div>
                          <div className="flex-1">
                            <p className="text-gray-800 dark:text-gray-200 font-medium">{location.person.name}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <FaPhone className="w-3 h-3 text-gray-400 dark:text-gray-500" />
                              <span className="text-sm text-gray-600 dark:text-gray-400">{location.person.mobile}</span>
                              <button
                                onClick={() => copyToClipboard(location.person.mobile, `drop-phone-${location._id || index}`)}
                                className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                                title="Copy phone number"
                              >
                                {copiedItems.has(`drop-phone-${location._id || index}`) ? (
                                  <FaCheck className="w-3 h-3 text-green-500 dark:text-green-400" />
                                ) : (
                                  <FaCopy className="w-3 h-3" />
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Coordinates</p>
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-gray-600 dark:text-gray-400 font-mono bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded border border-gray-200 dark:border-gray-600">
                            {formatCoordinates(location.coordinates)}
                          </p>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => copyToClipboard(formatCoordinates(location.coordinates), `drop-coords-${location._id || index}`)}
                              className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-2"
                              title="Copy coordinates"
                            >
                              {copiedItems.has(`drop-coords-${location._id || index}`) ? (
                                <FaCheck className="w-4 h-4 text-green-500 dark:text-green-400" />
                              ) : (
                                <FaCopy className="w-4 h-4" />
                              )}
                            </button>
                            <button
                              onClick={() => openGoogleMaps(location.coordinates)}
                              className="inline-flex items-center px-3 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-600 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors"
                            >
                              <FaExternalLinkAlt className="w-3 h-3 mr-1" />
                              Open in Maps
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 border-t border-gray-200 dark:border-gray-600">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-gray-600 dark:bg-gray-500 text-white rounded-lg hover:bg-gray-700 dark:hover:bg-gray-400 transition-colors font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationModal;