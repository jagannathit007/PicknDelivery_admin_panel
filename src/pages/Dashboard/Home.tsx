import EcommerceMetrics from "../../components/ecommerce/EcommerceMetrics";
import LiveRidersMap from "../../components/ecommerce/LiveRidersMap";
import PageMeta from "../../components/common/PageMeta";
import { useEffect, useState } from "react";
import UserService from "../../services/UserService";

export default function Home() {
  const [dashboardData, setDashboardData] = useState({
    liveRiders: [],
    earnings: 0,
    orders: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await UserService.getDashboardData({
          selectedDate: new Date().toISOString(),
        });
        
        if (response && response.status === 'success') {
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
      <PageMeta
        title="React.js Ecommerce Dashboard | TailAdmin - React.js Admin Dashboard Template"
        description="This is React.js Ecommerce Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12 space-y-4 xl:col-span-4">
          <EcommerceMetrics 
            earnings={dashboardData.earnings} 
            orders={dashboardData.orders} 
          />
        </div>
        <div className="col-span-12 space-y-8 xl:col-span-8">
          <LiveRidersMap riders={dashboardData.liveRiders}  />
        </div>
      </div>
    </>
  );
}