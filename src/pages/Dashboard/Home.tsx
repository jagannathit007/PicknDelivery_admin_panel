import EcommerceMetrics from "../../components/ecommerce/EcommerceMetrics";
import LiveRidersMap from "../../components/ecommerce/LiveRidersMap";
import UnassignedOrdersTable from "../../components/ecommerce/UnassignedOrdersTable"; // Import the new component
import PageMeta from "../../components/common/PageMeta";
import { useEffect, useState } from "react";
import UserService from "../../services/userService";

export default function Home() {
  const [dashboardData, setDashboardData] = useState({
    liveRiders: [],
    earnings: 0,
    orders: 0,
    unassignedOrders: 0,
    topUnassignedOrders: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await UserService.getDashboardData({
          selectedDate: new Date().toISOString(),
        });
        if (response && response.status === 200) {
          setDashboardData(response.data);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <>
      <PageMeta title="Dashboard" description="" />
      <div className="space-y-6">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Overview of your delivery operations</p>
        </div>

        {/* Metrics Section */}
        <div>
          <EcommerceMetrics
            earnings={dashboardData.earnings}
            orders={dashboardData.orders}
            unassignedOrders={dashboardData.unassignedOrders}
          />
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Unassigned Orders Table */}
          <div className="lg:col-span-1">
            <UnassignedOrdersTable topUnassignedOrders={dashboardData.topUnassignedOrders} />
          </div>

          {/* Live Riders Map */}
          <div className="lg:col-span-1">
            <LiveRidersMap riders={dashboardData.liveRiders} />
          </div>
        </div>
      </div>
    </>
  );
}