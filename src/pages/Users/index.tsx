import { useState, useMemo } from "react";
import {
  FaSearch,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaUsers,
  FaFilter,
} from "react-icons/fa";

interface User {
  id: number;
  image: string;
  name: string;
  email: string;
  mobile: string;
  status: string;
  verified: string;
  joiningDate: string;
}

interface SortConfig {
  key: keyof User | null;
  direction: "ascending" | "descending";
}

const dummyUsers = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1633332755192-727a05c4013d?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dXNerxlbnwwfHwwfHx8MA%3D%3D",
    name: "John Doe",
    email: "john@example.com",
    mobile: "123-456-7890",
    status: "Active",
    verified: "Yes",
    joiningDate: "2023-01-15",
  },
  {
    id: 2,
    image: "https://cdn-icons-png.flaticon.com/512/219/219969.png",
    name: "Jane Smith",
    email: "jane@example.com",
    mobile: "234-567-8901",
    status: "Inactive",
    verified: "No",
    joiningDate: "2023-02-20",
  },
  {
    id: 3,
    image: "https://cdn-icons-png.flaticon.com/128/219/219986.png",
    name: "Alice Brown",
    email: "alice@example.com",
    mobile: "345-678-9012",
    status: "Active",
    verified: "Yes",
    joiningDate: "2023-03-10",
  },
  {
    id: 4,
    image: "https://cdn-icons-png.flaticon.com/512/4323/4323015.png",
    name: "Bob Black",
    email: "bob@example.com",
    mobile: "456-789-0123",
    status: "Active",
    verified: "Yes",
    joiningDate: "2023-04-05",
  },
  {
    id: 5,
    image: "https://cdn-icons-png.flaticon.com/256/622/622851.png",
    name: "Charlie Adams",
    email: "charlie@example.com",
    mobile: "567-890-1234",
    status: "Inactive",
    verified: "No",
    joiningDate: "2023-05-12",
  },
  {
    id: 6,
    image: "https://cdn-icons-png.flaticon.com/256/306/306473.png",
    name: "David Allen",
    email: "david@example.com",
    mobile: "678-901-2345",
    status: "Active",
    verified: "Yes",
    joiningDate: "2023-06-18",
  },
  {
    id: 7,
    image: "https://cdn-icons-png.flaticon.com/512/4323/4323015.png",
    name: "Eva Green",
    email: "eva@example.com",
    mobile: "789-012-3456",
    status: "Active",
    verified: "Yes",
    joiningDate: "2023-07-22",
  },
  {
    id: 8,
    image: "https://cdn-icons-png.flaticon.com/256/560/560200.png",
    name: "Frank Red",
    email: "frank@example.com",
    mobile: "890-123-4567",
    status: "Inactive",
    verified: "No",
    joiningDate: "2023-08-30",
  },
  {
    id: 9,
    image: "https://cdn-icons-png.flaticon.com/256/560/560200.png",
    name: "Grace Silver",
    email: "grace@example.com",
    mobile: "901-234-5678",
    status: "Active",
    verified: "Yes",
    joiningDate: "2023-09-05",
  },
  {
    id: 10,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSTyQ1ZY-k_Ml8LtwjJV-HXSU6CQFrIicuPOMIxagvrhfkzZQ155bhXMbbvN0aNP5eeaOs&usqp=CAU",
    name: "Henry White",
    email: "henry@example.com",
    mobile: "012-345-6789",
    status: "Active",
    verified: "Yes",
    joiningDate: "2023-10-15",
  },
  {
    id: 11,
    image: "https://via.placeholder.com/40?text=IB",
    name: "Ivy Blue",
    email: "ivy@example.com",
    mobile: "123-456-7891",
    status: "Inactive",
    verified: "No",
    joiningDate: "2023-11-20",
  },
  {
    id: 12,
    image: "https://via.placeholder.com/40?text=JP",
    name: "Jack Purple",
    email: "jack@example.com",
    mobile: "234-567-8902",
    status: "Active",
    verified: "Yes",
    joiningDate: "2023-12-25",
  },
  {
    id: 13,
    image: "https://via.placeholder.com/40?text=KO",
    name: "Kelly Orange",
    email: "kelly@example.com",
    mobile: "345-678-9013",
    status: "Active",
    verified: "Yes",
    joiningDate: "2024-01-05",
  },
  {
    id: 14,
    image: "https://via.placeholder.com/40?text=LY",
    name: "Leo Yellow",
    email: "leo@example.com",
    mobile: "456-789-0124",
    status: "Inactive",
    verified: "No",
    joiningDate: "2024-02-10",
  },
  {
    id: 15,
    image: "https://via.placeholder.com/40?text=MP",
    name: "Mia Pink",
    email: "mia@example.com",
    mobile: "567-890-1235",
    status: "Active",
    verified: "Yes",
    joiningDate: "2024-03-15",
  },
  {
    id: 16,
    image: "https://via.placeholder.com/40?text=NG",
    name: "Noah Gray",
    email: "noah@example.com",
    mobile: "678-901-2346",
    status: "Active",
    verified: "Yes",
    joiningDate: "2024-04-20",
  },
  {
    id: 17,
    image: "https://via.placeholder.com/40?text=OB",
    name: "Olivia Brown",
    email: "olivia@example.com",
    mobile: "789-012-3457",
    status: "Inactive",
    verified: "No",
    joiningDate: "2024-05-25",
  },
  {
    id: 18,
    image: "https://via.placeholder.com/40?text=PG",
    name: "Paul Green",
    email: "paul@example.com",
    mobile: "890-123-4568",
    status: "Active",
    verified: "Yes",
    joiningDate: "2024-06-01",
  },
  {
    id: 19,
    image: "https://via.placeholder.com/40?text=QR",
    name: "Quinn Red",
    email: "quinn@example.com",
    mobile: "901-234-5679",
    status: "Active",
    verified: "Yes",
    joiningDate: "2024-07-07",
  },
  {
    id: 20,
    image: "https://via.placeholder.com/40?text=RS",
    name: "Riley Silver",
    email: "riley@example.com",
    mobile: "012-345-6790",
    status: "Inactive",
    verified: "No",
    joiningDate: "2024-08-12",
  },
];

function UserTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("All");
  const [verifiedFilter, setVerifiedFilter] = useState("All");
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: null,
    direction: "ascending",
  });
  const itemsPerPage = 10;

  // Handle sorting
  const handleSort = (key: keyof User) => {
    let direction: "ascending" | "descending" = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  // Get sort icon based on current sort state
  const getSortIcon = (key: keyof User) => {
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

  // Filter and sort users
  const filteredUsers = useMemo(() => {
    let users = dummyUsers.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "All" || user.status === statusFilter;
      const matchesVerified =
        verifiedFilter === "All" || user.verified === verifiedFilter;

      return matchesSearch && matchesStatus && matchesVerified;
    });

    // Apply sorting if a sort key is selected
    if (sortConfig.key) {
      users.sort((a, b) => {
        const aValue = a[sortConfig.key as keyof User];
        const bValue = b[sortConfig.key as keyof User];

        // Special handling for date sorting
        if (sortConfig.key === "joiningDate") {
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

    return users;
  }, [searchTerm, sortConfig, statusFilter, verifiedFilter]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const currentUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Calculate statistics
  const activeUsers = dummyUsers.filter(
    (user) => user.status === "Active"
  ).length;
  const verifiedUsers = dummyUsers.filter(
    (user) => user.verified === "Yes"
  ).length;

  return (
    <div className="container mx-auto p-8">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold mb-2 text-blue-800">Users</h1>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search users by name or email..."
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

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-800">Total Users</p>
                <p className="text-3xl font-bold text-gray-900">
                  {dummyUsers.length}
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
                  Active Users
                </p>
                <p className="text-3xl font-bold text-green-600">
                  {activeUsers}
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
                  Verified Users
                </p>
                <p className="text-3xl font-bold text-blue-600">
                  {verifiedUsers}
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
                  Inactive Users
                </p>
                <p className="text-3xl font-bold text-red-600">
                  {dummyUsers.length - activeUsers}
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
                  User
                </th>
                <th
                  className="text-left p-6 text-blue-800 font-semibold cursor-pointer  transition-colors duration-200"
                  onClick={() => handleSort("name")}
                >
                  <div className="flex items-center">
                    Name
                    {getSortIcon("name")}
                  </div>
                </th>
                <th
                  className="text-left p-6 text-blue-800 font-semibold cursor-pointer  transition-colors duration-200"
                  onClick={() => handleSort("email")}
                >
                  <div className="flex items-center">
                    Email
                    {getSortIcon("email")}
                  </div>
                </th>
                <th className="text-left p-6 text-blue-800 font-semibold">
                  Mobile
                </th>
                <th
                  className="text-left p-6 text-blue-800 font-semibold cursor-pointer  transition-colors duration-200"
                  onClick={() => handleSort("joiningDate")}
                >
                  <div className="flex items-center">
                    Joining Date
                    {getSortIcon("joiningDate")}
                  </div>
                </th>
                <th
                  className="text-left p-6 text-blue-800 font-semibold cursor-pointer  transition-colors duration-200"
                  onClick={() => handleSort("status")}
                >
                  <div className="flex items-center">
                    Status
                    {getSortIcon("status")}
                  </div>
                </th>
                <th className="text-left p-6 text-blue-800 font-semibold">
                  Verified
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {currentUsers.map((user, index) => (
                <tr
                  key={user.id}
                  className="hover:bg-blue-50 transition-all duration-200 group"
                >
                  <td className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <img
                          src={user.image}
                          alt={user.name}
                          className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                        />
                      </div>
                    </div>
                  </td>
                  <td className="p-6">
                    <div className="font-semibold text-gray-900">
                      {user.name}
                    </div>
                  </td>
                  <td className="p-6">
                    <div className="text-gray-600">{user.email}</div>
                  </td>
                  <td className="p-6">
                    <div className="text-gray-600 font-mono">{user.mobile}</div>
                  </td>
                  <td className="p-6">
                    <div className="text-gray-600">
                      {formatDate(user.joiningDate)}
                    </div>
                  </td>
                  <td className="p-6">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        user.status === "Active"
                          ? "bg-green-100 text-green-800 border border-green-200"
                          : "bg-red-100 text-red-800 border border-red-200"
                      }`}
                    >
                      <div
                        className={`w-2 h-2 rounded-full mr-2 ${
                          user.status === "Active"
                            ? "bg-green-500"
                            : "bg-red-500"
                        }`}
                      ></div>
                      {user.status}
                    </span>
                  </td>
                  <td className="p-6">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        user.verified === "Yes"
                          ? "bg-blue-100 text-blue-800 border border-blue-200"
                          : "bg-gray-100 text-gray-800 border border-gray-200"
                      }`}
                    >
                      {user.verified === "Yes" ? "✓" : "○"}{" "}
                      {user.verified === "Yes" ? "Verified" : "Pending"}
                    </span>
                  </td>
                </tr>
              ))}
              {currentUsers.length === 0 && (
                <tr>
                  <td colSpan={8} className="p-12 text-center">
                    <div className="text-gray-400 text-lg">
                      <FaUsers className="mx-auto text-4xl mb-4" />
                      No users found matching your criteria
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between mt-8 space-y-4 sm:space-y-0">
        <div className="text-gray-600">
          Showing{" "}
          {Math.min((currentPage - 1) * itemsPerPage + 1, filteredUsers.length)}{" "}
          to {Math.min(currentPage * itemsPerPage, filteredUsers.length)} of{" "}
          {filteredUsers.length} users
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
    </div>
  );
}

export default UserTable;
