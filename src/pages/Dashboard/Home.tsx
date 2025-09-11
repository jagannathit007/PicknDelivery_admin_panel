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
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        {/* Metrics Section */}
        <div className="col-span-12 space-y-4">
          <EcommerceMetrics
            earnings={dashboardData.earnings}
            orders={dashboardData.orders}
            unassignedOrders={dashboardData.unassignedOrders}
          />
        </div>

        {/* Unassigned Orders Table */}
        <div className="col-span-12 space-y-4">
          <UnassignedOrdersTable topUnassignedOrders={dashboardData.topUnassignedOrders} />
        </div>

        {/* Live Riders Map */}
        <div className="col-span-12 space-y-4">
          <LiveRidersMap riders={dashboardData.liveRiders} />
        </div>
      </div>
    </>
  );
}