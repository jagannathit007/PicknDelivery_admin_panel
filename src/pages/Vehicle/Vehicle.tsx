import { useState, ChangeEvent } from "react";
import VehicleModal from "./VehicleModal";

// Define the Vehicle type
interface Vehicle {
  id: number;
  name: string;
  type: string;
  image: string;
  isActive: boolean;
}

const VehicleComponent = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([
    {
      id: 1,
      name: "Toyota Camry",
      type: "Sedan",
      image: "https://stimg.cardekho.com/images/carexteriorimages/930x620/Toyota/Camry/11344/1733916451269/front-left-side-47.jpg?impolicy=resize&imwidth=420",
      isActive: true,
    },
    {
      id: 2,
      name: "Honda CRF",
      type: "Motorcycle",
      image: "https://enduro21.com/images/2020/june-2020/first-look-2021-honda-crf-off-road-models/21_honda_crf250rx_rhp_1200.jpg",
      isActive: false,
    },
    {
      id: 3,
      name: "Ford F-150",
      type: "Truck",
      image: "https://t3.ftcdn.net/jpg/03/74/16/54/360_F_374165471_f5Q76rTDES77pKdeH0VKDRt9cRjyaPT6.jpg",
      isActive: true,
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [newVehicle, setNewVehicle] = useState<Omit<Vehicle, "id">>({
    name: "",
    type: "Sedan",
    image: "https://via.placeholder.com/100",
    isActive: true,
  });

  // Function to toggle vehicle active status
  const toggleActive = (id: number) => {
    setVehicles(
      vehicles.map((vehicle) =>
        vehicle.id === id
          ? { ...vehicle, isActive: !vehicle.isActive }
          : vehicle
      )
    );
  };

  // Function to handle adding a new vehicle
  const handleAddVehicle = () => {
    if (newVehicle.name.trim() === "") {
      alert("Please enter a vehicle name");
      return;
    }

    const newVehicleWithId: Vehicle = {
      ...newVehicle,
      id: vehicles.length > 0 ? Math.max(...vehicles.map((v) => v.id)) + 1 : 1,
    };

    setVehicles([...vehicles, newVehicleWithId]);
    setNewVehicle({
      name: "",
      type: "Sedan",
      image: "https://via.placeholder.com/100",
      isActive: true,
    });
    setShowModal(false);
  };

  // Function to handle input changes in the form
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setNewVehicle({
        ...newVehicle,
        [name]: checked,
      });
    } else {
      setNewVehicle({
        ...newVehicle,
        [name]: value,
      });
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-800">Vehicle List</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
          Add Vehicle
        </button>
      </div>

      <div className="">
        <table className="w-full bg-white rounded-xl shadow-lg">
          <thead className="bg-blue-100">
            <tr>
              <th className="text-left p-4 text-blue-800 font-semibold rounded-tl-xl">
                Image
              </th>
              <th className="text-left p-4 text-blue-800 font-semibold">
                Vehicle Name
              </th>
              <th className="text-left p-4 text-blue-800 font-semibold">
                Vehicle Type
              </th>
              <th className="text-left p-4 text-blue-800 font-semibold rounded-tr-xl">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {vehicles.map((vehicle, index) => (
              <tr
                key={vehicle.id}
                className={`hover:bg-blue-50 ${
                  index === vehicles.length - 1 ? "rounded-b-xl" : ""
                }`}
              >
                <td
                  className={`p-4 ${
                    index === vehicles.length - 1 ? "rounded-bl-xl" : ""
                  }`}
                >
                  <img
                    src={vehicle.image}
                    alt={vehicle.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                </td>
                <td className="p-4 text-gray-700">{vehicle.name}</td>
                <td className="p-4 text-gray-700">{vehicle.type}</td>
                <td
                  className={`p-4 ${
                    index === vehicles.length - 1 ? "rounded-br-xl" : ""
                  }`}
                >
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={vehicle.isActive}
                      onChange={() => toggleActive(vehicle.id)}
                      className="sr-only peer"
                    />
                    <div className="relative w-10 h-5 bg-gray-300 rounded-full peer-checked:bg-blue-600 peer-checked:after:translate-x-5 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all transition-colors duration-300"></div>
                  </label>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Component */}
      <VehicleModal
        showModal={showModal}
        setShowModal={setShowModal}
        newVehicle={newVehicle}
        setNewVehicle={setNewVehicle}
        handleAddVehicle={handleAddVehicle}
        handleInputChange={handleInputChange}
      />

      <style>{`
        /* Smooth transitions for the toggle switch */
        .peer-checked\:after\:translate-x-5:after {
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        /* Prevent layout shift by setting a fixed width for the status text */
        .min-w-\[60px\] {
          min-width: 60px;
        }
      `}</style>
    </div>
  );
};

export default VehicleComponent;