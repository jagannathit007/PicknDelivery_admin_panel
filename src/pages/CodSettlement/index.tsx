import { useState, useMemo, useEffect } from "react";
import {
  FaSearch,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaMotorcycle,
  FaFilter,
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaIdCard,
  FaCreditCard,
} from "react-icons/fa";
import RiderService, { Rider, RiderPayload } from "../../services/RiderService";
import RiderModal from "../../components/common/RiderModal";
import toastHelper from "../../utils/toastHelper";
import Swal from "sweetalert2";

interface SortConfig {
  key: keyof Rider | null;
  direction: "ascending" | "descending";
}

const imageBaseUrl = import.meta.env.VITE_BASE_URL;

function CodSettlement() {
  const [riders, setRiders] = useState<Rider[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("All");
  const [verifiedFilter, setVerifiedFilter] = useState("All");
  const [dutyFilter, setDutyFilter] = useState("All");
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: null,
    direction: "ascending",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRider, setSelectedRider] = useState<Rider | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [totalDocs, setTotalDocs] = useState(0);
  const itemsPerPage = 10;

  // Fetch riders from API
  const fetchRiders = async (page = 1, search = "") => {
    setLoading(true);
    try {
      const response = await RiderService.getRiders({
        page,
        limit: itemsPerPage,
        search,
      });

      if (response && response.data) {
        setRiders(response.data.docs);
        setTotalPages(response.data.totalPages);
        setTotalDocs(response.data.totalDocs);
      }
    } catch (error) {
      console.error("Error fetching riders:", error);
      toastHelper.error("Failed to fetch riders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRiders(currentPage, searchTerm);
  }, [currentPage, searchTerm]);

  // Handle sorting
  const handleSort = (key: keyof Rider) => {
    let direction: "ascending" | "descending" = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  // Get sort icon based on current sort state
  const getSortIcon = (key: keyof Rider) => {
    if (sortConfig.key !== key)
      return <FaSort className="ml-1 text-gray-400" />;
    if (sortConfig.direction === "ascending")
      return <FaSortUp className="ml-1 text-gray-600" />;
    return <FaSortDown className="ml-1 text-gray-600" />;
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

  // Filter and sort riders
  const filteredRiders = useMemo(() => {
    const filtered = riders.filter((rider) => {
      const matchesSearch =
        rider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rider.mobile.includes(searchTerm) ||
        (rider.emailId &&
          rider.emailId.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesStatus =
        statusFilter === "All" ||
        (statusFilter === "Active" && rider.isActive) ||
        (statusFilter === "Inactive" && !rider.isActive);

      const matchesVerified =
        verifiedFilter === "All" ||
        (verifiedFilter === "Yes" && rider.isVerified) ||
        (verifiedFilter === "No" && !rider.isVerified);

      const matchesDuty =
        dutyFilter === "All" ||
        (dutyFilter === "On Duty" && rider.isDuty) ||
        (dutyFilter === "Off Duty" && !rider.isDuty);

      return matchesSearch && matchesStatus && matchesVerified && matchesDuty;
    });

    // Apply sorting if a sort key is selected
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        const aValue = a[sortConfig.key as keyof Rider];
        const bValue = b[sortConfig.key as keyof Rider];

        // Handle undefined values
        if (aValue === undefined && bValue === undefined) return 0;
        if (aValue === undefined)
          return sortConfig.direction === "ascending" ? 1 : -1;
        if (bValue === undefined)
          return sortConfig.direction === "ascending" ? -1 : 1;

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
  }, [
    riders,
    searchTerm,
    sortConfig,
    statusFilter,
    verifiedFilter,
    dutyFilter,
  ]);

  // Handle rider save (create/update)
  const handleSaveRider = async (riderData: RiderPayload) => {
    setIsSaving(true);
    try {
      const response = await RiderService.saveRider(riderData);
      if (response) {
        setIsModalOpen(false);
        setSelectedRider(null);
        fetchRiders(currentPage, searchTerm);
      }
    } catch (error) {
      console.error("Error saving rider:", error);
    } finally {
      setIsSaving(false);
    }
  };

  // Handle rider delete
  const handleDeleteRider = async (riderId: string) => {
    const confirmed = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      cancelButtonText: "No, cancel!",

      confirmButtonText: "Yes, delete it!",
    });

    if (!confirmed.isConfirmed) return;

    setIsDeleting(true);
    try {
      const response = await RiderService.deleteRider(riderId);
      if (response) {
        fetchRiders(currentPage, searchTerm);
      }
    } catch (error) {
      console.error("Error deleting rider:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle edit rider
  const handleEditRider = (rider: Rider) => {
    setSelectedRider(rider);
    setIsModalOpen(true);
  };

  // Handle add new rider
  const handleAddRider = () => {
    setSelectedRider(null);
    setIsModalOpen(true);
  };

  // Calculate statistics
  const activeRiders = riders.filter((rider) => rider.isActive).length;
  const verifiedRiders = riders.filter((rider) => rider.isVerified).length;
  const onDutyRiders = riders.filter((rider) => rider.isDuty).length;

  return (
    <div className="p-6">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-white/90">
          Riders Management
        </h1>
        <p className="text-gray-500 text-sm dark:text-gray-400 mt-1">
          Manage your delivery riders and their information
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-gray-800 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Total Riders
              </p>
              <p className="text-2xl font-semibold text-gray-800 dark:text-white/90">
                {totalDocs}
              </p>
            </div>
            <div className="p-2 bg-blue-50 dark:bg-blue-500/10 rounded-lg">
              <FaMotorcycle className="text-blue-600 dark:text-blue-400 text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-gray-800 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Active Riders
              </p>
              <p className="text-2xl font-semibold text-gray-800 dark:text-white/90">
                {activeRiders}
              </p>
            </div>
            <div className="p-2 bg-green-50 dark:bg-green-500/10 rounded-lg">
              <FaCheckCircle className="text-green-600 dark:text-green-400 text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-gray-800 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Verified Riders
              </p>
              <p className="text-2xl font-semibold text-gray-800 dark:text-white/90">
                {verifiedRiders}
              </p>
            </div>
            <div className="p-2 bg-purple-50 dark:bg-purple-500/10 rounded-lg">
              <FaIdCard className="text-purple-600 dark:text-purple-400 text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-gray-800 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                On Duty
              </p>
              <p className="text-2xl font-semibold text-gray-800 dark:text-white/90">
                {onDutyRiders}
              </p>
            </div>
            <div className="p-2 bg-orange-50 dark:bg-orange-500/10 rounded-lg">
              <FaClock className="text-orange-600 dark:text-orange-400 text-xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        {/* Table Header with Controls */}
        <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search riders by name, mobile, or email..."
                className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>

            {/* Filters */}
            <div className="flex items-center gap-2">
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="All">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>

              <select
                value={verifiedFilter}
                onChange={(e) => {
                  setVerifiedFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="All">All Verification</option>
                <option value="Yes">Verified</option>
                <option value="No">Unverified</option>
              </select>

              <select
                value={dutyFilter}
                onChange={(e) => {
                  setDutyFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="All">All Duty Status</option>
                <option value="On Duty">On Duty</option>
                <option value="Off Duty">Off Duty</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleAddRider}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/[0.03]"
          >
            <FaPlus className="text-xs" />
            Add Rider
          </button>
        </div>

        {/* Table */}
        <div className="max-w-full overflow-x-auto">
          <table className="w-full">
            {/* Table Header */}
            <thead className="border-b border-gray-100 dark:border-gray-800">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                  Rider
                </th>
                <th
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 cursor-pointer hover:text-gray-700 dark:hover:text-gray-200"
                  onClick={() => handleSort("name")}
                >
                  <div className="flex items-center">
                    Name
                    {getSortIcon("name")}
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                  Contact
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                  Vehicle
                </th>
                <th
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 cursor-pointer hover:text-gray-700 dark:hover:text-gray-200"
                  onClick={() => handleSort("createdAt")}
                >
                  <div className="flex items-center">
                    Joined Date
                    {getSortIcon("createdAt")}
                  </div>
                </th>
                <th
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 cursor-pointer hover:text-gray-700 dark:hover:text-gray-200"
                  onClick={() => handleSort("isActive")}
                >
                  <div className="flex items-center">
                    Status
                    {getSortIcon("isActive")}
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                  Verification
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                  Duty Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                  Actions
                </th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {loading ? (
                <tr>
                  <td colSpan={9} className="p-12 text-center">
                    <div className="text-gray-400 text-lg">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                      Loading riders...
                    </div>
                  </td>
                </tr>
              ) : filteredRiders.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-12 text-center">
                    <div className="text-gray-400 text-lg">
                      <FaMotorcycle className="mx-auto text-4xl mb-4" />
                      No riders found matching your criteria
                    </div>
                  </td>
                </tr>
              ) : (
                filteredRiders.map((rider) => (
                  <tr
                    key={rider._id}
                    className="hover:bg-gray-50 dark:hover:bg-white/[0.02]"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <div className="relative">
                          <img
                            src={
                              rider.image
                                ? imageBaseUrl + "/" + rider.image
                                : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRu2XUjKXh-LnMkWDgqaXlVXJ6dJTfLBxIbnQ&s"
                            }
                            alt={rider.name}
                            className="w-10 h-10 rounded-full object-cover border border-gray-200 dark:border-gray-700"
                          />
                          {rider.isVerified && (
                            <div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-0.5">
                              <FaCheckCircle className="w-2 h-2 text-white" />
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-800 dark:text-white/90 text-sm">
                        {rider.name}
                      </div>
                      {rider.emailId && (
                        <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center mt-1">
                          <FaEnvelope className="w-2 h-2 mr-1" />
                          {rider.emailId}
                        </div>
                      )}
                    </td>

                    <td className="px-4 py-3">
                      <div className="text-gray-600 dark:text-gray-400 text-sm flex items-center">
                        <FaPhone className="w-2 h-2 mr-1" />
                        {rider.mobile}
                      </div>
                      {rider.address && (
                        <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center mt-1">
                          <FaMapMarkerAlt className="w-2 h-2 mr-1" />
                          {rider.address.length > 30
                            ? rider.address.substring(0, 30) + "..."
                            : rider.address}
                        </div>
                      )}
                    </td>

                    <td className="px-4 py-3">
                      <div className="text-gray-600 dark:text-gray-400 text-sm">
                        <div className="font-medium">
                          {rider.vehicleName || "N/A"}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {rider.vehicleNumber || "N/A"}
                        </div>
                        {rider.vehicleType && (
                          <span className="inline-block px-2 py-0.5 text-xs bg-purple-100 dark:bg-purple-500/10 text-purple-800 dark:text-purple-400 rounded-full mt-1">
                            {rider.vehicleType.name}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400 text-sm">
                      {rider.createdAt ? formatDate(rider.createdAt) : "N/A"}
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          rider.isActive
                            ? "bg-green-100 text-green-800 dark:bg-green-500/10 dark:text-green-400"
                            : "bg-red-100 text-red-800 dark:bg-red-500/10 dark:text-red-400"
                        }`}
                      >
                        {rider.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          rider.isVerified
                            ? "bg-blue-100 text-blue-800 dark:bg-blue-500/10 dark:text-blue-400"
                            : "bg-yellow-100 text-yellow-800 dark:bg-yellow-500/10 dark:text-yellow-400"
                        }`}
                      >
                        {rider.isVerified ? (
                          <FaCheckCircle className="w-2 h-2 mr-1" />
                        ) : (
                          <FaTimesCircle className="w-2 h-2 mr-1" />
                        )}
                        {rider.isVerified ? "Verified" : "Pending"}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          rider.isDuty
                            ? "bg-orange-100 text-orange-800 dark:bg-orange-500/10 dark:text-orange-400"
                            : "bg-gray-100 text-gray-800 dark:bg-gray-500/10 dark:text-gray-400"
                        }`}
                      >
                        <FaClock className="w-2 h-2 mr-1" />
                        {rider.isDuty ? "On Duty" : "Off Duty"}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleEditRider(rider)}
                          className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded"
                          title="Edit"
                        >
                          <FaEdit className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleDeleteRider(rider._id!)}
                          disabled={isDeleting}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded disabled:opacity-50"
                          title="Delete"
                        >
                          <FaTrash className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-3 border-t border-gray-200 dark:border-gray-800">
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-4 sm:mb-0">
            Showing {riders.length} of {totalDocs} riders
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-white/[0.03] disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:cursor-not-allowed text-sm"
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
                    className={`px-3 py-2 rounded-lg text-sm ${
                      currentPage === pageNum
                        ? "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20"
                        : "bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/[0.03]"
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
              className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-white/[0.03] disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:cursor-not-allowed text-sm"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Rider Modal */}
      <RiderModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedRider(null);
        }}
        onSave={handleSaveRider}
        rider={selectedRider}
        isLoading={isSaving}
      />
    </div>
  );
}

export default CodSettlement;
