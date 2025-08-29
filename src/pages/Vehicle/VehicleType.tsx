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
  FaCheckCircle,
  FaTimesCircle,
  FaDollarSign,
} from "react-icons/fa";
import VehicleService, { Vehicle, VehiclePayload } from "../../services/VehicleServices";
import toastHelper from "../../utils/toastHelper";
import api from "../../services/Api";
import API_ENDPOINTS from "../../constants/api-endpoints";

interface SortConfig {
  key: keyof Vehicle | null;
  direction: "ascending" | "descending";
}

interface KmRange {
  minKm: number;
  maxKm: number;
  ratePerKm: number;
}

interface Fare {
  _id?: string;
  vehicleType: string;
  kmRanges: KmRange[];
  vulnerabilityCharge: number;
  isDeleted?: boolean;
}

// Fare Management Modal Component
interface FareManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle: Vehicle | null;
}

const FareManagementModal: React.FC<FareManagementModalProps> = ({ isOpen, onClose, vehicle }) => {
  const [fares, setFares] = useState<Fare[]>([]);
  const [loading, setLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [newFare, setNewFare] = useState({
    minKm: "",
    maxKm: "",
    ratePerKm: "",
    vulnerabilityCharge: "",
  });
  const [editingFare, setEditingFare] = useState<Fare | null>(null);

  // Fetch fares for the vehicle
  const fetchFares = async () => {
    if (!vehicle?._id) return;
    setLoading(true);
    try {
      const response = await api.post(API_ENDPOINTS.FARES.GET_FARES, { type: vehicle._id });
      if (response.data.status === 200) {
        setFares(response.data.data);
      } else {
        toastHelper.error(response.data.message || "Failed to fetch fares");
      }
    } catch (error) {
      console.error("Error fetching fares:", error);
      toastHelper.error("Failed to fetch fares");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && vehicle) {
      fetchFares();
    }
  }, [isOpen, vehicle]);

  // Handle input change for new/editing fare
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (editingFare) {
      setEditingFare({
        ...editingFare,
        kmRanges: editingFare.kmRanges.map((range, index) =>
          index === 0
            ? { ...range, [name]: Number(value) }
            : range
        ),
        vulnerabilityCharge: name === "vulnerabilityCharge" ? Number(value) : editingFare.vulnerabilityCharge,
      });
    } else {
      setNewFare({ ...newFare, [name]: value });
    }
  };

  // Handle add fare
  const handleAddFare = async (e: FormEvent) => {
    e.preventDefault();
    if (!vehicle?._id) return;
    setLoading(true);
    try {
      const payload = {
        vehicleType: vehicle._id,
        kmRanges: [
          {
            minKm: Number(newFare.minKm),
            maxKm: Number(newFare.maxKm),
            ratePerKm: Number(newFare.ratePerKm),
          },
        ],
        vulnerabilityCharge: Number(newFare.vulnerabilityCharge),
      };
      const response = await api.post(API_ENDPOINTS.FARES.CREATE_FARE, payload);
      if (response.data.status === 200) {
        toastHelper.success("Fare added successfully");
        setNewFare({ minKm: "", maxKm: "", ratePerKm: "", vulnerabilityCharge: "" });
        fetchFares();
      } else {
        toastHelper.error(response.data.message || "Failed to add fare");
      }
    } catch (error) {
      console.error("Error adding fare:", error);
      toastHelper.error("Failed to add fare");
    } finally {
      setLoading(false);
    }
  };

  // Handle edit fare
  const handleEditFare = async (e: FormEvent) => {
    e.preventDefault();
    if (!editingFare || !vehicle?._id) return;
    setLoading(true);
    try {
      const payload = {
        _id: editingFare._id,
        vehicleType: vehicle._id,
        kmRanges: editingFare.kmRanges,
        vulnerabilityCharge: editingFare.vulnerabilityCharge,
      };
      const response = await api.post(API_ENDPOINTS.FARES.UPDATE_FARE, payload);
      if (response.data.status === 200) {
        toastHelper.success("Fare updated successfully");
        setEditingFare(null);
        fetchFares();
      } else {
        toastHelper.error(response.data.message || "Failed to update fare");
      }
    } catch (error) {
      console.error("Error updating fare:", error);
      toastHelper.error("Failed to update fare");
    } finally {
      setLoading(false);
    }
  };

  // Handle delete fare
  const handleDeleteFare = async (fareId: string) => {
    setLoading(true);
    try {
      const response = await api.post(API_ENDPOINTS.FARES.DELETE_FARE, { _id: fareId });
      if (response.data.status === 200) {
        toastHelper.success("Fare deleted successfully");
        fetchFares();
      } else {
        toastHelper.error(response.data.message || "Failed to delete fare");
      }
    } catch (error) {
      console.error("Error deleting fare:", error);
      toastHelper.error("Failed to delete fare");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full mx-4 shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">
            Manage Fares for {vehicle?.name}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        {/* Add/Edit Fare Form */}
        <form onSubmit={editingFare ? handleEditFare : handleAddFare} className="mb-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Min Km
              </label>
              <input
                type="number"
                name="minKm"
                value={editingFare ? editingFare.kmRanges[0]?.minKm || "" : newFare.minKm}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                placeholder="Enter min km"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Max Km
              </label>
              <input
                type="number"
                name="maxKm"
                value={editingFare ? editingFare.kmRanges[0]?.maxKm || "" : newFare.maxKm}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                placeholder="Enter max km"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Rate per Km
              </label>
              <input
                type="number"
                name="ratePerKm"
                value={editingFare ? editingFare.kmRanges[0]?.ratePerKm || "" : newFare.ratePerKm}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                placeholder="Enter rate per km"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Vulnerability Charge
              </label>
              <input
                type="number"
                name="vulnerabilityCharge"
                value={editingFare ? editingFare.vulnerabilityCharge || "" : newFare.vulnerabilityCharge}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                placeholder="Enter vulnerability charge"
                required
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            {editingFare && (
              <button
                type="button"
                onClick={() => setEditingFare(null)}
                className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-white/[0.03] text-sm"
              >
                Cancel Edit
              </button>
            )}
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {loading ? "Saving..." : editingFare ? "Update Fare" : "Add Fare"}
            </button>
          </div>
        </form>

        {/* Fares Table */}
        <div className="max-w-full overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-100 dark:border-gray-800">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                  Min Km
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                  Max Km
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                  Rate per Km
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                  Vulnerability Charge
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center">
                    <div className="text-gray-400 text-lg">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                      Loading fares...
                    </div>
                  </td>
                </tr>
              ) : fares.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center">
                    <div className="text-gray-400 text-lg">
                      <FaDollarSign className="mx-auto text-4xl mb-4" />
                      No fares found for this vehicle type
                    </div>
                  </td>
                </tr>
              ) : (
                fares.map((fare) => (
                  <tr key={fare._id} className="hover:bg-gray-50 dark:hover:bg-white/[0.02]">
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                      {fare.kmRanges[0]?.minKm}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                      {fare.kmRanges[0]?.maxKm}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                      {fare.kmRanges[0]?.ratePerKm}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                      {fare.vulnerabilityCharge}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setEditingFare(fare)}
                          className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded"
                          title="Edit Fare"
                        >
                          <FaEdit className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleDeleteFare(fare._id!)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded"
                          title="Delete Fare"
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
      </div>
    </div>
  );
};

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
    name: "",
    maximumWeightCapacity: "",
    description: "",
    extraDetails: "",
  });

  useEffect(() => {
    if (vehicle) {
      setFormData({
        name: vehicle.name || "",
        maximumWeightCapacity: vehicle.maximumWeightCapacity?.toString() || "",
        description: vehicle.description || "",
        extraDetails: vehicle.extraDetails ? JSON.stringify(vehicle.extraDetails, null, 2) : "",
      });
    } else {
      setFormData({
        name: "",
        maximumWeightCapacity: "",
        description: "",
        extraDetails: "",
      });
    }
  }, [vehicle]);

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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">
            {vehicle ? "Edit Vehicle Type" : "Add Vehicle Type"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Vehicle Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              placeholder="Enter vehicle type name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Maximum Weight Capacity (kg)
            </label>
            <input
              type="number"
              value={formData.maximumWeightCapacity}
              onChange={(e) =>
                setFormData({ ...formData, maximumWeightCapacity: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              placeholder="Enter weight capacity"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none"
              rows={3}
              placeholder="Enter vehicle description (optional)"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-white/[0.03] text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
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

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-lg w-full mx-4 shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">
            Vehicle Type Details
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
              Vehicle Name
            </p>
            <p className="text-gray-800 dark:text-white/90 text-sm">{vehicle.name}</p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
              Maximum Weight Capacity
            </p>
            <p className="text-gray-800 dark:text-white/90 text-sm">
              {vehicle.maximumWeightCapacity} kg
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
              Description
            </p>
            <p className="text-gray-800 dark:text-white/90 text-sm">
              {vehicle.description || "No description available"}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                Status
              </p>
              <span
                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  !vehicle.isDeleted
                    ? "bg-green-100 text-green-800 dark:bg-green-500/10 dark:text-green-400"
                    : "bg-red-100 text-red-800 dark:bg-red-500/10 dark:text-red-400"
                }`}
              >
                <FaCheckCircle
                  className={`w-2 h-2 mr-1 ${
                    !vehicle.isDeleted ? "text-green-600" : "text-red-600"
                  }`}
                />
                {!vehicle.isDeleted ? "Active" : "Deleted"}
              </span>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                Created Date
              </p>
              <p className="text-gray-800 dark:text-white/90 text-sm">
                {formatDate(vehicle.createdAt)}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-10 w-10 rounded-full bg-red-100 mb-3">
            <FaTrash className="h-5 w-5 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-2">
            {title}
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">{message}</p>
        </div>

        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-white/[0.03] disabled:opacity-50 text-sm"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 text-sm"
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
  const [showFareModal, setShowFareModal] = useState(false);
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
      return <FaSort className="ml-1 text-gray-400" />;
    if (sortConfig.direction === "ascending")
      return <FaSortUp className="ml-1 text-gray-600" />;
    return <FaSortDown className="ml-1 text-gray-600" />;
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
        toastHelper.success(
          vehicleData._id ? "Vehicle updated successfully" : "Vehicle added successfully"
        );
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
        toastHelper.success("Vehicle deleted successfully");
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

  // Handle fare management
  const handleManageFares = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setShowFareModal(true);
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
    <div className="p-6">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-white/90">
          Vehicle Types Management
        </h1>
        <p className="text-gray-500 text-sm dark:text-gray-400 mt-1">
          Manage your vehicle types and their specifications
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-gray-800 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Vehicle Types</p>
              <p className="text-2xl font-semibold text-gray-800 dark:text-white/90">{totalDocs}</p>
            </div>
            <div className="p-2 bg-blue-50 dark:bg-blue-500/10 rounded-lg">
              <FaTruck className="text-blue-600 dark:text-blue-400 text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-gray-800 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Active Vehicle Types</p>
              <p className="text-2xl font-semibold text-gray-800 dark:text-white/90">{activeVehicles}</p>
            </div>
            <div className="p-2 bg-green-50 dark:bg-green-500/10 rounded-lg">
              <FaCheckCircle className="text-green-600 dark:text-green-400 text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-gray-800 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Deleted Vehicle Types</p>
              <p className="text-2xl font-semibold text-gray-800 dark:text-white/90">{vehicles.length - activeVehicles}</p>
            </div>
            <div className="p-2 bg-red-50 dark:bg-red-500/10 rounded-lg">
              <FaTimesCircle className="text-red-600 dark:text-red-400 text-xl" />
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
                placeholder="Search vehicle types by name..."
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
                <option value="Deleted">Deleted</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleAddVehicle}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/[0.03]"
          >
            <FaPlus className="text-xs" />
            Add Vehicle Type
          </button>
        </div>

        {/* Table */}
        <div className="max-w-full overflow-x-auto">
          <table className="w-full">
            {/* Table Header */}
            <thead className="border-b border-gray-100 dark:border-gray-800">
              <tr>
                <th
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 cursor-pointer hover:text-gray-700 dark:hover:text-gray-200"
                  onClick={() => handleSort("name")}
                >
                  <div className="flex items-center">
                    Vehicle Type
                    {getSortIcon("name")}
                  </div>
                </th>
                <th
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 cursor-pointer hover:text-gray-700 dark:hover:text-gray-200"
                  onClick={() => handleSort("maximumWeightCapacity")}
                >
                  <div className="flex items-center">
                    Max Weight (kg)
                    {getSortIcon("maximumWeightCapacity")}
                  </div>
                </th>
                <th
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 cursor-pointer hover:text-gray-700 dark:hover:text-gray-200"
                  onClick={() => handleSort("createdAt")}
                >
                  <div className="flex items-center">
                    Created Date
                    {getSortIcon("createdAt")}
                  </div>
                </th>
                <th
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 cursor-pointer hover:text-gray-700 dark:hover:text-gray-200"
                  onClick={() => handleSort("isDeleted")}
                >
                  <div className="flex items-center">
                    Status
                    {getSortIcon("isDeleted")}
                  </div>
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
                    className="hover:bg-gray-50 dark:hover:bg-white/[0.02]"
                  >
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-800 dark:text-white/90 text-sm">
                        {vehicle.name}
                      </div>
                      {vehicle.description && (
                        <div className="text-gray-500 dark:text-gray-400 text-sm truncate max-w-xs">
                          {vehicle.description}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-gray-600 dark:text-gray-400 text-sm">
                        {vehicle.maximumWeightCapacity} kg
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-gray-500 dark:text-gray-400 text-sm">
                        {formatDate(vehicle.createdAt)}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          !vehicle.isDeleted
                            ? "bg-green-100 text-green-800 dark:bg-green-500/10 dark:text-green-400"
                            : "bg-red-100 text-red-800 dark:bg-red-500/10 dark:text-red-400"
                        }`}
                      >
                        <FaCheckCircle
                          className={`w-2 h-2 mr-1 ${
                            !vehicle.isDeleted ? "text-green-600" : "text-red-600"
                          }`}
                        />
                        {!vehicle.isDeleted ? "Active" : "Deleted"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handlePreviewVehicle(vehicle)}
                          className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded"
                          title="View Details"
                        >
                          <FaEye className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleEditVehicle(vehicle)}
                          className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded"
                          title="Edit"
                        >
                          <FaEdit className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleManageFares(vehicle)}
                          className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-500/10 rounded"
                          title="Manage Fares"
                        >
                          <FaDollarSign className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(vehicle._id!)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded"
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
            Showing {filteredVehicles.length} of {totalDocs} vehicle types
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-white/[0.03] disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:cursor-not-allowed text-sm"
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
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-white/[0.03] disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:cursor-not-allowed text-sm"
            >
              Next
            </button>
          </div>
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

      {/* Fare Management Modal */}
      <FareManagementModal
        isOpen={showFareModal}
        onClose={() => {
          setShowFareModal(false);
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