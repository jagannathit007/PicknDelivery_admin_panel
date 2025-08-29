import { useEffect } from 'react';
import { useSocket } from '../context/SocketContext';

export const useSocketConnection = () => {
  const { 
    socket, 
    isConnected, 
    joinAdminRoom, 
    leaveAdminRoom,
    sendToAll,
    sendToRiders,
    sendToCustomers,
    sendToAdmin
  } = useSocket();

  // Automatically join admin room when connected
  useEffect(() => {
    if (isConnected) {
      joinAdminRoom();
    }
  }, [isConnected, joinAdminRoom]);

  // Cleanup: leave admin room when component unmounts
  useEffect(() => {
    return () => {
      if (isConnected) {
        leaveAdminRoom();
      }
    };
  }, [isConnected, leaveAdminRoom]);

  return {
    socket,
    isConnected,
    joinAdminRoom,
    leaveAdminRoom,
    sendToAll,
    sendToRiders,
    sendToCustomers,
    sendToAdmin
  };
};
