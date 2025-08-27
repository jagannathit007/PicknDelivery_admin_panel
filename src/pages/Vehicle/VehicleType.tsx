import { useState, useMemo, useEffect, FormEvent } from "react";
import {
  FaSearch,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaFilter,
  FaPlus,
  FaEdit,
  FaTrash,
  FaTruck,
  FaEye,
  FaTimes,
} from "react-icons/fa";
import VehicleService, { Vehicle, VehiclePayload } from "../../services/VehicleServices";
import toastHelper from "../../utils/toastHelper";

interface SortConfig {
  key: keyof Vehicle | null;
  direction: "ascending" | "descending";
}

// AddVehicleModal Component
interface AddVehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddVehicle: (vehicleData: VehiclePayload) => void;
  vehicle: Vehicle | null;
  isLoading: boolean;
}

const AddVehicleModal: React.FC<AddVehicleModalProps> = ({
  isOpen,
  onClose,
  onAddVehicle,
  vehicle,
  isLoading,
}) => {
  const [formData, setFormData] = useState({
    name: vehicle?.name || "",
    maximumWeightCapacity: vehicle?.maximumWeightCapacity || 0,
    description: vehicle?.description || "",
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const payload: VehiclePayload = {
      _id: vehicle?._id,
      name: formData.name,
      maximumWeightCapacity: Number(formData.maximumWeightCapacity),
      description: formData.description,
    };
    onAddVehicle(payload);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {vehicle ? "Edit Vehicle Type" : "Add Vehicle Type"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <FaTimes className="text-xl" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Vehicle Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              placeholder="Enter vehicle type name"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Maximum Weight Capacity (kg)
            </label>
            <input
              type="number"
              value={formData.maximumWeightCapacity}
              onChange={(e) => setFormData({ ...formData, maximumWeightCapacity: Number(e.target.value) })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              placeholder="Enter weight capacity"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
              rows={3}
              placeholder="Enter vehicle description (optional)"
            />
          </div>
          
          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {isLoading ? "Saving..." : vehicle ? "Update" : "Add Vehicle"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// PreviewVehicleModal Component
interface PreviewVehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle: Vehicle | null;
}

const PreviewVehicleModal: React.FC<PreviewVehicleModalProps> = ({ isOpen, onClose, vehicle }) => {
  if (!isOpen || !vehicle) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-lg w-full mx-4 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Vehicle Type Details</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <FaTimes className="text-xl" />
          </button>
        </div>
        
        <div className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm font-semibold text-gray-600 mb-1">Vehicle Name</p>
            <p className="text-lg text-gray-900 font-medium">{vehicle.name}</p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm font-semibold text-gray-600 mb-1">Maximum Weight Capacity</p>
            <p className="text-lg text-gray-900 font-medium">{vehicle.maximumWeightCapacity} kg</p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm font-semibold text-gray-600 mb-1">Description</p>
            <p className="text-gray-900">{vehicle.description || "No description available"}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm font-semibold text-gray-600 mb-1">Status</p>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  !vehicle.isDeleted
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                <div
                  className={`w-2 h-2 rounded-full mr-2 ${
                    !vehicle.isDeleted ? "bg-green-500" : "bg-red-500"
                  }`}
                ></div>
                {!vehicle.isDeleted ? "Active" : "Deleted"}
              </span>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm font-semibold text-gray-600 mb-1">Created Date</p>
              <p className="text-gray-900">
                {vehicle.createdAt
                  ? new Date(vehicle.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })
                  : "N/A"}
              </p>
            </div>
          </div>
        </div>
        
        <div className="mt-8 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// Confirmation Modal Component
interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  isLoading?: boolean;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  isLoading = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <FaTrash className="h-6 w-6 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-600 mb-6">{message}</p>
        </div>
        
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200 disabled:opacity-50 font-medium"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 disabled:opacity-50 font-medium"
          >
            {isLoading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

// Main Component
const VehicleTypeComponent = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: null,
    direction: "ascending",
  });
  const [isAddingModalOpen, setIsAddingModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [totalDocs, setTotalDocs] = useState(0);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [vehicleToDelete, setVehicleToDelete] = useState<string | null>(null);
  const itemsPerPage = 10;

  // Fetch vehicles from API
  const fetchVehicles = async (page = 1, search = "") => {
    setLoading(true);
    try {
      const response = await VehicleService.getVehicles({
        page,
        limit: itemsPerPage,
        search,
      });

      if (response && response.data) {
        setVehicles(response.data.docs);
        setTotalPages(response.data.totalPages);
        setTotalDocs(response.data.totalDocs);
      }
    } catch (error) {
      console.error("Error fetching vehicles:", error);
      toastHelper.error("Failed to fetch vehicles");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles(currentPage, searchTerm);
  }, [currentPage, searchTerm]);

  // Handle sorting
  const handleSort = (key: keyof Vehicle) => {
    let direction: "ascending" | "descending" = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  // Get sort icon based on current sort state
  const getSortIcon = (key: keyof Vehicle) => {
    if (sortConfig.key !== key)
      return <FaSort className="ml-2 text-gray-400" />;
    if (sortConfig.direction === "ascending")
      return <FaSortUp className="ml-2 text-blue-600" />;
    return <FaSortDown className="ml-2 text-blue-600" />;
  };

  // Format date for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Filter and sort vehicles
  const filteredVehicles = useMemo(() => {
    const filtered = vehicles.filter((vehicle) => {
      const matchesSearch = vehicle.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "All" ||
        (statusFilter === "Active" && !vehicle.isDeleted) ||
        (statusFilter === "Deleted" && vehicle.isDeleted);
      return matchesSearch && matchesStatus;
    });

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        const aValue = a[sortConfig.key as keyof Vehicle];
        const bValue = b[sortConfig.key as keyof Vehicle];

        if (aValue === undefined && bValue === undefined) return 0;
        if (aValue === undefined) return sortConfig.direction === "ascending" ? 1 : -1;
        if (bValue === undefined) return sortConfig.direction === "ascending" ? -1 : 1;

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
  }, [vehicles, searchTerm, sortConfig, statusFilter]);

  // Handle vehicle save (create/update)
  const handleSaveVehicle = async (vehicleData: VehiclePayload) => {
    setIsSaving(true);
    try {
      const response = await VehicleService[vehicleData._id ? "updateVehicle" : "createVehicle"](vehicleData);
      if (response) {
        setIsAddingModalOpen(false);
        setSelectedVehicle(null);
        fetchVehicles(currentPage, searchTerm);
      }
    } catch (error) {
      console.error("Error saving vehicle:", error);
      toastHelper.error("Failed to save vehicle");
    } finally {
      setIsSaving(false);
    }
  };

  // Handle vehicle delete
  const handleDeleteVehicle = async () => {
    if (!vehicleToDelete) return;

    setIsDeleting(true);
    try {
      const response = await VehicleService.deleteVehicle(vehicleToDelete);
      if (response) {
        fetchVehicles(currentPage, searchTerm);
        setShowConfirmModal(false);
        setVehicleToDelete(null);
      }
    } catch (error) {
      console.error("Error deleting vehicle:", error);
      toastHelper.error("Failed to delete vehicle");
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle edit vehicle
  const handleEditVehicle = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setIsAddingModalOpen(true);
  };

  // Handle preview vehicle
  const handlePreviewVehicle = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setShowPreviewModal(true);
  };

  // Handle add new vehicle
  const handleAddVehicle = () => {
    setSelectedVehicle(null);
    setIsAddingModalOpen(true);
  };

  // Handle delete confirmation
  const handleDeleteClick = (vehicleId: string) => {
    setVehicleToDelete(vehicleId);
    setShowConfirmModal(true);
  };

  // Calculate statistics
  const activeVehicles = vehicles.filter((vehicle) => !vehicle.isDeleted).length;

  return (
    <div className="container mx-auto p-8">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold mb-2 text-gray-800">Vehicle Types</h1>
            <p className="text-gray-600">Manage your vehicle types and their specifications</p>
          </div>

          {/* Add Vehicle Button */}
          <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4 mt-4 md:mt-0">
            <button
              onClick={handleAddVehicle}
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <FaPlus className="mr-2" />
              Add Vehicle Type
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4 mb-8">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search vehicle types by name..."
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
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
              <option value="Deleted">Deleted</option>
            </select>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Vehicle Types</p>
                <p className="text-3xl font-bold text-gray-900">{totalDocs}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <FaTruck className="text-2xl text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Vehicle Types</p>
                <p className="text-3xl font-bold text-green-600">{activeVehicles}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <div className="w-6 h-6 bg-green-600 rounded-full"></div>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Deleted Vehicle Types</p>
                <p className="text-3xl font-bold text-red-600">{vehicles.length - activeVehicles}</p>
              </div>
              <div className="p-3 bg-red-100 rounded-full">
                <div className="w-6 h-6 bg-red-600 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th
                  className="text-left p-6 text-gray-700 font-semibold cursor-pointer hover:bg-gray-100 transition-colors duration-200"
                  onClick={() => handleSort("name")}
                >
                  <div className="flex items-center">
                    Vehicle Type
                    {getSortIcon("name")}
                  </div>
                </th>
                <th
                  className="text-left p-6 text-gray-700 font-semibold cursor-pointer hover:bg-gray-100 transition-colors duration-200"
                  onClick={() => handleSort("maximumWeightCapacity")}
                >
                  <div className="flex items-center">
                    Max Weight (kg)
                    {getSortIcon("maximumWeightCapacity")}
                  </div>
                </th>
                <th
                  className="text-left p-6 text-gray-700 font-semibold cursor-pointer hover:bg-gray-100 transition-colors duration-200"
                  onClick={() => handleSort("createdAt")}
                >
                  <div className="flex items-center">
                    Created Date
                    {getSortIcon("createdAt")}
                  </div>
                </th>
                <th
                  className="text-left p-6 text-gray-700 font-semibold cursor-pointer hover:bg-gray-100 transition-colors duration-200"
                  onClick={() => handleSort("isDeleted")}
                >
                  <div className="flex items-center">
                    Status
                    {getSortIcon("isDeleted")}
                  </div>
                </th>
                <th className="text-left p-6 text-gray-700 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center">
                    <div className="text-gray-400 text-lg">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                      Loading vehicle types...
                    </div>
                  </td>
                </tr>
              ) : filteredVehicles.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center">
                    <div className="text-gray-400 text-lg">
                      <FaTruck className="mx-auto text-4xl mb-4" />
                      No vehicle types found matching your criteria
                    </div>
                  </td>
                </tr>
              ) : (
                filteredVehicles.map((vehicle) => (
                  <tr
                    key={vehicle._id}
                    className="hover:bg-gray-50 transition-all duration-200 group"
                  >
                    <td className="p-6">
                      <div className="font-semibold text-gray-900">{vehicle.name}</div>
                      {vehicle.description && (
                        <div className="text-sm text-gray-500 mt-1 truncate max-w-xs">
                          {vehicle.description}
                        </div>
                      )}
                    </td>
                    <td className="p-6">
                      <div className="text-gray-600 font-medium">{vehicle.maximumWeightCapacity}</div>
                    </td>
                    <td className="p-6">
                      <div className="text-gray-600">{formatDate(vehicle.createdAt)}</div>
                    </td>
                    <td className="p-6">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          !vehicle.isDeleted
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        <div
                          className={`w-2 h-2 rounded-full mr-2 ${
                            !vehicle.isDeleted ? "bg-green-500" : "bg-red-500"
                          }`}
                        ></div>
                        {!vehicle.isDeleted ? "Active" : "Deleted"}
                      </span>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <button
                          onClick={() => handlePreviewVehicle(vehicle)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                          title="View Details"
                        >
                          <FaEye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEditVehicle(vehicle)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200"
                          title="Edit"
                        >
                          <FaEdit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(vehicle._id!)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                          title="Delete"
                        >
                          <FaTrash className="w-4 h-4" />
                        </button>
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
          Showing {filteredVehicles.length} of {totalDocs} vehicle types
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
          >
            Previous
          </button>
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
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
          >
            Next
          </button>
        </div>
      </div>

      {/* Add/Edit Vehicle Modal */}
      <AddVehicleModal
        isOpen={isAddingModalOpen}
        onClose={() => {
          setIsAddingModalOpen(false);
          setSelectedVehicle(null);
        }}
        onAddVehicle={handleSaveVehicle}
        vehicle={selectedVehicle}
        isLoading={isSaving}
      />

      {/* Preview Vehicle Modal */}
      <PreviewVehicleModal
        isOpen={showPreviewModal}
        onClose={() => {
          setShowPreviewModal(false);
          setSelectedVehicle(null);
        }}
        vehicle={selectedVehicle}
      />

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={() => {
          setShowConfirmModal(false);
          setVehicleToDelete(null);
        }}
        onConfirm={handleDeleteVehicle}
        title="Delete Vehicle Type"
        message="Are you sure you want to delete this vehicle type? This action cannot be undone."
        isLoading={isDeleting}
      />
    </div>
  );
};

export default VehicleTypeComponent;