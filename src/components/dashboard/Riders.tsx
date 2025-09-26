
import React, { useState, useEffect } from 'react';
import LiveRidersMap from '../ecommerce/LiveRidersMap';
import RiderService, { Rider } from '../../services/RiderService';
import toastHelper from '../../utils/toastHelper';

interface LiveRider extends Rider {
  coordinates: [number, number] | { lat: number; lng: number };
}

const LiveRiders: React.FC = () => {
  const [riders, setRiders] = useState<LiveRider[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLiveRiders = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await RiderService.getRiders({ page: 1, limit: 100 });
      
      if (response && response.status === 200 && response.data) {
        // Filter only active riders for the live map and add mock coordinates for demo
        const activeRiders: LiveRider[] = response.data.docs
          .filter(rider => rider.isActive && rider.isDuty)
          .map((rider) => ({
            ...rider,
            coordinates: [
              28.6139 + (Math.random() - 0.5) * 0.1, // Delhi area with some randomness
              77.2090 + (Math.random() - 0.5) * 0.1
            ]
          }));
        setRiders(activeRiders);
      } else {
        const errorMessage = response ? response.message : 'Failed to fetch live riders';
        toastHelper.error(errorMessage);
        setError(errorMessage);
      }
    } catch (error: any) {
      console.error('Error fetching live riders:', error);
      const errorMessage = 'Failed to fetch live riders';
      toastHelper.error(errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveRiders();
    
    // Refresh riders every 30 seconds
    const interval = setInterval(fetchLiveRiders, 30000);
    
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-default p-6">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
            <p className="text-gray-600">Loading live riders...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-default p-6">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <p className="text-red-600 mb-2">Failed to load riders</p>
            <p className="text-gray-600 text-sm mb-4">{error}</p>
            <button
              onClick={fetchLiveRiders}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-700 bg-blue-100 rounded-md hover:bg-blue-200 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Live Riders
        </h1>
        <button
          onClick={fetchLiveRiders}
          disabled={loading}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-700 bg-blue-100 rounded-md hover:bg-blue-200 transition-colors disabled:opacity-50"
        >
          {loading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-2"></div>
          ) : null}
          Refresh
        </button>
      </div>
      
      <LiveRidersMap riders={riders} />
    </div>
  );
};

export default LiveRiders;
