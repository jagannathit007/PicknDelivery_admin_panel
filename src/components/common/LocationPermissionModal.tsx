import React from 'react';
import { FaMapMarkerAlt, FaTimes, FaExclamationTriangle } from 'react-icons/fa';

interface LocationPermissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAllow: () => void;
  error?: string | null;
}

const LocationPermissionModal: React.FC<LocationPermissionModalProps> = ({
  isOpen,
  onClose,
  onAllow,
  error,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-black dark:text-white">
            Location Access Required
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <FaTimes />
          </button>
        </div>

        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
              <FaMapMarkerAlt className="text-blue-600 dark:text-blue-400 text-2xl" />
            </div>
          </div>
          
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            To provide you with the best experience, we need access to your current location. 
            This helps us center the map on your location and show nearby riders.
          </p>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 mb-4">
              <div className="flex items-center text-red-600 dark:text-red-400">
                <FaExclamationTriangle className="mr-2" />
                <span className="text-sm">{error}</span>
              </div>
            </div>
          )}

          <div className="text-sm text-gray-500 dark:text-gray-400">
            <p>• Your location is stored locally and used only for map centering</p>
            <p>• We don't share your location with third parties</p>
            <p>• You can revoke access anytime in your browser settings</p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Skip for Now
          </button>
          <button
            onClick={onAllow}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Allow Location
          </button>
        </div>
      </div>
    </div>
  );
};

export default LocationPermissionModal;
