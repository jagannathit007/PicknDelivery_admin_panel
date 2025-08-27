import { Order } from "./OrderListingUI";

interface OrderDetailsProps {
  selectedOrder: Order | null | undefined;
  formatDateTime: (dateString: string) => string;
}

const OrderDetails: React.FC<OrderDetailsProps> = ({
  selectedOrder,
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

  if (!selectedOrder) {
    return (
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 text-center">
        <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-slate-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-slate-800 mb-2">
          Select an Order
        </h3>
        <p className="text-slate-500 text-sm">
          Click on any order from the table to view its details here.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden sticky top-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold">Order Details</h2>
            <p className="text-blue-100">{selectedOrder.id}</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Customer Information */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
          <h3 className="flex items-center gap-2 font-bold text-slate-800 mb-4">
            {/* <svg
              className="w-4 h-4 text-blue-600"
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
            </svg> */}
            👤 Customer
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-2 bg-white rounded-lg">
              <span className="text-slate-500 text-sm">Name:</span>
              <span className="font-semibold text-slate-800">
                {selectedOrder.customerName}
              </span>
            </div>
            <div className="flex items-center justify-between p-2 bg-white rounded-lg">
              <span className="text-slate-500 text-sm">Total:</span>
              <span className="font-bold text-green-600">
                ${selectedOrder.orderDetails.total}
              </span>
            </div>
            <div className="p-2 bg-white rounded-lg">
              <span className="text-slate-500 text-sm block mb-1">
                📍 Address:
              </span>
              <span className="font-medium text-slate-800 text-sm">
                {selectedOrder.orderDetails.address}
              </span>
            </div>
          </div>
        </div>

        {/* Rider Information */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
          <h3 className="flex items-center gap-2 font-bold text-slate-800 mb-4">
            {/* <svg
              className="w-4 h-4 text-blue-600"
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
            </svg> */}
            🚴 Rider
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-2 bg-white rounded-lg">
              <span className="text-slate-500 text-sm">Status:</span>
              <span
                className={`px-2 py-1 rounded-lg text-xs font-semibold border ${
                  getRiderStatusConfig(selectedOrder.rider.status).bg
                } ${getRiderStatusConfig(selectedOrder.rider.status).text} ${
                  getRiderStatusConfig(selectedOrder.rider.status).border
                }`}
              >
                {selectedOrder.rider.status === "assigned"
                  ? "✅ Assigned"
                  : "⚠️ Unassigned"}
              </span>
            </div>
            {selectedOrder.rider.status === "assigned" ? (
              <>
                <div className="flex items-center justify-between p-2 bg-white rounded-lg">
                  <span className="text-slate-500 text-sm">Name:</span>
                  <span className="font-semibold text-slate-800">
                    {selectedOrder.rider.name}
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 bg-white rounded-lg">
                  <span className="text-slate-500 text-sm">📞 Phone:</span>
                  <span className="font-medium text-slate-800">
                    {selectedOrder.rider.phone}
                  </span>
                </div>
              </>
            ) : (
              <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg text-center">
                <p className="text-orange-700 font-medium mb-2">
                  ⚠️ No rider assigned
                </p>
                <button className="px-3 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-all font-medium text-sm">
                  🚴 Assign Rider
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Order Type & Schedule Info */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
          <h3 className="flex items-center gap-2 font-bold text-slate-800 mb-4">
            {/* <svg
              className="w-4 h-4 text-blue-600"
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
            </svg> */}
            📦 Order Type
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-2 bg-white rounded-lg">
              <span className="text-slate-500 text-sm">Type:</span>
              <span
                className={`px-3 py-1 rounded-lg text-xs font-semibold border ${
                  selectedOrder.orderType === "now"
                    ? "bg-blue-100 text-blue-800 border-blue-200"
                    : "bg-purple-100 text-purple-800 border-purple-200"
                }`}
              >
                {selectedOrder.orderType === "now"
                  ? "⚡ Immediate"
                  : "📅 Scheduled"}
              </span>
            </div>
            {selectedOrder.orderType === "scheduled" &&
              selectedOrder.scheduledDateTime && (
                <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                  <span className="text-purple-600 text-sm font-medium block mb-1">
                    🕐 Scheduled Delivery:
                  </span>
                  <span className="font-bold text-purple-800">
                    {formatDateTime(selectedOrder.scheduledDateTime)}
                  </span>
                </div>
              )}
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
          <h3 className="flex items-center gap-2 font-bold text-slate-800 mb-4">
            {/* <svg
              className="w-4 h-4 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M16 11V7a4 4 0 00-8 0v4M8 11v6h8v-6M8 11h8"
              />
            </svg> */}
            🛍️ Items ({selectedOrder.orderDetails.items.length})
          </h3>
          <div className="space-y-2">
            {selectedOrder.orderDetails.items.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200"
              >
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-xs font-bold text-blue-600">
                      {index + 1}
                    </span>
                  </div>
                  <span className="font-medium text-slate-700 text-sm">
                    {item}
                  </span>
                </div>
                <div className="text-sm">🍽️</div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Status */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
          <h3 className="flex items-center gap-2 font-bold text-slate-800 mb-4">
            {/* <svg
              className="w-4 h-4 text-blue-600"
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
            </svg> */}
            📊 Status
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-2 bg-white rounded-lg">
              <span className="text-slate-500 text-sm">Current Status:</span>
              <span
                className={`px-3 py-1.5 rounded-lg text-sm font-bold border ${
                  getStatusConfig(selectedOrder.orderStatus).bg
                } ${getStatusConfig(selectedOrder.orderStatus).text} ${
                  getStatusConfig(selectedOrder.orderStatus).border
                }`}
              >
                {selectedOrder.orderStatus.charAt(0).toUpperCase() +
                  selectedOrder.orderStatus.slice(1)}
              </span>
            </div>
            <div className="flex items-center justify-between p-2 bg-white rounded-lg">
              <span className="text-slate-500 text-sm">Created:</span>
              <span className="font-medium text-slate-800 text-sm">
                {formatDateTime(selectedOrder.createdAt)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;