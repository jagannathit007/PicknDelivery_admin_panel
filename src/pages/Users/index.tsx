import { useState, useMemo, useEffect } from "react";
import {
  FaSearch,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaUsers,
  FaFilter,
  FaPlus,
  FaEdit,
  FaTrash,
} from "react-icons/fa";
import UserService, { Customer, CustomerPayload } from "../../services/UserService";
import CustomerModal from "../../components/common/CustomerModal";
import toastHelper from "../../utils/toastHelper";

interface SortConfig {
  key: keyof Customer | null;
  direction: "ascending" | "descending";
}

const imageBaseUrl = import.meta.env.VITE_BASE_URL;

function UserTable() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("All");
  const [verifiedFilter, setVerifiedFilter] = useState("All");
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: null,
    direction: "ascending",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [totalDocs, setTotalDocs] = useState(0);
  const itemsPerPage = 10;

  // Fetch customers from API
  const fetchCustomers = async (page = 1, search = "") => {
    setLoading(true);
    try {
      const response = await UserService.getCustomers({
        page,
        limit: itemsPerPage,
        search,
      });
      
      if (response && response.data) {
        setCustomers(response.data.docs);
        setTotalPages(response.data.totalPages);
        setTotalDocs(response.data.totalDocs);
      }
    } catch (error) {
      console.error("Error fetching customers:", error);
      toastHelper.error("Failed to fetch customers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers(currentPage, searchTerm);
  }, [currentPage, searchTerm]);

  // Handle sorting
  const handleSort = (key: keyof Customer) => {
    let direction: "ascending" | "descending" = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  // Get sort icon based on current sort state
  const getSortIcon = (key: keyof Customer) => {
    if (sortConfig.key !== key)
      return <FaSort className="ml-2 text-gray-400" />;
    if (sortConfig.direction === "ascending")
      return <FaSortUp className="ml-2 text-blue-600" />;
    return <FaSortDown className="ml-2 text-blue-600" />;
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Filter and sort customers
  const filteredCustomers = useMemo(() => {
    const filtered = customers.filter((customer) => {
      const matchesSearch =
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.mobile.includes(searchTerm);

      const matchesStatus =
        statusFilter === "All" || 
        (statusFilter === "Active" && customer.isActive) ||
        (statusFilter === "Inactive" && !customer.isActive);
      
      const matchesVerified =
        verifiedFilter === "All" || 
        (verifiedFilter === "Yes" && customer.isVerified) ||
        (verifiedFilter === "No" && !customer.isVerified);

      return matchesSearch && matchesStatus && matchesVerified;
    });

    // Apply sorting if a sort key is selected
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        const aValue = a[sortConfig.key as keyof Customer];
        const bValue = b[sortConfig.key as keyof Customer];

        // Handle undefined values
        if (aValue === undefined && bValue === undefined) return 0;
        if (aValue === undefined) return sortConfig.direction === "ascending" ? 1 : -1;
        if (bValue === undefined) return sortConfig.direction === "ascending" ? -1 : 1;

        // Special handling for date sorting
        if (sortConfig.key === "createdAt" || sortConfig.key === "updatedAt") {
          const aDate = new Date(aValue as string).getTime();
          const bDate = new Date(bValue as string).getTime();

          if (aDate < bDate) {
            return sortConfig.direction === "ascending" ? -1 : 1;
          }
          if (aDate > bDate) {
            return sortConfig.direction === "ascending" ? 1 : -1;
          }
          return 0;
        }

        if (aValue < bValue) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }

    return filtered;
  }, [customers, searchTerm, sortConfig, statusFilter, verifiedFilter]);

  // Handle customer save (create/update)
  const handleSaveCustomer = async (customerData: CustomerPayload) => {
    setIsSaving(true);
    try {
      const response = await UserService.saveCustomer(customerData);
      if (response) {
        setIsModalOpen(false);
        setSelectedCustomer(null);
        fetchCustomers(currentPage, searchTerm);
      }
    } catch (error) {
      console.error("Error saving customer:", error);
    } finally {
      setIsSaving(false);
    }
  };

  // Handle customer delete
  const handleDeleteCustomer = async (customerId: string) => {
    const confirmed = await new Promise<boolean>((resolve) => {
      toastHelper.warning("Are you sure you want to delete this customer?");
      // Note: This is a simplified confirmation. In a real app, you'd use a proper confirmation dialog
      resolve(window.confirm("Are you sure you want to delete this customer?"));
    });

    if (!confirmed) return;

    setIsDeleting(true);
    try {
      const response = await UserService.deleteCustomer(customerId);
      if (response) {
        fetchCustomers(currentPage, searchTerm);
      }
    } catch (error) {
      console.error("Error deleting customer:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle edit customer
  const handleEditCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsModalOpen(true);
  };

  // Handle add new customer
  const handleAddCustomer = () => {
    setSelectedCustomer(null);
    setIsModalOpen(true);
  };

  // Calculate statistics
  const activeCustomers = customers.filter(
    (customer) => customer.isActive
  ).length;
  const verifiedCustomers = customers.filter(
    (customer) => customer.isVerified
  ).length;

  return (
    <div className="container mx-auto p-8">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold mb-2 text-blue-800">Customers</h1>
          </div>

          {/* Add Customer Button */}
          <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
            <button
              onClick={handleAddCustomer}
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <FaPlus className="mr-2" />
              Add Customer
            </button>

            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
              <div className="flex-1 relative">
                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search customers by name or mobile..."
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>
              <div className="flex space-x-4">
                <div className="flex items-center space-x-2">
                  <FaFilter className="text-gray-400" />
                  <select
                    value={statusFilter}
                    onChange={(e) => {
                      setStatusFilter(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="All">All Status</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
                <select
                  value={verifiedFilter}
                  onChange={(e) => {
                    setVerifiedFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="All">All Verification</option>
                  <option value="Yes">Verified</option>
                  <option value="No">Unverified</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-800">Total Customers</p>
                <p className="text-3xl font-bold text-gray-900">
                  {totalDocs}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <FaUsers className="text-2xl text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-800">
                  Active Customers
                </p>
                <p className="text-3xl font-bold text-green-600">
                  {activeCustomers}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <div className="w-6 h-6 bg-green-600 rounded-full"></div>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-800">
                  Verified Customers
                </p>
                <p className="text-3xl font-bold text-blue-600">
                  {verifiedCustomers}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-800">
                  Inactive Customers
                </p>
                <p className="text-3xl font-bold text-red-600">
                  {customers.length - activeCustomers}
                </p>
              </div>
              <div className="p-3 bg-red-100 rounded-full">
                <div className="w-6 h-6 bg-red-600 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-blue-100">
              <tr>
                <th className="text-left p-6 text-blue-800 font-semibold">
                  Customer
                </th>
                <th
                  className="text-left p-6 text-blue-800 font-semibold cursor-pointer hover:bg-blue-200 transition-colors duration-200"
                  onClick={() => handleSort("name")}
                >
                  <div className="flex items-center">
                    Name
                    {getSortIcon("name")}
                  </div>
                </th>
                <th className="text-left p-6 text-blue-800 font-semibold">
                  Mobile
                </th>
                <th
                  className="text-left p-6 text-blue-800 font-semibold cursor-pointer hover:bg-blue-200 transition-colors duration-200"
                  onClick={() => handleSort("createdAt")}
                >
                  <div className="flex items-center">
                    Created Date
                    {getSortIcon("createdAt")}
                  </div>
                </th>
                <th
                  className="text-left p-6 text-blue-800 font-semibold cursor-pointer hover:bg-blue-200 transition-colors duration-200"
                  onClick={() => handleSort("isActive")}
                >
                  <div className="flex items-center">
                    Status
                    {getSortIcon("isActive")}
                  </div>
                </th>
                <th className="text-left p-6 text-blue-800 font-semibold">
                  Verified
                </th>
                <th className="text-left p-6 text-blue-800 font-semibold">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center">
                    <div className="text-gray-400 text-lg">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                      Loading customers...
                    </div>
                  </td>
                </tr>
              ) : filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center">
                    <div className="text-gray-400 text-lg">
                      <FaUsers className="mx-auto text-4xl mb-4" />
                      No customers found matching your criteria
                    </div>
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((customer) => (
                  <tr
                    key={customer._id}
                    className="hover:bg-blue-50 transition-all duration-200 group"
                  >
                    <td className="p-6">
                      <div className="flex items-center space-x-4">
                        <div className="relative">
                          <img
                            src={imageBaseUrl ? imageBaseUrl + '/' + customer.image : "https://via.placeholder.com/48x48?text=No+Image"}
                            alt={customer.name}
                            className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                          />
                        </div>
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="font-semibold text-gray-900">
                        {customer.name}
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="text-gray-600 font-mono">{customer.mobile}</div>
                    </td>
                    <td className="p-6">
                      <div className="text-gray-600">
                        {customer.createdAt ? formatDate(customer.createdAt) : "N/A"}
                      </div>
                    </td>
                    <td className="p-6">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          customer.isActive
                            ? "bg-green-100 text-green-800 border border-green-200"
                            : "bg-red-100 text-red-800 border border-red-200"
                        }`}
                      >
                        <div
                          className={`w-2 h-2 rounded-full mr-2 ${
                            customer.isActive
                              ? "bg-green-500"
                              : "bg-red-500"
                          }`}
                        ></div>
                        {customer.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="p-6">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          customer.isVerified
                            ? "bg-blue-100 text-blue-800 border border-blue-200"
                            : "bg-gray-100 text-gray-800 border border-gray-200"
                        }`}
                      >
                        {customer.isVerified ? "✓" : "○"}{" "}
                        {customer.isVerified ? "Verified" : "Pending"}
                      </span>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <button
                          onClick={() => handleEditCustomer(customer)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors duration-200"
                          title="Edit"
                        >
                          <FaEdit className="w-4 h-4" />
                        </button>
                        {/* <button
                          onClick={() => handleDeleteCustomer(customer._id!)}
                          disabled={isDeleting}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors duration-200 disabled:opacity-50"
                          title="Delete"
                        >
                          <FaTrash className="w-4 h-4" />
                        </button> */}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between mt-8 space-y-4 sm:space-y-0">
        <div className="text-gray-600">
          Showing {customers.length} of {totalDocs} customers
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
          >
            Previous
          </button>

          {/* Page Numbers */}
          <div className="flex space-x-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum = i + 1;
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                    currentPage === pageNum
                      ? "bg-blue-600 text-white shadow-lg"
                      : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 shadow-sm hover:shadow-md"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
          >
            Next
          </button>
        </div>
      </div>

      {/* Customer Modal */}
      <CustomerModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedCustomer(null);
        }}
        onSave={handleSaveCustomer}
        customer={selectedCustomer}
        isLoading={isSaving}
      />
    </div>
  );
}

export default UserTable;
