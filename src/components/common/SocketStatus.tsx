import React from 'react';
import { useSocketConnection } from '../../hooks/useSocketConnection';

const SocketStatus: React.FC = () => {
  const { 
    isConnected, 
    socket, 
    sendToAll, 
    sendToRiders, 
    sendToCustomers, 
    sendToAdmin 
  } = useSocketConnection();

  const handleSendMessage = (type: 'all' | 'riders' | 'customers' | 'admin') => {
    const message = `Test message from admin at ${new Date().toLocaleTimeString()}`;
    
    switch (type) {
      case 'all':
        sendToAll(message);
        break;
      case 'riders':
        sendToRiders(message);
        break;
      case 'customers':
        sendToCustomers(message);
        break;
      case 'admin':
        sendToAdmin(message);
        break;
    }
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 border border-gray-200 dark:border-gray-700 z-50">
      <div className="flex items-center space-x-2 mb-3">
        <div 
          className={`w-3 h-3 rounded-full ${
            isConnected ? 'bg-green-500' : 'bg-red-500'
          }`}
        />
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Socket: {isConnected ? 'Connected' : 'Disconnected'}
        </span>
      </div>
      
      {socket && (
        <div className="text-xs text-gray-500 dark:text-gray-400 mb-3">
          ID: {socket.id}
        </div>
      )}
      
      <div className="space-y-2">
        <button
          onClick={() => handleSendMessage('all')}
          className="w-full px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Send to All
        </button>
        <button
          onClick={() => handleSendMessage('riders')}
          className="w-full px-3 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
        >
          Send to Riders
        </button>
        <button
          onClick={() => handleSendMessage('customers')}
          className="w-full px-3 py-1 text-xs bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors"
        >
          Send to Customers
        </button>
        <button
          onClick={() => handleSendMessage('admin')}
          className="w-full px-3 py-1 text-xs bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors"
        >
          Send to Admin
        </button>
      </div>
    </div>
  );
};

export default SocketStatus;
