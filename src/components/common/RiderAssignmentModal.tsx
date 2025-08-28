import React, { useState, useEffect } from 'react';
import { FaTimes, FaUser, FaPhone, FaMotorcycle } from 'react-icons/fa';
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
  orderId,
  currentRiderId,
}) => {
  const [riders, setRiders] = useState<Rider[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRiderId, setSelectedRiderId] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      setSelectedRiderId(currentRiderId || '');
      fetchRiders();
    }
  }, [isOpen]);

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

  // Check if there are any riders available
  if (riders.length === 0 && !loading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">No Riders Available</h2>
            <p className="text-gray-600 mb-6">There are no active riders available for assignment.</p>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">
            {currentRiderId ? 'Reassign Rider' : 'Assign Rider'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search riders by name or mobile..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Riders List */}
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-700 mb-3">Available Riders</h3>
          
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
              <p className="text-gray-500 mt-2">Loading riders...</p>
            </div>
          ) : filteredRiders.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No riders found
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredRiders.map((rider) => (
                <div
                  key={rider._id}
                  className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                    selectedRiderId === rider._id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedRiderId(rider._id || '')}
                >
                  <div className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="rider"
                      value={rider._id}
                      checked={selectedRiderId === rider._id}
                      onChange={() => setSelectedRiderId(rider._id || '')}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    
                    <div className="flex-shrink-0">
                      {rider.image ? (
                        <img
                          src={`${import.meta.env.VITE_BASE_URL}/${rider.image}`}
                          alt={rider.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                          <FaUser className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {rider.name}
                          </p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span className="flex items-center">
                              <FaPhone className="w-3 h-3 mr-1" />
                              {rider.mobile}
                            </span>
                            {rider.vehicleName && (
                              <span className="flex items-center">
                                <FaMotorcycle className="w-3 h-3 mr-1" />
                                {rider.vehicleName}
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex flex-col items-end space-y-1">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Available
                          </span>
                          {rider.isVerified ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              Verified
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              Pending Verification
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

        {/* Footer */}
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleAssign}
            disabled={!selectedRiderId}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {currentRiderId ? 'Reassign' : 'Assign'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RiderAssignmentModal;
