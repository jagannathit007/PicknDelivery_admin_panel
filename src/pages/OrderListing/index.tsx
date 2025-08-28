import React, { useState, useEffect, useMemo } from "react";
import {
  FaSearch,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaFilter,
  FaMapMarkerAlt,
  FaUser,
  FaPhone,
  FaMotorcycle,
  FaCalendar,
  FaClock,
  FaDollarSign,
  FaEye,
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationTriangle,
  FaTruck,
  FaCheck,
  FaTimes,
} from "react-icons/fa";
import OrderService, { Order } from "../../services/OrderService";
import RiderService from "../../services/RiderService";
import LocationModal from "../../components/common/LocationModal";
import RiderAssignmentModal from "../../components/common/RiderAssignmentModal";
import toastHelper from "../../utils/toastHelper";
import Swal from "sweetalert2";
import { MdClose } from "react-icons/md";

interface SortConfig {
  key: keyof Order | "fare.payableAmount" | null;
  direction: "ascending" | "descending";
}

const imageBaseUrl = import.meta.env.VITE_BASE_URL;

function OrderListing() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("All");
  const [riderFilter, setRiderFilter] = useState("All");
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: null,
    direction: "ascending",
  });
  const [totalPages, setTotalPages] = useState(1);
  const [totalDocs, setTotalDocs] = useState(0);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [selectedOrderForLocation, setSelectedOrderForLocation] =
    useState<Order | null>(null);
  const [isRiderAssignmentModalOpen, setIsRiderAssignmentModalOpen] =
    useState(false);
  const [selectedOrderForRider, setSelectedOrderForRider] =
    useState<Order | null>(null);
  const itemsPerPage = 10;

  // Fetch orders from API
  const fetchOrders = async (
    page = 1,
    search = "",
    status = "All",
    rider = "All"
  ) => {
    setLoading(true);
    try {
      const payload: any = {
        page,
        limit: itemsPerPage,
      };

      if (search) {
        // You can implement search by customer name or order ID
        // For now, we'll search by customer name
        payload.customer = search;
      }

      if (status !== "All") {
        payload.status = status.toLowerCase();
      }

      if (rider !== "All") {
        if (rider === "Assigned") {
          // Filter for orders with riders
          payload.rider = { $exists: true, $ne: null };
        } else if (rider === "Not Assigned") {
          // Filter for orders without riders
          payload.rider = null;
        }
      }

      const response = await OrderService.getOrders(payload);

      if (response && response.data) {
        setOrders(response.data.docs);
        setTotalPages(response.data.totalPages);
        setTotalDocs(response.data.totalDocs);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toastHelper.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(currentPage, searchTerm, statusFilter, riderFilter);
  }, [currentPage, searchTerm, statusFilter, riderFilter]);

  // Handle sorting
  const handleSort = (key: keyof Order | "fare.payableAmount") => {
    let direction: "ascending" | "descending" = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  // Get sort icon based on current sort state
  const getSortIcon = (key: keyof Order) => {
    if (sortConfig.key !== key)
      return <FaSort className="ml-1 text-gray-400" />;
    if (sortConfig.direction === "ascending")
      return <FaSortUp className="ml-1 text-gray-600" />;
    return <FaSortDown className="ml-1 text-gray-600" />;
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Format time for display
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get status configuration
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "not-assigned":
        return {
          bg: "bg-orange-100",
          text: "text-orange-800",
          border: "border-orange-200",
          icon: <FaExclamationTriangle className="w-4 h-4" />,
        };
      case "accepted":
        return {
          bg: "bg-blue-100",
          text: "text-blue-800",
          border: "border-blue-200",
          icon: <FaCheckCircle className="w-4 h-4" />,
        };
      case "in_transit":
        return {
          bg: "bg-yellow-100",
          text: "text-yellow-800",
          border: "border-yellow-200",
          icon: <FaTruck className="w-4 h-4" />,
        };
      case "delivered":
        return {
          bg: "bg-green-100",
          text: "text-green-800",
          border: "border-green-200",
          icon: <FaCheck className="w-4 h-4" />,
        };
      case "cancelled":
        return {
          bg: "bg-red-100",
          text: "text-red-800",
          border: "border-red-200",
          icon: <FaTimes className="w-4 h-4" />,
        };
      default:
        return {
          bg: "bg-gray-100",
          text: "text-gray-800",
          border: "border-gray-200",
          icon: <FaExclamationTriangle className="w-4 h-4" />,
        };
    }
  };

  // Handle rider assignment
  const handleAssignRider = async (riderId: string) => {
    if (!selectedOrderForRider) return;

    // Frontend validation
    if (
      selectedOrderForRider.status === "delivered" ||
      selectedOrderForRider.status === "cancelled"
    ) {
      toastHelper.error("Cannot assign rider to completed or cancelled order!");
      return;
    }

    try {
      const response = await OrderService.assignOrder({
        orderId: selectedOrderForRider._id!,
        riderId,
      });

      if (response.status === 200) {
        toastHelper.success("Rider assigned successfully!");
        // Refresh orders
        fetchOrders(currentPage, searchTerm, statusFilter, riderFilter);
      } else {
        toastHelper.error(response.message || "Failed to assign rider");
      }
    } catch (error) {
      console.error("Error assigning rider:", error);
      toastHelper.error("Failed to assign rider");
    }
  };

  // Handle order cancellation
  const handleCancelOrder = async (orderId: string) => {
    // Find the order to check its status
    const order = orders.find((o) => o._id === orderId);
    if (!order) {
      toastHelper.error("Order not found!");
      return;
    }

    // Frontend validation
    if (order.status === "delivered" || order.status === "cancelled") {
      toastHelper.error("Cannot cancel completed or already cancelled order!");
      return;
    }

    const result = await Swal.fire({
      title: "Cancel Order?",
      text: "Are you sure you want to cancel this order?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, cancel it!",
    });

    if (result.isConfirmed) {
      try {
        const response = await OrderService.cancelOrder({ orderId });

        if (response.status === 200) {
          toastHelper.success("Order cancelled successfully!");
          // Refresh orders
          fetchOrders(currentPage, searchTerm, statusFilter, riderFilter);
        } else {
          toastHelper.error(response.message || "Failed to cancel order");
        }
      } catch (error) {
        console.error("Error cancelling order:", error);
        toastHelper.error("Failed to cancel order");
      }
    }
  };

  // Open location modal
  const openLocationModal = (order: Order) => {
    setSelectedOrderForLocation(order);
    setIsLocationModalOpen(true);
  };

  // Open rider assignment modal
  const openRiderAssignmentModal = async (order: Order) => {
    // Frontend validation
    if (order.status === "delivered" || order.status === "cancelled") {
      toastHelper.error("Cannot assign rider to completed or cancelled order!");
      return;
    }

    // Check if there are any riders available
    try {
      const ridersResponse = await RiderService.getRiders({
        page: 1,
        limit: 100,
        search: "",
      });

      if (
        ridersResponse &&
        ridersResponse.data &&
        ridersResponse.data.docs &&
        ridersResponse.data.docs.length > 0
      ) {
        // Filter active riders
        const activeRiders = ridersResponse.data.docs.filter(
          (rider: any) => rider.isActive
        );
        if (activeRiders.length === 0) {
          toastHelper.error("No active riders available for assignment!");
          return;
        }
      } else {
        toastHelper.error("No riders available for assignment!");
        return;
      }

      setSelectedOrderForRider(order);
      setIsRiderAssignmentModalOpen(true);
    } catch (error) {
      console.error("Error checking riders:", error);
      toastHelper.error("Failed to check rider availability!");
    }
  };

  // Filtered and sorted orders
  const filteredAndSortedOrders = useMemo(() => {
    let filtered = [...orders];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order.customer.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          order._id?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== "All") {
      filtered = filtered.filter(
        (order) => order.status === statusFilter.toLowerCase()
      );
    }

    // Apply rider filter
    if (riderFilter === "Assigned") {
      filtered = filtered.filter((order) => order.rider && order.rider._id);
    } else if (riderFilter === "Not Assigned") {
      filtered = filtered.filter((order) => !order.rider || !order.rider._id);
    }

    // Apply sorting
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        let aValue: any;
        let bValue: any;

        // Handle nested properties like fare.payableAmount
        if (sortConfig.key === "fare.payableAmount") {
          aValue = parseFloat(a.fare?.payableAmount?.toString() || "0");
          bValue = parseFloat(b.fare?.payableAmount?.toString() || "0");
        } else {
          aValue = a[sortConfig.key!];
          bValue = b[sortConfig.key!];
        }

        if (aValue === null || aValue === undefined) return 1;
        if (bValue === null || bValue === undefined) return -1;

        if (typeof aValue === "string" && typeof bValue === "string") {
          const comparison = aValue.localeCompare(bValue);
          return sortConfig.direction === "ascending"
            ? comparison
            : -comparison;
        }

        if (typeof aValue === "number" && typeof bValue === "number") {
          const comparison = aValue - bValue;
          return sortConfig.direction === "ascending"
            ? comparison
            : -comparison;
        }

        return 0;
      });
    }

    return filtered;
  }, [orders, searchTerm, statusFilter, riderFilter, sortConfig]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Order Management
          </h1>
          <p className="text-gray-600">Manage and track all delivery orders</p>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="All">All Statuses</option>
              <option value="not-assigned">Not Assigned</option>
              <option value="accepted">Accepted</option>
              <option value="in_transit">In Transit</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
            {/* Rider Filter */}
            <select
              value={riderFilter}
              onChange={(e) => setRiderFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="All">All Riders</option>
              <option value="Assigned">Assigned</option>
              <option value="Not Assigned">Not Assigned</option>
            </select>

            {/* Sort */}
            <select
              value={sortConfig.key || ""}
              onChange={(e) =>
                handleSort(e.target.value as keyof Order | "fare.payableAmount")
              }
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Sort by...</option>
              <option value="createdAt">Date Created</option>
              <option value="status">Status</option>
              <option value="fare.payableAmount">Amount</option>
            </select>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rider
                  </th>
                  {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vehicle Type
                  </th> */}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Locations
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fare
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                      <p className="text-gray-500 mt-2">Loading orders...</p>
                    </td>
                  </tr>
                ) : filteredAndSortedOrders.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-6 py-12 text-center text-gray-500"
                    >
                      No orders found
                    </td>
                  </tr>
                ) : (
                  filteredAndSortedOrders.map((order) => {
                    const statusConfig = getStatusConfig(order.status);
                    const isCompleted =
                      order.status === "delivered" ||
                      order.status === "cancelled";

                    return (
                      <tr key={order._id} className="hover:bg-gray-50">
                        {/* Order Details */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm">
                            <p className="text-gray-900 font-medium">
                              #{order._id?.slice(-8)}
                            </p>
                            <div className="flex items-center text-gray-500 mt-1">
                              <FaCalendar className="w-3 h-3 mr-1" />
                              <span className="text-xs">
                                {formatDate(order.createdAt!)}
                              </span>
                            </div>
                            <div className="flex items-center text-gray-500 mt-1">
                              <FaClock className="w-3 h-3 mr-1" />
                              <span className="text-xs">
                                {formatTime(order.createdAt!)}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Customer */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              {order.customer.image ? (
                                <img
                                  className="h-10 w-10 rounded-full object-cover"
                                  src={`${imageBaseUrl}/uploads/customers/${order.customer.image}`}
                                  alt={order.customer.name}
                                />
                              ) : (
                                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                  <FaUser className="w-5 h-5 text-gray-400" />
                                </div>
                              )}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {order.customer.name}
                              </div>
                              <div className="text-sm text-gray-500 flex items-center">
                                <FaPhone className="w-3 h-3 mr-1" />
                                {order.customer.mobile}
                              </div>
                              <div className="flex items-center text-sm text-gray-500">
                                <FaMotorcycle className="w-4 h-4 mr-1" />
                                {order.vehicleType.name}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Rider */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          {order.rider && order.rider._id ? (
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                {order.rider.image ? (
                                  <img
                                    className="h-10 w-10 rounded-full object-cover"
                                    src={`${imageBaseUrl}/${order.rider.image}`}
                                    alt={order.rider.name}
                                  />
                                ) : (
                                  <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                    <FaUser className="w-5 h-5 text-gray-400" />
                                  </div>
                                )}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {order.rider.name}
                                </div>
                                <div className="text-sm text-gray-500 flex items-center">
                                  <FaPhone className="w-3 h-3 mr-1" />
                                  {order.rider.mobile}
                                </div>
                              </div>
                            </div>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                              Not Assigned
                            </span>
                          )}
                        </td>

                        {/* Vehicle Type */}
                        {/* <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm text-gray-900">
                            <FaMotorcycle className="w-4 h-4 mr-2 text-gray-400" />
                            {order.vehicleType.name}
                          </div>
                        </td> */}

                        {/* Locations */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => openLocationModal(order)}
                            className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-100 rounded-md hover:bg-blue-200 transition-colors"
                          >
                            <FaMapMarkerAlt className="w-3 h-3 mr-1" />
                            View Locations
                          </button>
                        </td>

                        {/* Fare */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            <div className="flex items-center">
                              <FaDollarSign className="w-3 h-3 mr-1 text-green-500" />
                              <span className="font-medium">
                                {parseFloat(
                                  order.fare.payableAmount.toString()
                                ).toFixed(2)}
                              </span>
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {parseFloat(order.fare.distance.toString())} km
                            </div>
                            <div className="text-xs text-gray-500">
                              {order.paymentMethod === "online"
                                ? "Online"
                                : "Cash"}
                            </div>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}
                          >
                            {statusConfig.icon}
                            <span className="ml-1 capitalize">
                              {order.status.replace("_", " ")}
                            </span>
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {!isCompleted && (
                            <div className="flex space-x-2 justify-end ">
                              {order.rider && order.rider._id ? (
                                <button
                                  onClick={() =>
                                    openRiderAssignmentModal(order)
                                  }
                                  className="text-blue-600 hover:text-blue-900 bg-blue-100 hover:bg-blue-200 px-2 py-1 rounded text-xs transition-colors"
                                >
                                  Reassign
                                </button>
                              ) : (
                                <button
                                  onClick={() =>
                                    openRiderAssignmentModal(order)
                                  }
                                  className="text-green-600 hover:text-green-900 bg-green-100 hover:bg-green-200 px-2 py-1 rounded text-xs transition-colors"
                                >
                                  Assign
                                </button>
                              )}

                              {order.status !== "cancelled" && (
                                <button
                                  onClick={() => handleCancelOrder(order._id!)}
                                  className="text-red-600 hover:text-red-900 bg-red-100 hover:bg-red-200 px-2 py-1 rounded text-xs transition-colors"
                                >
                                  <MdClose className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() =>
                    setCurrentPage(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing{" "}
                    <span className="font-medium">
                      {Math.min(
                        (currentPage - 1) * itemsPerPage + 1,
                        totalDocs
                      )}
                    </span>{" "}
                    to{" "}
                    <span className="font-medium">
                      {Math.min(currentPage * itemsPerPage, totalDocs)}
                    </span>{" "}
                    of <span className="font-medium">{totalDocs}</span> results
                  </p>
                </div>
                <div>
                  <nav
                    className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                    aria-label="Pagination"
                  >
                    <button
                      onClick={() =>
                        setCurrentPage(Math.max(1, currentPage - 1))
                      }
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const pageNum = i + 1;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            currentPage === pageNum
                              ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                              : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    <button
                      onClick={() =>
                        setCurrentPage(Math.min(totalPages, currentPage + 1))
                      }
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Location Modal */}
      {selectedOrderForLocation && (
        <LocationModal
          isOpen={isLocationModalOpen}
          onClose={() => setIsLocationModalOpen(false)}
          pickupLocation={selectedOrderForLocation.pickupLocation}
          dropLocation={selectedOrderForLocation.dropLocation}
        />
      )}

      {/* Rider Assignment Modal */}
      {selectedOrderForRider && (
        <RiderAssignmentModal
          isOpen={isRiderAssignmentModalOpen}
          onClose={() => setIsRiderAssignmentModalOpen(false)}
          onAssign={handleAssignRider}
          orderId={selectedOrderForRider._id!}
          currentRiderId={selectedOrderForRider.rider?._id}
        />
      )}
    </div>
  );
}

export default OrderListing;
