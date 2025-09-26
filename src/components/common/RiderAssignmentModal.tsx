import React, { useState, useEffect } from 'react';
import { FaTimes, FaUser, FaPhone, FaMotorcycle, FaSearch, FaCheckCircle, FaClock } from 'react-icons/fa';
import RiderService, { Rider } from '../../services/RiderService';
import toastHelper from '../../utils/toastHelper';

interface RiderAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAssign: (riderId: string) => void;
  orderId: string;
  currentRiderId?: string;
}

const RiderAssignmentModal: React.FC<RiderAssignmentModalProps> = ({
  isOpen,
  onClose,
  onAssign,
  // orderId,
  currentRiderId,
}) => {
  const [riders, setRiders] = useState<Rider[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRiderId, setSelectedRiderId] = useState<string>('');
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (isOpen) {
      setSelectedRiderId(currentRiderId || '');
      fetchRiders();
    }
  }, [isOpen, currentRiderId]);

  const fetchRiders = async () => {
    setLoading(true);
    try {
      const response = await RiderService.getRiders({
        page: 1,
        limit: 100,
        search: '',
      });

      if (response && response.data) {
        // Filter only active riders (removed verified check since riders might not be verified yet)
        const activeRiders = response.data.docs.filter(
          (rider: Rider) => rider.isActive
        );
        setRiders(activeRiders);
      }
    } catch (error) {
      console.error('Error fetching riders:', error);
      toastHelper.error('Failed to fetch riders');
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = () => {
    if (!selectedRiderId) {
      toastHelper.error('Please select a rider');
      return;
    }

    onAssign(selectedRiderId);
    onClose();
  };

  // Helper function to convert text to title case
  const toTitleCase = (str: string) => {
    return str.replace(/\w\S*/g, (txt) => 
      txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
  };

  // Handle image error
  const handleImageError = (riderId: string) => {
    setImageErrors(prev => new Set(prev).add(riderId));
  };

  // Check if there are any riders available
  if (riders.length === 0 && !loading) {
    return (
      <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 w-full max-w-md mx-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaUser className="w-8 h-8 text-gray-400 dark:text-gray-300" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">No Riders Available</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">There are no active riders available for assignment at the moment.</p>
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-gray-600 dark:bg-gray-500 text-white rounded-lg hover:bg-gray-700 dark:hover:bg-gray-400 transition-colors font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  const filteredRiders = riders.filter(rider =>
    rider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rider.mobile.includes(searchTerm)
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gray-900 dark:bg-gray-700 px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold text-white dark:text-gray-100">
                {currentRiderId ? 'Reassign Rider' : 'Assign Rider'}
              </h2>
              <p className="text-gray-300 dark:text-gray-400 text-sm mt-1">
                {currentRiderId ? 'Select a new rider for this order' : 'Choose a rider to assign to this order'}
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

          {/* Search */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Search Riders
            </label>
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by name or mobile number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
            </div>
          </div>

          {/* Riders List */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Available Riders</h3>
            
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto"></div>
                <p className="text-gray-500 dark:text-gray-400 mt-3 font-medium">Loading riders...</p>
              </div>
            ) : filteredRiders.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaUser className="w-8 h-8 text-gray-400 dark:text-gray-300" />
                </div>
                <p className="text-gray-500 dark:text-gray-400 font-medium">No riders found matching your search</p>
                <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">Try adjusting your search terms</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {filteredRiders.map((rider) => (
                  <div
                    key={rider._id}
                    className={`border-2 rounded-xl p-4 cursor-pointer transition-all duration-200 ${
                      selectedRiderId === rider._id
                        ? 'border-gray-600 dark:border-gray-400 bg-gray-50 dark:bg-gray-700 shadow-md'
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 hover:shadow-sm'
                    }`}
                    onClick={() => setSelectedRiderId(rider._id || '')}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className="relative">
                          <input
                            type="radio"
                            name="rider"
                            value={rider._id}
                            checked={selectedRiderId === rider._id}
                            onChange={() => setSelectedRiderId(rider._id || '')}
                            className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                      
                      <div className="flex-shrink-0">
                        {rider.image && !imageErrors.has(rider._id || '') ? (
                          <img
                            src={`${import.meta.env.VITE_BASE_URL}/${rider.image}`}
                            alt={rider.name}
                            className="w-14 h-14 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600"
                            onError={() => handleImageError(rider._id || '')}
                          />
                        ) : (
                          <div className="w-14 h-14 bg-gray-100 dark:bg-gray-600 rounded-full flex items-center justify-center border-2 border-gray-200 dark:border-gray-600">
                            <FaUser className="w-7 h-7 text-gray-500 dark:text-gray-300" />
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="min-w-0 flex-1">
                            <h4 className="text-base font-semibold text-gray-900 dark:text-white truncate">
                              {rider.name}
                            </h4>
                            <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mt-1">
                              <span className="flex items-center">
                                <FaPhone className="w-3 h-3 mr-2 text-gray-400 dark:text-gray-500" />
                                {rider.mobile}
                              </span>
                              {rider.vehicleName && (
                                <span className="flex items-center">
                                  <FaMotorcycle className="w-3 h-3 mr-2 text-gray-400 dark:text-gray-500" />
                                  {toTitleCase(rider.vehicleName)}
                                </span>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex flex-col items-end space-y-2 ml-4">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-600 text-gray-800 dark:text-gray-200">
                              <FaCheckCircle className="w-3 h-3 mr-1" />
                              Available
                            </span>
                            {rider.isVerified ? (
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-600 text-gray-800 dark:text-gray-200">
                                <FaCheckCircle className="w-3 h-3 mr-1" />
                                Verified
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-600 text-gray-800 dark:text-gray-200">
                                <FaClock className="w-3 h-3 mr-1" />
                                Pending
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 border-t border-gray-200 dark:border-gray-600">
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-6 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleAssign}
              disabled={!selectedRiderId}
              className="px-6 py-2.5 bg-gray-600 dark:bg-gray-500 text-white rounded-lg hover:bg-gray-700 dark:hover:bg-gray-400 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors font-medium shadow-sm"
            >
              {currentRiderId ? 'Reassign Rider' : 'Assign Rider'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiderAssignmentModal;
