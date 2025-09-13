# Order Tracking Map Feature

## Overview
This feature adds real-time order tracking with map visualization to the admin dashboard. It allows administrators to track riders and view routes between rider locations and pickup/drop locations.

## Features Implemented

### 1. Order Tracking Modal (`OrderTrackingModal.tsx`)
- **Real-time Map Display**: Shows Google Maps with rider and location markers
- **Dynamic Route Drawing**: Displays routes based on order status:
  - If pickup is pending: Shows route from rider to pickup location
  - If pickup is done: Shows route from rider to first undelivered drop location
- **Custom Markers**: 
  - Blue marker for rider current location
  - Green marker for pickup location
  - Red markers for drop locations
- **Interactive Info Windows**: Click markers to see detailed information
- **Refresh Functionality**: Manual refresh button to update locations
- **Error Handling**: Graceful error handling for API failures and map loading issues

### 2. API Integration
- **New API Endpoint**: Added `getOrderLocations` to OrderService
- **Backend Integration**: Connects to existing `/get-order-locations` API endpoint
- **Real-time Data**: Fetches current rider coordinates and order locations

### 3. UI Enhancements
- **New Action Button**: "Track" button appears for orders with assigned riders
- **Conditional Display**: Only shows for non-completed orders with assigned riders
- **Visual Indicators**: Purple-themed track button with compass icon

## Setup Requirements

### Environment Variables
Add the following to your `.env.local` file:
```env
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

### Google Maps API Key Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/google/maps-apis)
2. Create a new project or select existing one
3. Enable the following APIs:
   - Maps JavaScript API
   - Directions API
   - Geocoding API (optional, for address lookup)
4. Create credentials (API Key)
5. Restrict the API key to your domain for security

## Usage

### For Administrators
1. Navigate to Order Listing page
2. Find an order with an assigned rider that is not completed/cancelled
3. Click the purple "Track" button in the Actions column
4. The map modal will open showing:
   - Rider's current location
   - Pickup location
   - Drop locations
   - Route between rider and next destination
5. Use the "Refresh" button to update locations
6. Click markers for detailed information

### Route Logic
The system automatically determines which route to show based on order status:
- **Pickup Pending**: Route from rider to pickup location
- **Pickup Complete**: Route from rider to first undelivered drop location
- **Multiple Drops**: Shows route to next undelivered drop location

## Technical Implementation

### Components Modified
1. **OrderListing/index.tsx**: Added tracking modal and button
2. **OrderService.ts**: Added getOrderLocations method
3. **api-endpoints.ts**: Added GET_ORDER_LOCATIONS endpoint
4. **OrderTrackingModal.tsx**: New component for map functionality

### Backend API Response Format
```json
{
  "status": 200,
  "message": "Order locations fetched successfully",
  "data": {
    "orderId": "order_id",
    "type": "pickup" | "drop",
    "locations": {
      "riderCurrentLocation": [lat, lng],
      "pickupLocation": { ... },
      "dropLocation": [ ... ]
    }
  }
}
```

## Error Handling
- **No Rider Assigned**: Shows error message
- **Completed Orders**: Prevents tracking of delivered/cancelled orders
- **API Failures**: Graceful error messages with retry options
- **Map Loading Issues**: Fallback error display with troubleshooting

## Security Considerations
- API key should be restricted to your domain
- Consider implementing rate limiting for map API calls
- Validate order access permissions on backend

## Future Enhancements
- Real-time location updates via WebSocket
- Estimated time of arrival calculations
- Multiple route options
- Offline map caching
- Mobile-responsive improvements
