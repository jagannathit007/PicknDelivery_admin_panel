import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import Images from "./pages/UiElements/Images";
import Alerts from "./pages/UiElements/Alerts";
import Badges from "./pages/UiElements/Badges";
import Avatars from "./pages/UiElements/Avatars";
import Buttons from "./pages/UiElements/Buttons";
import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";
import Calendar from "./pages/Calendar";
import BasicTables from "./pages/Tables/BasicTables";
import FormElements from "./pages/Forms/FormElements";
import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import Vehicle from "./pages/Vehicle/Vehicle";
import VehicleType from "./pages/Vehicle/VehicleType";
import Users from "./pages/Users";
import OrderListing from "./pages/OrderListing";
import Riders from "./pages/Riders";
// import Deliveries from './components/dashboard/Deliveries';
import Earnings from './components/dashboard/Earnings';
import LiveRiders from './components/dashboard/Riders';
import Notification from "./pages/notification/Notification";
import Coupons from "./pages/coupons/Coupons ";
import Transactions from "./pages/Transactions";
import Settlement from "./pages/Settlement";
import Template from "./pages/Template";
import Categories from "./pages/Categories/Categories";
// import SocketStatus from "./components/common/SocketStatus";

export default function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Redirect root to signin */}
          <Route path="/" element={<Navigate to="/signin" replace />} />

          {/* Dashboard Layout */}
          <Route element={<AppLayout />}>
            <Route path="/home" element={<Home />} />

            {/* <Route path="/deliveries" element={<Deliveries />} /> */}
            <Route path="/earnings" element={<Earnings />} />
            <Route path="/live-riders" element={<LiveRiders />} />


            {/* Others Page */}
            <Route path="/profile" element={<UserProfiles />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/blank" element={<Blank />} />

            {/* Forms */}
            <Route path="/form-elements" element={<FormElements />} />

            {/* Vehicle */}
            <Route path="/vehicle" element={<Vehicle />} />
            <Route path="/vehicle-type" element={<VehicleType />} />

            {/* Users */}
            <Route path="/users" element={<Users />} />

            {/* Riders */}
            <Route path="/riders" element={<Riders />} />

            {/* Notification */}
            <Route path="/notification" element={<Notification />} />

            {/* Coupons */}
            <Route path="/coupons" element={<Coupons />} />

            {/* order listing */}
            <Route path="/order-listing" element={<OrderListing />} />

            {/* cod settlement */}
            <Route path="/transaction" element={<Transactions />} />
            <Route path="/settlement" element={<Settlement />} />

            {/* Template */}
            <Route path="/template" element={<Template />} />

            {/* {category page} */}
            <Route path="/categories" element={<Categories />} />

            {/* Tables */}
            <Route path="/basic-tables" element={<BasicTables />} />

            {/* Ui Elements */}
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/avatars" element={<Avatars />} />
            <Route path="/badge" element={<Badges />} />
            <Route path="/buttons" element={<Buttons />} />
            <Route path="/images" element={<Images />} />

            {/* Charts */}
            <Route path="/line-chart" element={<LineChart />} />
            <Route path="/bar-chart" element={<BarChart />} />
          </Route>

          {/* Auth Layout */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
      
      {/* Socket Status Component - Shows connection status and test buttons */}
      {/* <SocketStatus /> */}
    </>
  );
}
