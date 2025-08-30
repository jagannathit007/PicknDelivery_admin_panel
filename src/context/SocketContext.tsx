import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import socketService from '../services/SocketService';
import { Socket } from 'socket.io-client';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  connect: () => void;
  disconnect: () => void;
  joinAdminRoom: () => void;
  leaveAdminRoom: () => void;
  sendToAll: (message: string) => void;
  sendToRiders: (message: string) => void;
  sendToCustomers: (message: string) => void;
  sendToAdmin: (message: string) => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

interface SocketProviderProps {
  children: ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  // Initialize socket connection
  const connect = () => {
    try {
      const socketInstance = socketService.connect();
      setSocket(socketInstance);
      
      // Listen for connection status changes
      socketInstance.on('connect', () => {
        setIsConnected(true);
        console.log('🔌 Socket connected in context');
      });
      
      socketInstance.on('disconnect', () => {
        setIsConnected(false);
        console.log('❌ Socket disconnected in context');
      });
      
      socketInstance.on('connect_error', () => {
        setIsConnected(false);
        console.error('Socket connection error in context');
      });
      
    } catch (error) {
      console.error('Failed to connect socket:', error);
    }
  };

  // Disconnect socket
  const disconnect = () => {
    socketService.disconnect();
    setSocket(null);
    setIsConnected(false);
  };

  // Join admin room
  const joinAdminRoom = () => {
    console.log('Joining admin room');
    socketService.joinAdminRoom();
  };

  // Leave admin room
  const leaveAdminRoom = () => {
    socketService.leaveAdminRoom();
  };

  // Send message to all users
  const sendToAll = (message: string) => {
    socketService.sendToAll(message);
  };

  // Send message to riders only
  const sendToRiders = (message: string) => {
    socketService.sendToRiders(message);
  };

  // Send message to customers only
  const sendToCustomers = (message: string) => {
    socketService.sendToCustomers(message);
  };

  // Send message to admin only
  const sendToAdmin = (message: string) => {
    socketService.sendToAdmin(message);
  };

  // Auto-connect when component mounts
  useEffect(() => {
    connect();

    // Cleanup on unmount
    return () => {
      disconnect();
    };
  }, []);

  const value: SocketContextType = {
    socket,
    isConnected,
    connect,
    disconnect,
    joinAdminRoom,
    leaveAdminRoom,
    sendToAll,
    sendToRiders,
    sendToCustomers,
    sendToAdmin,
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};
