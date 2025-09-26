import { format } from "date-fns";
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection
import { BoxIconLine } from "../../icons";

interface UnassignedOrder {
  orderNo: string;
  status: string;
  createdAt: string;
  pickupLocation: { address: string };
  dropLocation: { address: string }[];
  fare: { payableAmount: number };
  details: { customerName: string; customerMobile: string };
}

interface UnassignedOrdersTableProps {
  topUnassignedOrders: UnassignedOrder[];
}

export default function UnassignedOrdersTable({ topUnassignedOrders }: UnassignedOrdersTableProps) {
  const navigate = useNavigate(); // Initialize useNavigate hook

  const handleAllOrdersClick = () => {
    // Redirect to order-listing page with not-assigned filter
    navigate("/order-listing?status=not-assigned");
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Unassigned Orders
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Orders waiting for rider assignment</p>
        </div>
        <button
          onClick={handleAllOrdersClick}
          className="px-3 py-2 bg-gray-900 text-white text-sm font-medium rounded-md hover:bg-gray-800 transition-colors dark:bg-gray-700 dark:hover:bg-gray-600"
        >
          View All
        </button>
      </div>
      {topUnassignedOrders.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
            <BoxIconLine className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-sm">No unassigned orders found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {topUnassignedOrders.map((order) => (
            <div key={order.orderNo} className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-4 border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="flex-shrink-0">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-gray-200">
                        {order.orderNo}
                      </span>
                    </div>
                    <div className="flex-shrink-0">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                        {order.status}
                      </span>
                    </div>
                    <div className="flex-shrink-0 text-xs text-gray-500 dark:text-gray-400">
                      {format(new Date(order.createdAt), "MMM dd, HH:mm")}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                        Pickup Location
                      </div>
                      <div className="text-sm text-gray-900 dark:text-white line-clamp-2">
                        {order.pickupLocation.address}
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                        Customer Details
                      </div>
                      <div className="text-sm text-gray-900 dark:text-white">
                        <div className="font-medium">{order.details.customerName}</div>
                        <div className="text-gray-500 dark:text-gray-400">{order.details.customerMobile}</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex-shrink-0 ml-4 text-right">
                  <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                    Amount
                  </div>
                  <div className="text-lg font-semibold text-gray-900 dark:text-white">
                    ₹{order.fare.payableAmount.toLocaleString('en-IN')}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}