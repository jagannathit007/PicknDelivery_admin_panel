import  { useState, useEffect, useMemo } from "react";
import {
  FaSearch,
  FaFilter,
  FaMapMarkerAlt,
  FaUser,
  FaPhone,
  FaMotorcycle,
  FaCalendar,
  FaClock,
  FaCheckCircle,
  FaExclamationTriangle,
  FaTruck,
  FaCheck,
  FaTimes,
  FaChevronDown,
  FaRupeeSign,
} from "react-icons/fa";
import OrderService, { Order } from "../../services/OrderService";
import RiderService from "../../services/RiderService";
import UserService from "../../services/userService";
import LocationModal from "../../components/common/LocationModal";
import RiderAssignmentModal from "../../components/common/RiderAssignmentModal";
import OrderTrackingModal from "../../components/common/OrderTrackingModal";
import ActionsDropdown from "../../components/common/ActionsDropdown";
import toastHelper from "../../utils/toastHelper";
import Swal from "sweetalert2";
import { MdClose } from "react-icons/md";

interface SortConfig {
  key: keyof Order | "fare.payableAmount" | null;
  direction: "ascending" | "descending";
}

import type { Customer } from "../../services/userService";

const imageBaseUrl = import.meta.env.VITE_BASE_URL;

function OrderListing() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [customerSearchTerm, setCustomerSearchTerm] = useState("");
  const [isCustomerDropdownOpen, setIsCustomerDropdownOpen] = useState(false);
  const [isLoadingCustomers, setIsLoadingCustomers] = useState(false);
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
  const [isOrderTrackingModalOpen, setIsOrderTrackingModalOpen] =
    useState(false);
  const [selectedOrderForTracking, setSelectedOrderForTracking] =
    useState<Order | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 10;

  // Fetch customers for the dropdown
  const fetchCustomers = async (search = "") => {
    try {
      setIsLoadingCustomers(true);
      const response = await UserService.getCustomers({
        search,
        page: 1,
        limit: 100,
      });
      
      if (response && response.docs) {
        setCustomers(response.docs);
      } else {
        setCustomers([]);
      }
    } catch (error) {
      console.error("Error fetching customers:", error);
      setCustomers([]);
    } finally {
      setIsLoadingCustomers(false);
    }
  };

  // Fetch orders from API
  const fetchOrders = async (
    page = 1,
    customerId = "",
    status = "All",
    rider = "All",
    search = ""
  ) => {
    setLoading(true);
    try {
      const payload: any = {
        page,
        limit: itemsPerPage,
      };

      if (customerId) {
        payload.customer = customerId;
      }

      if (status !== "All") {
        payload.status = status.toLowerCase();
      }

      if (rider !== "All") {
        if (rider === "Assigned") {
          payload.rider = { $exists: true, $ne: null };
        } else if (rider === "Not Assigned") {
          payload.rider = null;
        }
      }

      if (search) {
        payload.search = search;
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
    fetchCustomers();
  }, []);

  useEffect(() => {
    const customerId = selectedCustomer?._id || "";
    fetchOrders(currentPage, customerId, statusFilter, riderFilter, searchTerm);
  }, [currentPage, selectedCustomer, statusFilter, riderFilter, searchTerm]);

  // Handle customer search with debouncing
  const handleCustomerSearch = (searchTerm: string) => {
    setCustomerSearchTerm(searchTerm);
    if ((window as any).customerSearchTimeout) {
      clearTimeout((window as any).customerSearchTimeout);
    }
    
    (window as any).customerSearchTimeout = setTimeout(() => {
      fetchCustomers(searchTerm);
    }, 300);
  };

  // Handle customer selection
  const handleCustomerSelect = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsCustomerDropdownOpen(false);
    setCustomerSearchTerm(customer.name);
  };

  // Clear customer selection
  const clearCustomerSelection = () => {
    setSelectedCustomer(null);
    setCustomerSearchTerm("");
    setIsCustomerDropdownOpen(false);
  };

  // Filtered customers for dropdown
  const filteredCustomers = useMemo(() => {
    if (!customerSearchTerm) return customers;
    return customers.filter(customer =>
      customer.name.toLowerCase().includes(customerSearchTerm.toLowerCase()) ||
      customer.mobile.includes(customerSearchTerm)
    );
  }, [customers, customerSearchTerm]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.customer-dropdown-container')) {
        setIsCustomerDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle sorting
  // const handleSort = (key: keyof Order | "fare.payableAmount") => {
  //   let direction: "ascending" | "descending" = "ascending";
  //   if (sortConfig.key === key && sortConfig.direction === "ascending") {
  //     direction = "descending";
  //   }
  //   setSortConfig({ key, direction });
  // };

  // Get sort icon based on current sort state
  // const getSortIcon = (key: keyof Order) => {
  //   if (sortConfig.key !== key)
  //     return <FaSort className="ml-1 text-gray-400" />;
  //   if (sortConfig.direction === "ascending")
  //     return <FaSortUp className="ml-1 text-gray-600" />;
  //   return <FaSortDown className="ml-1 text-gray-600" />;
  // };

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
      case "created":
        return {
          bg: "bg-gray-100 dark:bg-gray-700",
          text: "text-gray-800 dark:text-gray-200",
          border: "border-gray-200 dark:border-gray-600",
          icon: <FaExclamationTriangle className="w-4 h-4" />,
        };
      case "pending":
        return {
          bg: "bg-orange-100 dark:bg-orange-900/30",
          text: "text-orange-800 dark:text-orange-300",
          border: "border-orange-200 dark:border-orange-800",
          icon: <FaExclamationTriangle className="w-4 h-4" />,
        };
      case "assigned":
        return {
          bg: "bg-blue-100 dark:bg-blue-900/30",
          text: "text-blue-800 dark:text-blue-300",
          border: "border-blue-200 dark:border-blue-800",
          icon: <FaCheckCircle className="w-4 h-4" />,
        };
      case "reassigned":
        return {
          bg: "bg-indigo-100 dark:bg-indigo-900/30",
          text: "text-indigo-800 dark:text-indigo-300",
          border: "border-indigo-200 dark:border-indigo-800",
          icon: <FaCheckCircle className="w-4 h-4" />,
        };
      case "running":
        return {
          bg: "bg-yellow-100 dark:bg-yellow-900/30",
          text: "text-yellow-800 dark:text-yellow-300",
          border: "border-yellow-200 dark:border-yellow-800",
          icon: <FaTruck className="w-4 h-4" />,
        };
      case "delivered":
        return {
          bg: "bg-green-100 dark:bg-green-900/30",
          text: "text-green-800 dark:text-green-300",
          border: "border-green-200 dark:border-green-800",
          icon: <FaCheck className="w-4 h-4" />,
        };
      case "returned":
        return {
          bg: "bg-purple-100 dark:bg-purple-900/30",
          text: "text-purple-800 dark:text-purple-300",
          border: "border-purple-200 dark:border-purple-800",
          icon: <FaTimes className="w-4 h-4" />,
        };
      case "cancelled":
        return {
          bg: "bg-red-100 dark:bg-red-900/30",
          text: "text-red-800 dark:text-red-300",
          border: "border-red-200 dark:border-red-800",
          icon: <FaTimes className="w-4 h-4" />,
        };
      default:
        return {
          bg: "bg-gray-100 dark:bg-gray-700",
          text: "text-gray-800 dark:text-gray-200",
          border: "border-gray-200 dark:border-gray-600",
          icon: <FaExclamationTriangle className="w-4 h-4" />,
        };
    }
  };

  // Handle rider assignment
const handleAssignRider = async (riderId: string) => {
  if (!selectedOrderForRider) return;

  if (
    selectedOrderForRider.status === "delivered" ||
    selectedOrderForRider.status === "cancelled"
  ) {
    toastHelper.error("Cannot assign rider to completed or cancelled order!");
    return;
  }

  const result = await Swal.fire({
    title: "Assign Rider?",
    text: `Are you sure you want to assign this order to the selected rider?`,
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, assign it!",
    cancelButtonText: "No, cancel",
  });

  if (result.isConfirmed) {
    try {
      const response = await OrderService.assignOrder({
        orderId: selectedOrderForRider._id!,
        riderId,
      });

      if (response.status === 200) {
        toastHelper.showTost(response.message, "success");
        fetchOrders(currentPage, selectedCustomer?._id || "", statusFilter, riderFilter, searchTerm);
        // Close the rider assignment modal after successful assignment
        setIsRiderAssignmentModalOpen(false);
      } else {
        toastHelper.error(response.message || "Failed to assign rider");
      }
    } catch (error) {
      console.error("Error assigning rider:", error);
      toastHelper.error("Failed to assign rider");
    }
  }
};

  // Handle order cancellation
  const handleCancelOrder = async (orderId: string) => {
    const order = orders.find((o) => o._id === orderId);
    if (!order) {
      toastHelper.error("Order not found!");
      return;
    }

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
          fetchOrders(currentPage, selectedCustomer?._id || "", statusFilter, riderFilter, searchTerm);
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
    if (order.status === "delivered" || order.status === "cancelled") {
      toastHelper.error("Cannot assign rider to completed or cancelled order!");
      return;
    }

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

  // Open order tracking modal
  const openOrderTrackingModal = (order: Order) => {
    if (!order.rider || !order.rider._id) {
      toastHelper.error("No rider assigned to this order!");
      return;
    }

    if (order.status === "delivered" || order.status === "cancelled") {
      toastHelper.error("Cannot track completed or cancelled order!");
      return;
    }

    setSelectedOrderForTracking(order);
    setIsOrderTrackingModalOpen(true);
  };

  // Filtered and sorted orders
  const filteredAndSortedOrders = useMemo(() => {
    const filtered = [...orders];

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        let aValue: any;
        let bValue: any;

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
  }, [orders, sortConfig]);

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Order Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400">Manage and track all delivery orders</p>
          {selectedCustomer && (
            <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
              <p className="text-sm text-blue-800 dark:text-blue-300">
                <span className="font-medium">Filtered by:</span> {selectedCustomer.name} ({selectedCustomer.mobile})
                {totalDocs > 0 && (
                  <span className="ml-2 text-blue-600 dark:text-blue-400">
                    • {totalDocs} order{totalDocs !== 1 ? 's' : ''} found
                  </span>
                )}
              </p>
            </div>
          )}
        </div>

        {/* Filters and Search */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
            {/* Search Input */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Search Orders
              </label>
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                <input
                  type="text"
                  placeholder="Search by order number, customer name, mobile..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ease-in-out text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
              </div>
            </div>
            {/* Customer Searchable Select */}
            <div className="relative customer-dropdown-container flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Search by Customer
              </label>
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                <input
                  type="text"
                  placeholder="Type customer name or mobile..."
                  value={customerSearchTerm}
                  onChange={(e) => handleCustomerSearch(e.target.value)}
                  onFocus={() => setIsCustomerDropdownOpen(true)}
                  className="w-full pl-10 pr-12 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ease-in-out text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
                {selectedCustomer ? (
                  <button
                    onClick={clearCustomerSelection}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    <MdClose className="w-5 h-5 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors" />
                  </button>
                ) : (
                  <button
                    onClick={() => setIsCustomerDropdownOpen(!isCustomerDropdownOpen)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    <FaChevronDown className="w-4 h-4 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors" />
                  </button>
                )}
              </div>
              
              {/* Customer Dropdown */}
              {isCustomerDropdownOpen && (
                <div className="absolute z-50 w-full mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-xl max-h-80 overflow-auto transition-all duration-200 ease-in-out transform origin-top">
                  {isLoadingCustomers ? (
                    <div className="px-4 py-3 text-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500 mx-auto"></div>
                      <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">Searching...</p>
                    </div>
                  ) : filteredCustomers.length === 0 ? (
                    <div className="px-4 py-3 text-gray-500 dark:text-gray-400 text-sm">
                      {customerSearchTerm ? 'No customers found' : 'Type to search customers'}
                    </div>
                  ) : (
                    filteredCustomers.map((customer) => (
                      <button
                        key={customer._id}
                        onClick={() => handleCustomerSelect(customer)}
                        className="w-full text-left px-4 py-3 hover:bg-blue-50 dark:hover:bg-gray-700 focus:bg-blue-50 dark:focus:bg-gray-700 focus:outline-none transition-colors duration-150"
                      >
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8 mr-3">
                            {customer.image ? (
                              <img
                                className="h-8 w-8 rounded-full object-cover"
                                src={`${imageBaseUrl}/${customer.image}`}
                                alt={customer.name}
                              />
                            ) : (
                              <div className="h-8 w-8 rounded-full bg-gray-100 dark:bg-gray-600 flex items-center justify-center">
                                <FaUser className="w-4 h-4 text-gray-400 dark:text-gray-300" />
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {customer.name}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {customer.mobile}
                            </div>
                          </div>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Status Filter */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Status
              </label>
              <div className="relative">
                <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full pl-10 pr-8 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none transition-all duration-200 ease-in-out text-sm text-gray-900 dark:text-white"
                >
                  <option value="All">All Statuses</option>
                  <option value="created">Created</option>
                  <option value="pending">Pending</option>
                  <option value="assigned">Assigned</option>
                  <option value="reassigned">Reassigned</option>
                  <option value="running">Running</option>
                  <option value="delivered">Delivered</option>
                  <option value="returned">Returned</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <FaChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none" />
              </div>
            </div>

            {/* Rider Filter */}
            {/* <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rider
              </label>
              <div className="relative">
                <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <select
                  value={riderFilter}
                  onChange={(e) => setRiderFilter(e.target.value)}
                  className="w-full pl-10 pr-8 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none transition-all duration-200 ease-in-out text-sm"
                >
                  <option value="All">All Riders</option>
                  <option value="Assigned">Assigned</option>
                  <option value="Not Assigned">Not Assigned</option>
                </select>
                <FaChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div> */}

            {/* Sort */}
            {/* <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort By
              </label>
              <div className="relative">
                <FaSort className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <select
                  value={sortConfig.key || ""}
                  onChange={(e) =>
                    handleSort(e.target.value as keyof Order | "fare.payableAmount")
                  }
                  className="w-full pl-10 pr-8 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none transition-all duration-200 ease-in-out text-sm"
                >
                  <option value="">Sort by...</option>
                  <option value="createdAt">Date Created</option>
                  <option value="status">Status</option>
                  <option value="fare.payableAmount">Amount</option>
                </select>
                <FaChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div> */}
          </div>
          
          {/* Clear All Filters Button */}
          {(selectedCustomer || statusFilter !== "All" || riderFilter !== "All" || sortConfig.key || searchTerm) && (
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => {
                  setSelectedCustomer(null);
                  setCustomerSearchTerm("");
                  setStatusFilter("All");
                  setRiderFilter("All");
                  setSortConfig({ key: null, direction: "ascending" });
                  setSearchTerm("");
                }}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-all duration-200 ease-in-out hover:shadow-sm"
              >
                <FaTimes className="w-4 h-4 mr-2" />
                Clear All Filters
              </button>
            </div>
          )}
        </div>

        {/* Orders Table - Desktop View */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hidden lg:block">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-3 sm:px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-32 sm:w-40">
                    Order Details
                  </th>
                  <th className="px-3 sm:px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-40 sm:w-48">
                    Customer
                  </th>
                  <th className="px-3 sm:px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-32 sm:w-40 hidden sm:table-cell">
                    Rider
                  </th>
                  <th className="px-3 sm:px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-24 sm:w-32">
                    Locations
                  </th>
                  <th className="px-3 sm:px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-24 sm:w-32">
                    Fare
                  </th>
                  <th className="px-3 sm:px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-20 sm:w-24">
                    Status
                  </th>
                  <th className="px-3 sm:px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-10 sm:w-10">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-3 sm:px-4 lg:px-6 py-12 text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                      <p className="text-gray-500 dark:text-gray-400 mt-2">Loading orders...</p>
                    </td>
                  </tr>
                ) : filteredAndSortedOrders.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-3 sm:px-4 lg:px-6 py-12 text-center text-gray-500 dark:text-gray-400"
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
                      <tr key={order._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <td className="px-3 sm:px-4 lg:px-6 py-4">
                          <div className="text-sm">
                            <p className="text-gray-900 dark:text-white font-medium truncate">
                              #{order.orderNo || `#${order._id?.slice(-8)}`}
                            </p>
                            <div className="flex items-center text-gray-500 dark:text-gray-400 mt-1">
                              <FaCalendar className="w-3 h-3 mr-1 flex-shrink-0" />
                              <span className="text-xs truncate">
                                {formatDate(order.createdAt!)}
                              </span>
                            </div>
                            <div className="flex items-center text-gray-500 dark:text-gray-400 mt-1">
                              <FaClock className="w-3 h-3 mr-1 flex-shrink-0" />
                              <span className="text-xs truncate">
                                {formatTime(order.createdAt!)}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-3 sm:px-4 lg:px-6 py-4">
                          <div className="flex items-center">
                            <div className="min-w-0 flex-1">
                              <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                {order.customer.name}
                              </div>
                              <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 flex items-center">
                                <FaPhone className="w-3 h-3 mr-1 flex-shrink-0" />
                                <span className="truncate">{order.customer.mobile}</span>
                              </div>
                              <div className="flex items-center text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                                <FaMotorcycle className="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0" />
                                <span className="truncate">{order.vehicleType.name}</span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-3 sm:px-4 lg:px-6 py-4 hidden sm:table-cell">
                          {order.rider && order.rider._id ? (
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10">
                                {order.rider.image ? (
                                  <img
                                    className="h-8 w-8 sm:h-10 sm:w-10 rounded-full object-cover"
                                    src={`${imageBaseUrl}/${order.rider.image}`}
                                    alt={order.rider.name}
                                  />
                                ) : (
                                  <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                                    <FaUser className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 dark:text-gray-300" />
                                  </div>
                                )}
                              </div>
                              <div className="ml-2 sm:ml-4 min-w-0 flex-1">
                                <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                  {order.rider.name}
                                </div>
                                <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 flex items-center">
                                  <FaPhone className="w-3 h-3 mr-1 flex-shrink-0" />
                                  <span className="truncate">{order.rider.mobile}</span>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300">
                              Not Assigned
                            </span>
                          )}
                        </td>
                        <td className="px-3 sm:px-4 lg:px-6 py-4">
                          <button
                            onClick={() => openLocationModal(order)}
                            className="inline-flex items-center px-2 py-1 text-xs font-medium text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/30 rounded-md hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                          >
                            <FaMapMarkerAlt className="w-3 h-3 mr-1" />
                            <span className="hidden sm:inline">Locations</span>
                            <span className="sm:hidden">View</span>
                          </button>
                        </td>
                        <td className="px-3 sm:px-4 lg:px-6 py-4">
                          <div className="text-sm text-gray-900 dark:text-white">
                            <div className="flex items-center">
                              <FaRupeeSign className="w-3 h-3 mr-0 text-green-500 dark:text-green-400 flex-shrink-0" />
                              <span className="font-medium truncate">
                                {parseFloat(
                                  order.fare.payableAmount.toString()
                                ).toFixed(2)}
                              </span>
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">
                              {parseFloat(order.fare.distance.toString())} km
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                              {order.paymentMethod === "online"
                                ? "Online"
                                : "Cash"}
                            </div>
                          </div>
                        </td>
                        <td className="px-3 sm:px-4 lg:px-6 py-4">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}
                          >
                            {statusConfig.icon}
                            <span className="ml-1 capitalize truncate">
                              {order.status.replace("_", " ")}
                            </span>
                          </span>
                        </td>
                        <td className="px-3 sm:px-4 lg:px-6 py-4 text-sm font-medium w-10">
                          <div className="flex justify-end">
                            <ActionsDropdown
                              order={order}
                              onViewLocations={() => openLocationModal(order)}
                              onTrackOrder={order.rider && order.rider._id && !isCompleted ? () => openOrderTrackingModal(order) : undefined}
                              onAssignRider={!order.rider || !order.rider._id ? () => openRiderAssignmentModal(order) : undefined}
                              onReassignRider={order.rider && order.rider._id ? () => openRiderAssignmentModal(order) : undefined}
                              onCancelOrder={order.status !== "cancelled" ? () => handleCancelOrder(order._id!) : undefined}
                              isCompleted={isCompleted}
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          {totalPages > 1 && (
            <div className="bg-white dark:bg-gray-800 px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 sm:px-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() =>
                    setCurrentPage(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
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
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
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
                              ? "z-10 bg-blue-50 dark:bg-blue-900/30 border-blue-500 dark:border-blue-600 text-blue-600 dark:text-blue-300"
                              : "bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600"
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
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Mobile Card View */}
        <div className="lg:hidden space-y-4">
          {loading ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
              <p className="text-gray-500 dark:text-gray-400 mt-2">Loading orders...</p>
            </div>
          ) : filteredAndSortedOrders.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 text-center text-gray-500 dark:text-gray-400">
              No orders found
            </div>
          ) : (
            filteredAndSortedOrders.map((order) => {
              const statusConfig = getStatusConfig(order.status);
              const isCompleted =
                order.status === "delivered" ||
                order.status === "cancelled";

              return (
                <div key={order._id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
                  {/* Order Header */}
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                        {order.orderNo || `#${order._id?.slice(-8)}`}
                      </h3>
                      <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1">
                        <FaCalendar className="w-3 h-3 mr-1" />
                        <span>{formatDate(order.createdAt!)}</span>
                        <FaClock className="w-3 h-3 ml-2 mr-1" />
                        <span>{formatTime(order.createdAt!)}</span>
                      </div>
                    </div>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}
                    >
                      {statusConfig.icon}
                      <span className="ml-1 capitalize">
                        {order.status.replace("_", " ")}
                      </span>
                    </span>
                  </div>

                  {/* Customer Info */}
                  <div className="flex items-center mb-3">
                    <div className="flex-shrink-0 h-8 w-8">
                      {order.customer.image ? (
                        <img
                          className="h-8 w-8 rounded-full object-cover"
                          src={`${imageBaseUrl}/${order.customer.image}`}
                          alt={order.customer.name}
                        />
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                          <FaUser className="w-4 h-4 text-gray-400 dark:text-gray-300" />
                        </div>
                      )}
                    </div>
                    <div className="ml-3 min-w-0 flex-1">
                      <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {order.customer.name}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                        <FaPhone className="w-3 h-3 mr-1" />
                        <span className="truncate">{order.customer.mobile}</span>
                      </div>
                    </div>
                  </div>

                  {/* Rider Info */}
                  {order.rider && order.rider._id && (
                    <div className="flex items-center mb-3">
                      <div className="flex-shrink-0 h-8 w-8">
                        {order.rider.image ? (
                          <img
                            className="h-8 w-8 rounded-full object-cover"
                            src={`${imageBaseUrl}/${order.rider.image}`}
                            alt={order.rider.name}
                          />
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                            <FaUser className="w-4 h-4 text-gray-400 dark:text-gray-300" />
                          </div>
                        )}
                      </div>
                      <div className="ml-3 min-w-0 flex-1">
                        <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {order.rider.name}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                          <FaPhone className="w-3 h-3 mr-1" />
                          <span className="truncate">{order.rider.mobile}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Order Details */}
                  <div className="grid grid-cols-2 gap-3 mb-3 text-xs">
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Fare:</span>
                      <div className="flex items-center text-gray-900 dark:text-white font-medium">
                        <FaRupeeSign className="w-3 h-3 mr-1 text-green-500 dark:text-green-400" />
                        {parseFloat(order.fare.payableAmount.toString()).toFixed(2)}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Distance:</span>
                      <div className="text-gray-900 dark:text-white">
                        {parseFloat(order.fare.distance.toString())} km
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Vehicle:</span>
                      <div className="text-gray-900 dark:text-white">
                        {order.vehicleType.name}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Payment:</span>
                      <div className="text-gray-900 dark:text-white">
                        {order.paymentMethod === "online" ? "Online" : "Cash"}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end">
                    <ActionsDropdown
                      order={order}
                      onViewLocations={() => openLocationModal(order)}
                      onTrackOrder={order.rider && order.rider._id && !isCompleted ? () => openOrderTrackingModal(order) : undefined}
                      onAssignRider={!order.rider || !order.rider._id ? () => openRiderAssignmentModal(order) : undefined}
                      onReassignRider={order.rider && order.rider._id ? () => openRiderAssignmentModal(order) : undefined}
                      onCancelOrder={order.status !== "cancelled" ? () => handleCancelOrder(order._id!) : undefined}
                      isCompleted={isCompleted}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
      {selectedOrderForLocation && (
        <LocationModal
          isOpen={isLocationModalOpen}
          onClose={() => setIsLocationModalOpen(false)}
          pickupLocation={selectedOrderForLocation.pickupLocation}
          dropLocation={selectedOrderForLocation.dropLocation}
        />
      )}
      {selectedOrderForRider && (
        <RiderAssignmentModal
          isOpen={isRiderAssignmentModalOpen}
          onClose={() => setIsRiderAssignmentModalOpen(false)}
          onAssign={handleAssignRider}
          orderId={selectedOrderForRider._id!}
          currentRiderId={selectedOrderForRider.rider?._id}
        />
      )}
      {selectedOrderForTracking && (
        <OrderTrackingModal
          isOpen={isOrderTrackingModalOpen}
          onClose={() => setIsOrderTrackingModalOpen(false)}
          orderId={selectedOrderForTracking._id!}
          orderNo={selectedOrderForTracking.orderNo}
        />
      )}
    </div>
  );
}

export default OrderListing;