import { io, Socket } from 'socket.io-client';
import AuthService from './AuthService';

class SocketService {
  private socket: Socket | null = null;
  private isConnected: boolean = false;

  // Initialize socket connection
  connect() {    
    if (this.socket && this.isConnected) {
      console.log('Socket already connected');
      return this.socket;
    }

    // Get the backend URL from environment or use default
    const backendUrl = import.meta.env.VITE_BASE_URL || 'http://localhost:3000';
    
    this.socket = io(backendUrl, {
      transports: ['websocket', 'polling'],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    this.setupEventListeners();
    
    return this.socket;
  }

  // Setup socket event listeners
  private setupEventListeners() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('🔌 Connected to socket server:', this.socket?.id);
      this.isConnected = true;
      
      // Automatically join admin room when connected
      this.joinAdminRoom();
    });

    this.socket.on('disconnect', () => {
      console.log('❌ Disconnected from socket server');
      this.isConnected = false;
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      this.isConnected = false;
    });

    this.socket.on('reconnect', (attemptNumber) => {
      console.log(`🔄 Reconnected to socket server after ${attemptNumber} attempts`);
      this.isConnected = true;
      
      // Rejoin admin room after reconnection
      this.joinAdminRoom();
    });

    // Listen for admin-specific messages
    // this.socket.on('message', (data) => {
    //   console.log('📨 Received message:', data);
    // });

    // this.socket.on('orderUpdate', (data) => {
    //   console.log('📦 Order update received:', data);
    // });

    // this.socket.on('riderUpdate', (data) => {
    //   console.log('🚴 Rider update received:', data);
    // });
  }

  // Join admin room
  joinAdminRoom() {
    const adminDetails = AuthService.getUser();
    console.log('adminDetails:', adminDetails);
    if(!adminDetails) {
      return;
    }

    if (this.socket && this.isConnected) {
      this.socket.emit('joinRoom', {userId: adminDetails.id, userType: 'admin'});
      console.log('✅ Joined admin room');
    }
  }

  // Leave admin room
  leaveAdminRoom() {
    if (this.socket && this.isConnected) {
      this.socket.emit('leaveRoom', 'admin');
      console.log('✅ Left admin room');
    }
  }

  // Send message to all users
  sendToAll(message: string) {
    if (this.socket && this.isConnected) {
      this.socket.emit('sendToAll', message);
    }
  }

  // Send message to riders only
  sendToRiders(message: string) {
    if (this.socket && this.isConnected) {
      this.socket.emit('sendToRiders', message);
    }
  }

  // Send message to customers only
  sendToCustomers(message: string) {
    if (this.socket && this.isConnected) {
      this.socket.emit('sendToCustomers', message);
    }
  }

  // Send message to admin only
  sendToAdmin(message: string) {
    if (this.socket && this.isConnected) {
      this.socket.emit('sendToAdmin', message);
    }
  }

  // Get current socket instance
  getSocket(): Socket | null {
    return this.socket;
  }

  // Check if socket is connected
  isSocketConnected(): boolean {
    return this.isConnected;
  }

  // Disconnect socket
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      console.log('🔌 Socket disconnected');
    }
  }
}

// Create a singleton instance
const socketService = new SocketService();
export default socketService;
