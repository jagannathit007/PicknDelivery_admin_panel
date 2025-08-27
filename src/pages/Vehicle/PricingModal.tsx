import { useState } from "react";
import { FaTimes, FaTrash, FaEdit, FaPlus } from "react-icons/fa";

interface PriceRange {
  from: number;
  to: number;
  price: number;
}

interface VehicleType {
  name: string;
  prices: PriceRange[];
}

interface PricingModalProps {
  vehicleType: VehicleType;
  onClose: () => void;
  onUpdatePrices: (prices: PriceRange[]) => void;
}

const PricingModal = ({ vehicleType, onClose, onUpdatePrices }: PricingModalProps) => {
  const [fromKm, setFromKm] = useState("");
  const [toKm, setToKm] = useState("");
  const [price, setPrice] = useState("");
  const [editIndex, setEditIndex] = useState<number | null>(null);

  const handleAdd = () => {
    const from = parseInt(fromKm);
    const to = parseInt(toKm);
    const p = parseFloat(price);
    if (
      !isNaN(from) &&
      !isNaN(to) &&
      !isNaN(p) &&
      from < to &&
      fromKm.trim() !== "" &&
      toKm.trim() !== "" &&
      price.trim() !== ""
    ) {
      const newPrices = editIndex !== null
        ? vehicleType.prices.map((item, index) =>
            index === editIndex ? { from, to, price: p } : item
          )
        : [...vehicleType.prices, { from, to, price: p }];
      onUpdatePrices(newPrices);
      setFromKm("");
      setToKm("");
      setPrice("");
      setEditIndex(null);
    }
  };

  const handleDelete = (indexToDelete: number) => {
    const newPrices = vehicleType.prices.filter((_, index) => index !== indexToDelete);
    onUpdatePrices(newPrices);
  };

  const handleEdit = (index: number) => {
    const itemToEdit = vehicleType.prices[index];
    setFromKm(itemToEdit.from.toString());
    setToKm(itemToEdit.to.toString());
    setPrice(itemToEdit.price.toString());
    setEditIndex(index); // Set the index of the item being edited
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-2xl">
        <div className="flex justify-between items-center mb-6 border-b border-gray-200 pb-4">
          <h2 className="text-2xl font-semibold text-blue-800">
            {vehicleType.name} Pricing
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
          >
            <FaTimes className="text-2xl" />
          </button>
        </div>

        <div className="mb-6 space-y-4">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                From KM
              </label>
              <input
                type="number"
                value={fromKm}
                onChange={(e) => setFromKm(e.target.value)}
                placeholder="From KM"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                To KM
              </label>
              <input
                type="number"
                value={toKm}
                onChange={(e) => setToKm(e.target.value)}
                placeholder="To KM"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="Price"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 pl-10"
                />
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  ₹
                </span>
              </div>
            </div>
            <button
              onClick={handleAdd}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 mt-6 flex items-center"
            >
              <FaPlus className="mr-2" />
              Add
            </button>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl shadow-lg">
          <table className="w-full bg-white">
            <thead className="bg-blue-100">
              <tr>
                <th className="text-left p-4 text-blue-800 font-semibold rounded-tl-xl">
                  From KM
                </th>
                <th className="text-left p-4 text-blue-800 font-semibold">
                  To KM
                </th>
                <th className="text-left p-4 text-blue-800 font-semibold">
                  Price (₹)
                </th>
                <th className="text-left p-4 text-blue-800 font-semibold rounded-tr-xl">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {vehicleType.prices.map((priceItem, index) => (
                <tr
                  key={index}
                  className={`hover:bg-blue-50 ${
                    index === vehicleType.prices.length - 1
                      ? "rounded-b-xl"
                      : ""
                  }`}
                >
                  <td
                    className={`p-4 text-gray-700 ${
                      index === vehicleType.prices.length - 1
                        ? "rounded-bl-xl"
                        : ""
                    }`}
                  >
                    {priceItem.from}
                  </td>
                  <td className="p-4 text-gray-700">{priceItem.to}</td>
                  <td className="p-4 text-gray-700">{priceItem.price}</td>
                  <td
                    className={`p-4 text-gray-700 ${
                      index === vehicleType.prices.length - 1
                        ? "rounded-br-xl"
                        : ""
                    }`}
                  >
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(index)}
                        className="text-green-500 hover:text-green-700 transition-colors duration-200"
                      >
                        <FaEdit className="text-xl" />
                      </button>
                      <button
                        onClick={() => handleDelete(index)}
                        className="text-red-500 hover:text-red-700 transition-colors duration-200"
                      >
                        <FaTrash className="text-xl" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {vehicleType.prices.length === 0 && (
          <div className="text-center py-4 text-gray-500">
            No pricing ranges added yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default PricingModal;