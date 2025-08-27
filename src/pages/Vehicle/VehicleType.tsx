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
} from "react-icons/fa";
import { MdOutlinePriceChange } from "react-icons/md";
import VehicleService, { Vehicle, VehiclePayload } from "../../services/VehicleServices";
import toastHelper from "../../utils/toastHelper";

interface PriceRange {
  from: number;
  to: number;
  price: number;
}

interface SortConfig {
  key: keyof Vehicle | null;
  direction: "ascending" | "descending";
}

interface ExtendedVehicle extends Vehicle {
  prices?: PriceRange[];
}

// AddVehicleModal Component
interface AddVehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddVehicle: (vehicleData: VehiclePayload) => void;
  vehicle: ExtendedVehicle | null;
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
    extraDetails: vehicle?.extraDetails ? JSON.stringify(vehicle.extraDetails) : "",
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const payload: VehiclePayload = {
      _id: vehicle?._id,
      name: formData.name,
      maximumWeightCapacity: Number(formData.maximumWeightCapacity),
      description: formData.description,
      extraDetails: formData.extraDetails ? JSON.parse(formData.extraDetails) : undefined,
    };
    onAddVehicle(payload);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 max-w-lg w-full mx-4 shadow-2xl">
        <h2 className="text-2xl font-bold text-blue-800 mb-6">
          {vehicle ? "Edit Vehicle Type" : "Add Vehicle Type"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-blue-800">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-blue-800">Maximum Weight Capacity (kg)</label>
            <input
              type="number"
              value={formData.maximumWeightCapacity}
              onChange={(e) => setFormData({ ...formData, maximumWeightCapacity: Number(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-blue-800">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-blue-800">Extra Details (JSON)</label>
            <textarea
              value={formData.extraDetails}
              onChange={(e) => setFormData({ ...formData, extraDetails: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 disabled:opacity-50"
            >
              {isLoading ? "Saving..." : vehicle ? "Update" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// PricingModal Component
interface PricingModalProps {
  vehicleType: ExtendedVehicle;
  onClose: () => void;
  onUpdatePrices: (newPrices: PriceRange[]) => void;
}

const PricingModal: React.FC<PricingModalProps> = ({ vehicleType, onClose, onUpdatePrices }) => {
  const [prices, setPrices] = useState<PriceRange[]>(vehicleType.prices || []);
  const [newPrice, setNewPrice] = useState<PriceRange>({ from: 0, to: 0, price: 0 });

  const handleAddPrice = () => {
    if (newPrice.from >= 0 && newPrice.to > newPrice.from && newPrice.price >= 0) {
      setPrices([...prices, newPrice]);
      setNewPrice({ from: 0, to: 0, price: 0 });
    } else {
      toastHelper.error("Invalid price range or values");
    }
  };

  const handleRemovePrice = (index: number) => {
    setPrices(prices.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    onUpdatePrices(prices);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 max-w-lg w-full mx-4 shadow-2xl">
        <h2 className="text-2xl font-bold text-blue-800 mb-6">Manage Prices for {vehicleType.name}</h2>
        <div className="space-y-4">
          <div className="flex space-x-2">
            <input
              type="number"
              placeholder="From (km)"
              value={newPrice.from}
              onChange={(e) => setNewPrice({ ...newPrice, from: Number(e.target.value) })}
              className="w-1/3 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              placeholder="To (km)"
              value={newPrice.to}
              onChange={(e) => setNewPrice({ ...newPrice, to: Number(e.target.value) })}
              className="w-1/3 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              placeholder="Price ($)"
              value={newPrice.price}
              onChange={(e) => setNewPrice({ ...newPrice, price: Number(e.target.value) })}
              className="w-1/3 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleAddPrice}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Add
            </button>
          </div>
          <div>
            {prices.length > 0 ? (
              <ul className="space-y-2">
                {prices.map((price, index) => (
                  <li key={index} className="flex justify-between items-center">
                    <span>
                      {price.from} - {price.to} km: ${price.price}
                    </span>
                    <button
                      onClick={() => handleRemovePrice(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <FaTrash />
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600">No prices set</p>
            )}
          </div>
        </div>
        <div className="mt-8 flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all duration-200"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

// PreviewVehicleModal Component
interface PreviewVehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle: ExtendedVehicle | null;
}

const PreviewVehicleModal: React.FC<PreviewVehicleModalProps> = ({ isOpen, onClose, vehicle }) => {
  if (!isOpen || !vehicle) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 max-w-lg w-full mx-4 shadow-2xl">
        <h2 className="text-2xl font-bold text-blue-800 mb-6">Vehicle Type Details</h2>
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium text-blue-800">Name</p>
            <p className="text-gray-900">{vehicle.name}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-blue-800">Maximum Weight Capacity (kg)</p>
            <p className="text-gray-900">{vehicle.maximumWeightCapacity}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-blue-800">Description</p>
            <p className="text-gray-900">{vehicle.description || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-blue-800">Extra Details</p>
            <p className="text-gray-900">
              {vehicle.extraDetails ? JSON.stringify(vehicle.extraDetails) : "N/A"}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-blue-800">Status</p>
            <p className="text-gray-900">{vehicle.isDeleted ? "Deleted" : "Active"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-blue-800">Created At</p>
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
          <div>
            <p className="text-sm font-medium text-blue-800">Prices</p>
            {vehicle.prices && vehicle.prices.length > 0 ? (
              <ul className="list-disc list-inside text-gray-900">
                {vehicle.prices.map((price, index) => (
                  <li key={index}>
                    {price.from} - {price.to} km: ${price.price}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-900">No pricing information available</p>
            )}
          </div>
        </div>
        <div className="mt-8 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// Main Component
const VehicleTypeComponent = () => {
  const [vehicles, setVehicles] = useState<ExtendedVehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: null,
    direction: "ascending",
  });
  const [isAddingModalOpen, setIsAddingModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<ExtendedVehicle | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [totalDocs, setTotalDocs] = useState(0);
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);
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

      console.log()
      if (response && response.data) {
        const vehiclesWithPrices = response.data.docs.map((vehicle: Vehicle) => ({
          ...vehicle,
          prices: [], // Initialize empty prices array
        }));
        setVehicles(vehiclesWithPrices);
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
  const handleDeleteVehicle = async (vehicleId: string) => {
    const confirmed = await new Promise<boolean>((resolve) => {
      toastHelper.warning("Are you sure you want to delete this vehicle type?");
      resolve(window.confirm("Are you sure you want to delete this vehicle type?"));
    });

    if (!confirmed) return;

    setIsDeleting(true);
    try {
      const response = await VehicleService.deleteVehicle(vehicleId);
      if (response) {
        fetchVehicles(currentPage, searchTerm);
      }
    } catch (error) {
      console.error("Error deleting vehicle:", error);
      toastHelper.error("Failed to delete vehicle");
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle edit vehicle
  const handleEditVehicle = (vehicle: ExtendedVehicle) => {
    setSelectedVehicle(vehicle);
    setIsAddingModalOpen(true);
  };

  // Handle preview vehicle
  const handlePreviewVehicle = (vehicle: ExtendedVehicle) => {
    setSelectedVehicle(vehicle);
    setShowPreviewModal(true);
  };

  // Handle add new vehicle
  const handleAddVehicle = () => {
    setSelectedVehicle(null);
    setIsAddingModalOpen(true);
  };

  // Handle view pricing
  const handleViewPricing = (id: string) => {
    setSelectedVehicleId(id);
    setShowPricingModal(true);
  };

  // Handle update prices
  const handleUpdatePrices = (id: string, newPrices: PriceRange[]) => {
    setVehicles(
      vehicles.map((vehicle) =>
        vehicle._id === id ? { ...vehicle, prices: newPrices } : vehicle
      )
    );
  };

  // Calculate statistics
  const activeVehicles = vehicles.filter((vehicle) => !vehicle.isDeleted).length;

  return (
    <div className="container mx-auto p-8">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold mb-2 text-blue-800">Vehicle Types</h1>
          </div>

          {/* Add Vehicle Button */}
          <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
            <button
              onClick={handleAddVehicle}
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <FaPlus className="mr-2" />
              Add Vehicle Type
            </button>

            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
              <div className="flex-1 relative">
                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search vehicle types by name..."
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
                    <option value="Deleted">Deleted</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-800">Total Vehicle Types</p>
                <p className="text-3xl font-bold text-gray-900">{totalDocs}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <FaTruck className="text-2xl text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-800">Active Vehicle Types</p>
                <p className="text-3xl font-bold text-green-600">{activeVehicles}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <div className="w-6 h-6 bg-green-600 rounded-full"></div>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-800">Deleted Vehicle Types</p>
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
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-blue-100">
              <tr>
                <th
                  className="text-left p-6 text-blue-800 font-semibold cursor-pointer hover:bg-blue-200 transition-colors duration-200"
                  onClick={() => handleSort("name")}
                >
                  <div className="flex items-center">
                    Vehicle Type
                    {getSortIcon("name")}
                  </div>
                </th>
                <th
                  className="text-left p-6 text-blue-800 font-semibold cursor-pointer hover:bg-blue-200 transition-colors duration-200"
                  onClick={() => handleSort("maximumWeightCapacity")}
                >
                  <div className="flex items-center">
                    Max Weight (kg)
                    {getSortIcon("maximumWeightCapacity")}
                  </div>
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
                  onClick={() => handleSort("isDeleted")}
                >
                  <div className="flex items-center">
                    Status
                    {getSortIcon("isDeleted")}
                  </div>
                </th>
                <th className="text-left p-6 text-blue-800 font-semibold">Actions</th>
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
                    className="hover:bg-blue-50 transition-all duration-200 group"
                  >
                    <td className="p-6">
                      <div className="font-semibold text-gray-900">{vehicle.name}</div>
                    </td>
                    <td className="p-6">
                      <div className="text-gray-600">{vehicle.maximumWeightCapacity}</div>
                    </td>
                    <td className="p-6">
                      <div className="text-gray-600">{formatDate(vehicle.createdAt)}</div>
                    </td>
                    <td className="p-6">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          !vehicle.isDeleted
                            ? "bg-green-100 text-green-800 border border-green-200"
                            : "bg-red-100 text-red-800 border border-red-200"
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
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors duration-200"
                          title="Preview"
                        >
                          <FaEye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleViewPricing(vehicle._id!)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors duration-200"
                          title="View Pricing"
                        >
                          <MdOutlinePriceChange className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEditVehicle(vehicle)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors duration-200"
                          title="Edit"
                        >
                          <FaEdit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteVehicle(vehicle._id!)}
                          disabled={isDeleting}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors duration-200 disabled:opacity-50"
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

      {/* Pricing Modal */}
      {showPricingModal && selectedVehicleId && (
        <PricingModal
          vehicleType={vehicles.find((vehicle) => vehicle._id === selectedVehicleId)!}
          onClose={() => {
            setShowPricingModal(false);
            setSelectedVehicleId(null);
          }}
          onUpdatePrices={(newPrices) => handleUpdatePrices(selectedVehicleId!, newPrices)}
        />
      )}

      {/* Preview Vehicle Modal */}
      {showPreviewModal && selectedVehicle && (
        <PreviewVehicleModal
          isOpen={showPreviewModal}
          onClose={() => {
            setShowPreviewModal(false);
            setSelectedVehicle(null);
          }}
          vehicle={selectedVehicle}
        />
      )}
    </div>
  );
};

export default VehicleTypeComponent;