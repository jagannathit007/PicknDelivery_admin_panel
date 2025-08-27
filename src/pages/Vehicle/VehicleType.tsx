import { useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { MdOutlinePriceChange } from "react-icons/md";
import { FaPlus } from "react-icons/fa6";
import AddVehicleModal from "./AddVehicleModal";
import PricingModal from "./PricingModal";

interface PriceRange {
  from: number;
  to: number;
  price: number;
}

interface VehicleType {
  id: number;
  name: string;
  prices: PriceRange[];
}

const VehicleTypeComponent = () => {
  const [vehicleTypes, setVehicleTypes] = useState<VehicleType[]>([
    { id: 1, name: "2 Wheeler", prices: [] },
    { id: 2, name: "3 Wheeler", prices: [] },
    { id: 3, name: "4 Wheeler", prices: [] },
    { id: 4, name: "Heavy Vehicle", prices: [] },
    { id: 5, name: "Commercial Vehicle", prices: [] },
  ]);

  const [isAddingModalOpen, setIsAddingModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState({ name: "" });
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [selectedVehicleId, setSelectedVehicleId] = useState<number | null>(null);

  const handleAddType = (typeName: string) => {
    const newId =
      vehicleTypes.length > 0
        ? Math.max(...vehicleTypes.map((t) => t.id)) + 1
        : 1;
    setVehicleTypes([
      ...vehicleTypes,
      {
        id: newId,
        name: typeName,
        prices: [],
      },
    ]);
  };

  const handleDeleteType = (id: number) => {
    if (window.confirm("Are you sure you want to delete this vehicle type?")) {
      setVehicleTypes(vehicleTypes.filter((type) => type.id !== id));
    }
  };

  const handleEditType = (id: number) => {
    setEditingId(id);
    const typeToEdit = vehicleTypes.find((type) => type.id === id);
    setEditValue(typeToEdit ? { name: typeToEdit.name } : { name: "" });
  };

  const handleSaveEdit = () => {
    if (editValue.name.trim() !== "") {
      setVehicleTypes(
        vehicleTypes.map((type) =>
          type.id === editingId ? { ...type, name: editValue.name } : type
        )
      );
      setEditingId(null);
      setEditValue({ name: "" });
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditValue({ name: "" });
  };

  const handleViewPricing = (id: number) => {
    setSelectedVehicleId(id);
    setShowPricingModal(true);
  };

  const handleUpdatePrices = (id: number, newPrices: PriceRange[]) => {
    setVehicleTypes(
      vehicleTypes.map((type) =>
        type.id === id ? { ...type, prices: newPrices } : type
      )
    );
  };

  const selectedVehicleType = vehicleTypes.find(
    (type) => type.id === selectedVehicleId
  );

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-800">Vehicle Types</h1>
        <button
          onClick={() => setIsAddingModalOpen(true)}
          className="flex items-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 shadow"
        >
          <FaPlus className="mr-2" />
          Add Vehicle Type
        </button>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl shadow-lg border border-gray-200">
        <table className="w-full bg-white">
          <thead className="bg-blue-100 border-b border-gray-200">
            <tr>
              <th className="text-left p-4 text-blue-800 font-semibold">
                Vehicle type
              </th>
              <th className="text-center p-4 text-blue-800 font-semibold w-1/3">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {vehicleTypes.map((type) => (
              <tr
                key={type.id}
                className="hover:bg-blue-50 transition-colors duration-200"
              >
                <td className="p-4 text-gray-700">
                  {editingId === type.id ? (
                    <input
                      type="text"
                      value={editValue.name}
                      onChange={(e) =>
                        setEditValue({ ...editValue, name: e.target.value })
                      }
                      className="w-full px-3 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    <span className="text-sm font-medium text-gray-900">
                      {type.name}
                    </span>
                  )}
                </td>
                <td className="p-4 text-center">
                  {editingId === type.id ? (
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={handleSaveEdit}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md shadow"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded-md shadow"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="flex justify-center gap-3">
                      <button
                        onClick={() => handleViewPricing(type.id)}
                        className="flex items-center gap-1 bg-blue-100 hover:bg-blue-200 text-blue-800 px-3 py-1 rounded-md shadow-sm"
                        title="View Pricing"
                      >
                        <MdOutlinePriceChange size={16} />
                        Price
                      </button>
                      <button
                        onClick={() => handleEditType(type.id)}
                        className="bg-green-100 hover:bg-green-200 text-green-800 px-3 py-1 rounded-md shadow-sm"
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDeleteType(type.id)}
                        className="bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1 rounded-md shadow-sm"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {vehicleTypes.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No vehicle types found. Add your first vehicle type.
        </div>
      )}

      {/* Add Vehicle Modal */}
      <AddVehicleModal
        isOpen={isAddingModalOpen}
        onClose={() => setIsAddingModalOpen(false)}
        onAddVehicle={handleAddType}
      />

      {/* Pricing Modal */}
      {showPricingModal && selectedVehicleType && (
        <PricingModal
          vehicleType={selectedVehicleType}
          onClose={() => setShowPricingModal(false)}
          onUpdatePrices={(newPrices) =>
            handleUpdatePrices(selectedVehicleId!, newPrices)
          }
        />
      )}
    </div>
  );
};

export default VehicleTypeComponent;