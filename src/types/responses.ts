export interface BaseResponse {
  status: number;
  message: string;
}

export interface PaginationData {
  totalDocs: number;
  totalPages: number;
  page: number;
  limit: number;
  docs: any[];
}

export interface DashboardData {
  liveRiders: Rider[];
  earnings: number;
  orders: number;
}

export interface DashboardResponse extends BaseResponse {
  data: DashboardData;
}

export interface CustomerPayload {
  name: string;
  email: string;
  phone: string;
  address: string;
}

export interface Customer extends CustomerPayload {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerResponse extends BaseResponse {
  data: Customer;
}

export interface CustomerListResponse extends BaseResponse {
  data: Customer[];
}

export interface CouponListPayload {
  code: string;
  discount: number;
  validFrom: string;
  validTo: string;
  maxUses: number;
}

export interface Coupon extends CouponListPayload {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface CouponResponse extends BaseResponse {
  data: Coupon;
}

export interface CouponListResponse extends BaseResponse {
  data: Coupon[];
}

export interface FarePayload {
  vehicleType: string;
  basePrice: number;
  pricePerKm: number;
  pricePerMinute: number;
}

export interface Fare extends FarePayload {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface FareResponse extends BaseResponse {
  data: Fare;
}

export interface FareListResponse extends BaseResponse {
  data: Fare[];
}

export interface RiderPayload {
  name: string;
  email: string;
  phone: string;
  vehicleType: string;
  vehicleNumber: string;
  license: string;
}

export interface Rider extends RiderPayload {
  id: string;
  isOnline: boolean;
  currentLocation?: {
    lat: number;
    lng: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface RiderResponse extends BaseResponse {
  data: Rider;
}

export interface RiderListResponse extends BaseResponse {
  data: PaginationData & { docs: Rider[] };
}

export interface Order {
  id: string;
  customer: Customer;
  rider: Rider;
  pickup: {
    address: string;
    lat: number;
    lng: number;
  };
  dropoff: {
    address: string;
    lat: number;
    lng: number;
  };
  status: string;
  fare: number;
  distance: number;
  duration: number;
  createdAt: string;
  updatedAt: string;
}

export interface MessageTemplate {
  id: string;
  name: string;
  content: string;
  type: string;
  createdAt: string;
  updatedAt: string;
}

export interface MessageTemplateResponse extends BaseResponse {
  data: MessageTemplate;
}

export interface MessageTemplateListResponse extends BaseResponse {
  data: MessageTemplate[];
}

export interface Transaction {
  id: string;
  orderId: string;
  amount: number;
  type: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface TransactionResponse extends BaseResponse {
  data: Transaction;
}

export interface TransactionListResponse extends BaseResponse {
  data: PaginationData & { docs: Transaction[] };
}

export interface Vehicle {
  id: string;
  type: string;
  name: string;
  description: string;
  capacity: number;
  createdAt: string;
  updatedAt: string;
}

export interface VehicleListResponse extends BaseResponse {
  data: PaginationData & { docs: Vehicle[] };
}

export interface VehicleTypeResponse extends BaseResponse {
  data: Vehicle;
}

export interface VehicleTypeListResponse extends BaseResponse {
  data: Vehicle[];
}

export interface ProfileResponse extends BaseResponse {
  data: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}
