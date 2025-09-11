/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "./Api";
import API_ENDPOINTS from "../constants/api-endpoints";

interface Category {
  _id: string;
  name: string;
}
export interface Order {
  _id?: string;
  orderNo?: string;
  customer: {
    _id: string;
    name: string;
    mobile: string;
    image?: string;
  };
  category?: Category;
  rider?: {
    _id: string;
    name: string;
    mobile: string;
    image?: string;
  };
  vehicleType: {
    _id: string;
    name: string;
  };
  pickupLocation: {
    block: string;
    address: string;
    coordinates: string[];
    person: {
      name: string;
      mobile: string;
    };
    isPickedUp?: boolean;
    productDetails: [{
      name: string;
      weight: number;
      isVulnerable: boolean;
      category?: Category;
    }];
  };
  dropLocation: [{
    block: string;
    address: string;
    coordinates: string[];
    person: {
      name: string;
      mobile: string;
    };
    productDetails: [{
      name: string;
      weight: number;
      isVulnerable: boolean;
      category?: Category;
    }];
    isDelivered?: boolean;
    deliveryTime?: string;
  }];
  fare: {
    distance: number;
    distanceCharge: number;
    vehicleCharge: number;
    vulnerabilityCharge: number;
    discountCoupons: number;
    payableAmount: number;
  };
  status:
    | "created"
    | "pending"
    | "assigned"
    | "reassigned"
    | "running"
    | "delivered"
    | "returned"
    | "cancelled";
  paymentMethod: "cash" | "online";
  appliedCoupon?: string;
  orderTracking?: string[];
  paymentId?: string;
  extraDetails?: any;
  isPaid: boolean;
  isDeleted: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface OrderListResponse {
  status: number;
  message: string;
  data: {
    docs: Order[];
    totalDocs: number;
    limit: number;
    page: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

interface OrderResponse {
  status: number;
  message: string;
  data: Order | boolean;
}

interface OrderListPayload {
  page?: number;
  limit?: number;
  customer?: string;
  rider?: string;
  status?: string;
}

interface AssignOrderPayload {
  orderId: string;
  riderId: string;
}

interface CancelOrderPayload {
  orderId: string;
}

class OrderService {
  // Get all orders with pagination and filters
  static async getOrders(
    payload: OrderListPayload = {}
  ): Promise<OrderListResponse> {
    try {
      const response = await api.post(API_ENDPOINTS.ORDERS.GET_ORDERS, payload);
      return response.data as OrderListResponse;
    } catch (error: any) {
      console.error("Error fetching orders:", error);
      throw error;
    }
  }

  // Assign order to rider
  static async assignOrder(
    payload: AssignOrderPayload
  ): Promise<OrderResponse> {
    try {
      const response = await api.post(
        API_ENDPOINTS.ORDERS.ASSIGN_ORDER,
        payload
      );
      return response.data as OrderResponse;
    } catch (error: any) {
      console.error("Error assigning order:", error);
      throw error;
    }
  }

  // Cancel order
  static async cancelOrder(
    payload: CancelOrderPayload
  ): Promise<OrderResponse> {
    try {
      const response = await api.post(
        API_ENDPOINTS.ORDERS.CANCEL_ORDER,
        payload
      );
      return response.data as OrderResponse;
    } catch (error: any) {
      console.error("Error cancelling order:", error);
      throw error;
    }
  }
}

export default OrderService;
