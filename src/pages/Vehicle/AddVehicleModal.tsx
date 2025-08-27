import { useState } from "react";
import { FaTimes } from "react-icons/fa";

interface AddVehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddVehicle: (vehicleType: string) => void;
}

const AddVehicleModal = ({ isOpen, onClose, onAddVehicle }: AddVehicleModalProps) => {
  const [selectedType, setSelectedType] = useState("");
  const vehicleOptions = [
    "2 Wheeler",
    "3 Wheeler",
    "4 Wheeler",
    "Heavy Vehicle",
    "Commercial Vehicle",
    "Other",
  ];

  const handleSubmit = () => {
    if (selectedType.trim() !== "") {
      onAddVehicle(selectedType);
      setSelectedType("");
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-blue-800">Add Vehicle Type</h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-800"
          >
            <FaTimes size={20} />
          </button>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Vehicle Type
          </label>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="" disabled>
              Select vehicle type
            </option>
            {vehicleOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddVehicleModal;