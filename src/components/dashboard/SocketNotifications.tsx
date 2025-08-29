import React, { useState, useEffect } from 'react';
import { useSocketConnection } from '../../hooks/useSocketConnection';

interface Notification {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: Date;
}

const SocketNotifications: React.FC = () => {
  const { isConnected, socket } = useSocketConnection();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (!socket) return;

    // Listen for real-time notifications
    const handleMessage = (data: any) => {
      const newNotification: Notification = {
        id: Date.now().toString(),
        message: data.message || 'New notification received',
        type: 'info',
        timestamp: new Date(),
      };
      
      setNotifications(prev => [newNotification, ...prev.slice(0, 4)]); // Keep only last 5
    };

    const handleOrderUpdate = (data: any) => {
      const newNotification: Notification = {
        id: Date.now().toString(),
        message: `Order update: ${data.orderId || 'Unknown order'}`,
        type: 'success',
        timestamp: new Date(),
      };
      
      setNotifications(prev => [newNotification, ...prev.slice(0, 4)]);
    };

    const handleRiderUpdate = (data: any) => {
      const newNotification: Notification = {
        id: Date.now().toString(),
        message: `Rider update: ${data.riderId || 'Unknown rider'}`,
        type: 'warning',
        timestamp: new Date(),
      };
      
      setNotifications(prev => [newNotification, ...prev.slice(0, 4)]);
    };

    // Add event listeners
    socket.on('message', handleMessage);
    socket.on('orderUpdate', handleOrderUpdate);
    socket.on('riderUpdate', handleRiderUpdate);

    // Cleanup
    return () => {
      socket.off('message', handleMessage);
      socket.off('orderUpdate', handleOrderUpdate);
      socket.off('riderUpdate', handleRiderUpdate);
    };
  }, [socket]);

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getTypeStyles = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'error':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  if (!isConnected) {
    return (
      <div className="bg-gray-100 border border-gray-200 rounded-lg p-4">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
          <span className="text-sm text-gray-600">Socket disconnected</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-800">Real-time Notifications</h3>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-sm text-green-600">Live</span>
        </div>
      </div>
      
      {notifications.length === 0 ? (
        <div className="text-center py-4 text-gray-500">
          <p className="text-sm">No notifications yet</p>
          <p className="text-xs">Real-time updates will appear here</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-3 rounded-lg border ${getTypeStyles(notification.type)}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium">{notification.message}</p>
                  <p className="text-xs opacity-75 mt-1">
                    {notification.timestamp.toLocaleTimeString()}
                  </p>
                </div>
                <button
                  onClick={() => removeNotification(notification.id)}
                  className="ml-2 text-xs opacity-60 hover:opacity-100"
                >
                  ×
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SocketNotifications;
