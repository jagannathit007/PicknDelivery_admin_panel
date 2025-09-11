import { format } from "date-fns";
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection

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
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Top Unassigned Orders
        </h3>
        <button
          onClick={handleAllOrdersClick}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          All Orders
        </button>
      </div>
      {topUnassignedOrders.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">No unassigned orders found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="text-left text-sm text-gray-500 dark:text-gray-400">
                <th className="px-4 py-2">Order No</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Created At</th>
                <th className="px-4 py-2">Pickup Location</th>
                <th className="px-4 py-2">Drop Locations</th>
                <th className="px-4 py-2">Amount</th>
                <th className="px-4 py-2">Customer</th>
              </tr>
            </thead>
            <tbody>
              {topUnassignedOrders.map((order) => (
                <tr
                  key={order.orderNo}
                  className="border-t border-gray-200 dark:border-gray-800 text-sm text-gray-800 dark:text-white/90"
                >
                  <td className="px-4 py-2">{order.orderNo}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs ${
                        order.status === "created"
                          ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
                          : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    {format(new Date(order.createdAt), "MMM dd, yyyy HH:mm")}
                  </td>
                  <td className="px-4 py-2">{order.pickupLocation.address}</td>
                  <td className="px-4 py-2">
                    {order.dropLocation.length > 0 ? (
                      <ul className="list-disc list-inside">
                        {order.dropLocation.map((location, index) => (
                          <li key={index}>{location.address}</li>
                        ))}
                      </ul>
                    ) : (
                      "No drop locations"
                    )}
                  </td>
                  <td className="px-4 py-2">${order.fare.payableAmount.toLocaleString()}</td>
                  <td className="px-4 py-2">
                    {order.details.customerName} ({order.details.customerMobile})
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}