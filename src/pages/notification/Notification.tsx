import { useState, useEffect } from "react";
import {
  FaSearch,
  FaMotorcycle,
  FaUser,
  FaCheckSquare,
  FaPaperPlane,
  FaRegSquare,
} from "react-icons/fa";
import RiderService, { Rider } from "../../services/RiderService";
import UserService, { Customer } from "../../services/UserService";
import toastHelper from "../../utils/toastHelper";

function Notification() {
  const [recipientType, setRecipientType] = useState<"rider" | "customer">("rider");
  const [riders, setRiders] = useState<Rider[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalDocs, setTotalDocs] = useState(0);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({
    title: "",
    description: "",
  });
  const itemsPerPage = 10;

  // Fetch data based on recipient type
  const fetchData = async (page = 1, search = "") => {
    setLoading(true);
    try {
      if (recipientType === "rider") {
        const response = await RiderService.getRiders({ page, limit: itemsPerPage, search });
        if (response && response.data) {
          setRiders(response.data.docs);
          setTotalPages(response.data.totalPages);
          setTotalDocs(response.data.totalDocs);
        }
      } else {
        const response = await UserService.getCustomers({ page, limit: itemsPerPage, search });
        if (response) {
          setCustomers(response.docs);
          setTotalPages(response.totalPages);
          setTotalDocs(response.totalDocs);
        }
      }
    } catch (error) {
      console.error(`Error fetching ${recipientType}s:`, error);
      toastHelper.error(`Failed to fetch ${recipientType}s`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(currentPage, searchTerm);
    setSelectedIds([]);
    setSelectAll(false);
  }, [recipientType, currentPage, searchTerm]);

  // Handle select all toggle
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedIds([]);
      setSelectAll(false);
    } else {
      const ids = recipientType === "rider"
        ? riders.map((rider) => rider._id!)
        : customers.map((customer) => customer._id!);
      setSelectedIds(ids);
      setSelectAll(true);
    }
  };

  // Handle individual selection
  const handleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((selectedId) => selectedId !== id));
      if (selectAll) {
        setSelectAll(false); // Unselecting an item breaks "Select All"
      }
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  // Handle notification input changes
  const handleNotificationChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setNotification({ ...notification, [e.target.name]: e.target.value });
  };

  // Handle send notification
  const handleSendNotification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notification.title || !notification.description) {
      toastHelper.error("Please fill in both title and description");
      return;
    }
    if (!selectedIds.length) {
      toastHelper.error("Please select at least one recipient");
      return;
    }
    console.log({
      title: notification.title,
      description: notification.description,
      recipientType,
      recipientIds: selectedIds,
    });
    toastHelper.showTost("Notification details logged to console", "success");
    setNotification({ title: "", description: "" });
    setSelectedIds([]);
    setSelectAll(false);
  };

  // Format date for display
  // const formatDate = (dateString?: string) => {
  //   if (!dateString) return "N/A";
  //   const date = new Date(dateString);
  //   return date.toLocaleDateString("en-US", {
  //     year: "numeric",
  //     month: "short",
  //     day: "numeric",
  //   });
  // };

  return (
    <div className="p-6 flex flex-col lg:flex-row gap-6">
      {/* Left Side: Recipient Selection */}
      <div className="lg:w-1/3 bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90 mb-4">
          Send Notification
        </h2>
        <form onSubmit={handleSendNotification}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Recipient Type
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setRecipientType("rider")}
                className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium ${
                  recipientType === "rider"
                    ? "bg-blue-600 text-white"
                    : "bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300"
                }`}
              >
                Riders
              </button>
              <button
                type="button"
                onClick={() => setRecipientType("customer")}
                className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium ${
                  recipientType === "customer"
                    ? "bg-blue-600 text-white"
                    : "bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300"
                }`}
              >
                Customers
              </button>
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Notification Title
            </label>
            <input
              type="text"
              name="title"
              value={notification.title}
              onChange={handleNotificationChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              placeholder="Enter notification title"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Notification Description
            </label>
            <textarea
              name="description"
              value={notification.description}
              onChange={handleNotificationChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              rows={4}
              placeholder="Enter notification description"
            />
          </div>
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
          >
            <FaPaperPlane />
            Send Notification
          </button>
        </form>
      </div>

      {/* Right Side: Table */}
      <div className="lg:w-2/3 bg-white h-fit dark:bg-white/[0.03] border border-gray-200 dark:border-gray-800 rounded-lg">
        <div className="p-4 border-b border-gray-200 dark:border-gray-800">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">
                {recipientType === "rider" ? "Riders" : "Customers"}
              </h2>
              <div className="text-sm text-gray-700 dark:text-gray-300">
                {selectedIds.length > 0
                  ? `${selectedIds.length} ${recipientType}(s) selected`
                  : "No recipients selected"}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder={`Search ${recipientType}s by name or mobile...`}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>
              <button
                onClick={handleSelectAll}
                className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-white/[0.03] text-sm"
              >
                {selectAll ? <FaCheckSquare /> : <FaRegSquare />}
                Select All
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-full overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-100 dark:border-gray-800">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                  Select
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                  Mobile
                </th>
                {recipientType === "customer" && (
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                    Status
                  </th>
                )}
                {recipientType === "customer" && (
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                    Verification
                  </th>
                )}
                {recipientType === "rider" && (
                  <>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                      Vehicle
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                      Verification
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                      Duty Status
                    </th>
                  </>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {loading ? (
                <tr>
                  <td colSpan={recipientType === "rider" ? 9 : 5} className="p-12 text-center">
                    <div className="text-gray-400 text-lg">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                      Loading {recipientType}s...
                    </div>
                  </td>
                </tr>
              ) : (recipientType === "rider" ? riders : customers).length === 0 ? (
                <tr>
                  <td colSpan={recipientType === "rider" ? 9 : 5} className="p-12 text-center">
                    <div className="text-gray-400 text-lg">
                      {recipientType === "rider" ? <FaMotorcycle className="mx-auto text-4xl mb-4" /> : <FaUser className="mx-auto text-4xl mb-4" />}
                      No {recipientType}s found matching your criteria
                    </div>
                  </td>
                </tr>
              ) : (
                (recipientType === "rider" ? riders : customers).map((item) => (
                  <tr
                    key={item._id}
                    className="hover:bg-gray-50 dark:hover:bg-white/[0.02]"
                  >
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(item._id!)}
                        onChange={() => handleSelect(item._id!)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-800 dark:text-white/90">
                      {item.name}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                      {item.mobile}
                    </td>
                    {recipientType === "customer" && (
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            (item as Customer).isActive
                              ? "bg-green-100 text-green-800 dark:bg-green-500/10 dark:text-green-400"
                              : "bg-red-100 text-red-800 dark:bg-red-500/10 dark:text-red-400"
                          }`}
                        >
                          {(item as Customer).isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                    )}
                    {recipientType === "customer" && (
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            (item as Customer).isVerified
                              ? "bg-blue-100 text-blue-800 dark:bg-blue-500/10 dark:text-blue-400"
                              : "bg-yellow-100 text-yellow-800 dark:bg-yellow-500/10 dark:text-yellow-400"
                          }`}
                        >
                          {(item as Customer).isVerified ? "Verified" : "Pending"}
                        </span>
                      </td>
                    )}
                    {recipientType === "rider" && (
                      <>
                        <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                          <div className="font-medium">
                            {(item as Rider).vehicleName || "N/A"}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {(item as Rider).vehicleNumber || "N/A"}
                          </div>
                          {(item as Rider).vehicleType && (
                            <span className="inline-block px-2 py-0.5 text-xs bg-purple-100 dark:bg-purple-500/10 text-purple-800 dark:text-purple-400 rounded-full mt-1">
                              {(item as Rider).vehicleType.name}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              (item as Rider).isActive
                                ? "bg-green-100 text-green-800 dark:bg-green-500/10 dark:text-green-400"
                                : "bg-red-100 text-red-800 dark:bg-red-500/10 dark:text-red-400"
                            }`}
                          >
                            {(item as Rider).isActive ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              (item as Rider).isVerified
                                ? "bg-blue-100 text-blue-800 dark:bg-blue-500/10 dark:text-blue-400"
                                : "bg-yellow-100 text-yellow-800 dark:bg-yellow-500/10 dark:text-yellow-400"
                            }`}
                          >
                            {(item as Rider).isVerified ? "Verified" : "Pending"}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              (item as Rider).isDuty
                                ? "bg-orange-100 text-orange-800 dark:bg-orange-500/10 dark:text-orange-400"
                                : "bg-gray-100 text-gray-800 dark:bg-gray-500/10 dark:text-gray-400"
                            }`}
                          >
                            {(item as Rider).isDuty ? "On Duty" : "Off Duty"}
                          </span>
                        </td>
                      </>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-3 border-t border-gray-200 dark:border-gray-800">
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-4 sm:mb-0">
            Showing {(recipientType === "rider" ? riders : customers).length} of {totalDocs} {recipientType}s
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
    </div>
  );
}

export default Notification;