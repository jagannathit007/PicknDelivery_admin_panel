import {
  BoxIconLine,
  GroupIcon,
} from "../../icons";

interface EcommerceMetricsProps {
  earnings: number;
  orders: number;
  unassignedOrders: number;
}

export default function EcommerceMetrics({ earnings, orders, unassignedOrders }: EcommerceMetricsProps) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {/* Earnings Metric */}
      <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-lg dark:bg-gray-700">
              <GroupIcon className="text-gray-600 size-4 dark:text-gray-300" />
            </div>
            <div>
              <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Earnings</span>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                ₹{Number(earnings).toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
              </h4>
            </div>
          </div>
        </div>
      </div>

      {/* Orders Metric */}
      <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-lg dark:bg-gray-700">
              <BoxIconLine className="text-gray-600 size-4 dark:text-gray-300" />
            </div>
            <div>
              <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Orders</span>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                {orders.toLocaleString('en-IN')}
              </h4>
            </div>
          </div>
        </div>
      </div>

      {/* Unassigned Orders Metric */}
      <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-lg dark:bg-gray-700">
              <BoxIconLine className="text-gray-600 size-4 dark:text-gray-300" />
            </div>
            <div>
              <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Unassigned Orders</span>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                {unassignedOrders.toLocaleString('en-IN')}
              </h4>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}