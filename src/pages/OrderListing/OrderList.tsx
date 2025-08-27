import { Order } from "../OrderListing/index";

interface OrderListProps {
  orders: Order[];
  filterStatus: string;
  searchTerm: string;
  selectedOrderId: string | null;
  setSelectedOrderId: (id: string | null) => void;
  formatDateTime: (dateString: string) => string;
}

const OrderList: React.FC<OrderListProps> = ({
  orders,
  filterStatus,
  searchTerm,
  selectedOrderId,
  setSelectedOrderId,
  formatDateTime,
}) => {
  // Helper functions
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "running":
        return {
          bg: "bg-blue-100",
          text: "text-blue-800",
          border: "border-blue-200",
          dot: "bg-blue-500",
        };
      case "pending":
        return {
          bg: "bg-amber-100",
          text: "text-amber-800",
          border: "border-amber-200",
          dot: "bg-amber-500",
        };
      case "complete":
        return {
          bg: "bg-emerald-100",
          text: "text-emerald-800",
          border: "border-emerald-200",
          dot: "bg-emerald-500",
        };
      case "cancelled":
        return {
          bg: "bg-red-100",
          text: "text-red-800",
          border: "border-red-200",
          dot: "bg-red-500",
        };
      default:
        return {
          bg: "bg-slate-100",
          text: "text-slate-800",
          border: "border-slate-200",
          dot: "bg-slate-500",
        };
    }
  };

  const getRiderStatusConfig = (status: string) => {
    return status === "assigned"
      ? {
          bg: "bg-emerald-100",
          text: "text-emerald-800",
          border: "border-emerald-200",
        }
      : {
          bg: "bg-orange-100",
          text: "text-orange-800",
          border: "border-orange-200",
        };
  };

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || order.orderStatus === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-slate-50 to-slate-100 border-b-2 border-slate-200">
            <tr>
              <th className="px-6 py-5 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                <div className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a1.994 1.994 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                    />
                  </svg>
                  Order ID
                </div>
              </th>
              <th className="px-6 py-5 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                <div className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  Customer
                </div>
              </th>
              <th className="px-6 py-5 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                <div className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 14l9-5-9-5-9 5 9 5z"
                    />
                  </svg>
                  Rider
                </div>
              </th>
              <th className="px-6 py-5 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                <div className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  Order Type
                </div>
              </th>
              <th className="px-6 py-5 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                <div className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Status
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {filteredOrders.map((order) => {
              const statusConfig = getStatusConfig(order.orderStatus);
              const riderConfig = getRiderStatusConfig(order.rider.status);

              return (
                <tr
                  key={order.id}
                  className={`transition-all duration-200 cursor-pointer ${
                    selectedOrderId === order.id
                      ? "bg-blue-50 border-l-4 border-blue-500"
                      : "hover:bg-blue-50/50"
                  }`}
                  onClick={() => setSelectedOrderId(order.id)}
                >
                  {/* Order ID */}
                  <td className="px-6 py-5">
                    <div className="space-y-1">
                      <div className="font-bold text-slate-800 text-sm">
                        {order.id}
                      </div>
                      <div className="text-xs text-slate-500 flex items-center gap-1">
                        <svg
                          className="w-3 h-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        {formatDateTime(order.createdAt)}
                      </div>
                    </div>
                  </td>

                  {/* Customer */}
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div>
                        <div className="font-semibold text-slate-800 text-sm">
                          {order.customerName}
                        </div>
                        <div className="text-xs text-green-600 font-bold">
                          ${order.orderDetails.total}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Rider */}
                  <td className="px-6 py-5">
                    <div className="space-y-2">
                      <span
                        className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold border ${riderConfig.bg} ${riderConfig.text} ${riderConfig.border}`}
                      >
                        {order.rider.status === "assigned" }{" "}
                        {order.rider.status === "assigned"
                          ? "Assigned"
                          : "Unassigned"}
                      </span>
{/* 
                      {order.rider.status === "assigned" && order.rider.name ? (
                        <div className="bg-emerald-50 p-2 rounded-lg border border-emerald-200">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-emerald-200 rounded-full flex items-center justify-center">
                              <span className="text-xs font-bold text-emerald-700">
                                {order.rider.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </span>
                            </div>
                            <div>
                              <div className="text-xs font-semibold text-emerald-800">
                                {order.rider.name}
                              </div>
                              <div className="text-xs text-emerald-600">
                                {order.rider.phone}
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <button className="w-full px-2 py-1.5 text-xs text-orange-600 hover:text-orange-700 hover:bg-orange-50 rounded-lg transition-all border border-orange-200 font-medium">
                          🚴 Assign Riderrr
                        </button>
                      )} */}
                    </div>
                  </td>

                  {/* Order Type */}
                  <td className="px-6 py-5">
                    <div className="space-y-2">
                      <span
                        className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold border shadow-sm ${
                          order.orderType === "now"
                            ? "bg-blue-100 text-blue-800 border-blue-200"
                            : "bg-purple-100 text-purple-800 border-purple-200"
                        }`}
                      >
                        {order.orderType === "now" ? "⚡" : "📅"}{" "}
                        {order.orderType === "now" ? "Immediate" : "Scheduled"}
                      </span>

                      {/* {order.orderType === "scheduled" &&
                        order.scheduledDateTime && (
                          <div className="bg-purple-50 p-2 rounded-lg border border-purple-200">
                            <div className="text-xs text-purple-600 font-medium">
                              Delivery Time:
                            </div>
                            <div className="text-sm font-bold text-purple-800">
                              {formatDateTime(order.scheduledDateTime)}
                            </div>
                          </div>
                        )} */}
                    </div>
                  </td>

                  {/* Order Status */}
                  <td className="px-6 py-5">
                    <span
                      className={`inline-flex items-center px-4 py-2 rounded-xl text-sm font-bold border shadow-sm ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}
                    >
                      <span className="ml-1">
                        {order.orderStatus.charAt(0).toUpperCase() +
                          order.orderStatus.slice(1)}
                      </span>
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Professional Pagination */}
      <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100">
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
          Showing <span className="font-semibold">{filteredOrders.length}</span>{" "}
          of <span className="font-semibold">{orders.length}</span> orders
        </div>

        <div className="flex items-center gap-1">
          <button className="px-3 py-2 text-slate-500 hover:text-slate-700 hover:bg-white rounded-lg transition-all shadow-sm">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold shadow-lg">
            1
          </button>
          <button className="px-4 py-2 text-slate-500 hover:text-slate-700 hover:bg-white rounded-lg transition-all">
            2
          </button>
          <button className="px-4 py-2 text-slate-500 hover:text-slate-700 hover:bg-white rounded-lg transition-all">
            3
          </button>
          <button className="px-3 py-2 text-slate-500 hover:text-slate-700 hover:bg-white rounded-lg transition-all shadow-sm">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderList;