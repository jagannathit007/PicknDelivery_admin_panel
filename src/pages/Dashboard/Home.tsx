import EcommerceMetrics from "../../components/ecommerce/EcommerceMetrics";
import LiveRidersMap from "../../components/ecommerce/LiveRidersMap";
import PageMeta from "../../components/common/PageMeta";
import { useEffect, useState } from "react";
import UserService from "../../services/userService";

export default function Home() {
  const [dashboardData, setDashboardData] = useState({
    liveRiders: [],
    earnings: 0,
    orders: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response: any = await UserService.getDashboardData({
        selectedDate: new Date().toISOString(),
      });
      if (response && response.status === 'success') {
        setDashboardData(response.data);
      }
    };
    fetchData();
  }, []);
  return (
    <>
      <PageMeta
        title="React.js Ecommerce Dashboard | TailAdmin - React.js Admin Dashboard Template"
        description="This is React.js Ecommerce Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12 space-y-6 xl:col-span-7">
          <EcommerceMetrics earnings={dashboardData.earnings} orders={dashboardData.orders} />
          <LiveRidersMap riders={dashboardData.liveRiders}  />
        </div>
        
        {/* <div className="col-span-12 xl:col-span-5">
          <SocketNotifications />
        </div> */}
      </div>
    </>
  );
}
