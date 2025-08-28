import { useState, useMemo, useEffect } from "react";
import {
  FaSearch,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaFilter,
  FaEye,
  FaUser,
  FaCreditCard,
  FaMoneyBillWave,
  FaArrowUp,
  FaArrowDown,
  FaCalendarAlt,
  FaChevronDown,
  FaMotorcycle,
} from "react-icons/fa";
import { MdClose } from "react-icons/md";
import TransactionService, { Transaction, TransactionFilters } from "../../services/TransactionService";
import RiderService from "../../services/RiderService";
import TransactionModal from "../../components/common/TransactionModal";
import toastHelper from "../../utils/toastHelper";

interface SortConfig {
  key: keyof Transaction | null;
  direction: "ascending" | "descending";
}

interface Rider {
  _id?: string;
  name: string;
  mobile: string;
  image?: string;
}

const imageBaseUrl = import.meta.env.VITE_BASE_URL;

function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [riders, setRiders] = useState<Rider[]>([]);
  const [selectedRider, setSelectedRider] = useState<Rider | null>(null);
  const [riderSearchTerm, setRiderSearchTerm] = useState("");
  const [isRiderDropdownOpen, setIsRiderDropdownOpen] = useState(false);
  const [isLoadingRiders, setIsLoadingRiders] = useState(false);
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: null,
    direction: "ascending",
  });
  const [totalPages, setTotalPages] = useState(1);
  const [totalDocs, setTotalDocs] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const itemsPerPage = 10;

  // Fetch riders for the dropdown
  const fetchRiders = async (search = "") => {
    try {
      setIsLoadingRiders(true);
      const response = await RiderService.getRiders({
        search,
        page: 1,
        limit: 100,
      });
      
      if (response && response.status === 200 && response.data) {
        setRiders(response.data.docs);
      } else {
        setRiders([]);
      }
    } catch (error) {
      console.error("Error fetching riders:", error);
      setRiders([]);
    } finally {
      setIsLoadingRiders(false);
    }
  };

  // Fetch transactions from API
  const fetchTransactions = async (page = 1, filters: Partial<TransactionFilters> = {}) => {
    setLoading(true);
    try {
      const response = await TransactionService.getTransactions({
        page,
        limit: itemsPerPage,
        ...filters,
      });

      if (response && response.status === 200 && response.data) {
        setTransactions(response.data.docs);
        setTotalPages(response.data.totalPages);
        setTotalDocs(response.data.totalDocs);
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
      toastHelper.error("Failed to fetch transactions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRiders();
  }, []);

  useEffect(() => {
    const filters: Partial<TransactionFilters> = {};
    if (selectedRider?._id) filters.rider = selectedRider._id;
    
    fetchTransactions(currentPage, filters);
  }, [currentPage, selectedRider]);

  // Handle rider search with debouncing
  const handleRiderSearch = (searchTerm: string) => {
    setRiderSearchTerm(searchTerm);
    
    if ((window as any).riderSearchTimeout) {
      clearTimeout((window as any).riderSearchTimeout);
    }
    
    (window as any).riderSearchTimeout = setTimeout(() => {
      fetchRiders(searchTerm);
    }, 300);
  };

  // Handle rider selection
  const handleRiderSelect = (rider: Rider) => {
    setSelectedRider(rider);
    setIsRiderDropdownOpen(false);
    setRiderSearchTerm(rider.name);
  };

  // Clear rider selection
  const clearRiderSelection = () => {
    setSelectedRider(null);
    setRiderSearchTerm("");
    setIsRiderDropdownOpen(false);
  };

  // Filtered riders for dropdown
  const filteredRiders = useMemo(() => {
    if (!riderSearchTerm) return riders;
    return riders.filter(rider =>
      rider.name.toLowerCase().includes(riderSearchTerm.toLowerCase()) ||
      rider.mobile.includes(riderSearchTerm)
    );
  }, [riders, riderSearchTerm]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.rider-dropdown-container')) {
        setIsRiderDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle sorting
  const handleSort = (key: keyof Transaction) => {
    let direction: "ascending" | "descending" = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  // Get sort icon based on current sort state
  const getSortIcon = (key: keyof Transaction) => {
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
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Format amount for display
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  // Handle view transaction details
  const handleViewTransaction = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsModalOpen(true);
  };

  // Handle close modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTransaction(null);
  };

  // Filter and sort transactions
  const filteredTransactions = useMemo(() => {
    const filtered = transactions.filter((transaction) => {
      const matchesSearch = searchTerm === "" || 
        transaction._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.amount.toString().includes(searchTerm) ||
        transaction.userType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.transactionType.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesSearch;
    });

    // Apply sorting if a sort key is selected
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        const aValue = a[sortConfig.key as keyof Transaction];
        const bValue = b[sortConfig.key as keyof Transaction];

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
  }, [transactions, searchTerm, sortConfig]);

  return (
    <div className="p-6">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-white/90">
          Transactions Management
        </h1>
        <p className="text-gray-500 text-sm dark:text-gray-400 mt-1">
          Monitor and manage all financial transactions across the platform
        </p>
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
                placeholder="Search transactions by ID, amount, or type..."
                className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>

            {/* Rider Searchable Select */}
            <div className="relative rider-dropdown-container">
              <div className="relative">
                <FaMotorcycle className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by rider..."
                  value={riderSearchTerm}
                  onChange={(e) => handleRiderSearch(e.target.value)}
                  onFocus={() => setIsRiderDropdownOpen(true)}
                  className="pl-10 pr-12 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ease-in-out text-sm text-gray-700 dark:text-gray-300"
                />
                {selectedRider ? (
                  <button
                    onClick={clearRiderSelection}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    <MdClose className="w-5 h-5 text-gray-400 hover:text-gray-600 transition-colors" />
                  </button>
                ) : (
                  <button
                    onClick={() => setIsRiderDropdownOpen(!isRiderDropdownOpen)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    <FaChevronDown className="w-4 h-4 text-gray-400 hover:text-gray-600 transition-colors" />
                  </button>
                )}
              </div>
              
              {/* Rider Dropdown */}
              {isRiderDropdownOpen && (
                <div className="absolute z-50 w-full mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl max-h-80 overflow-auto transition-all duration-200 ease-in-out transform origin-top">
                  {isLoadingRiders ? (
                    <div className="px-4 py-3 text-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500 mx-auto"></div>
                      <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">Searching...</p>
                    </div>
                  ) : filteredRiders.length === 0 ? (
                    <div className="px-4 py-3 text-gray-500 dark:text-gray-400 text-sm">
                      {riderSearchTerm ? 'No riders found' : 'Type to search riders'}
                    </div>
                  ) : (
                    filteredRiders.map((rider) => (
                      <button
                        key={rider._id}
                        onClick={() => handleRiderSelect(rider)}
                        className="w-full text-left px-4 py-3 hover:bg-blue-50 dark:hover:bg-blue-500/10 focus:bg-blue-50 dark:focus:bg-blue-500/10 focus:outline-none transition-colors duration-150"
                      >
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8 mr-3">
                            {rider.image ? (
                              <img
                                className="h-8 w-8 rounded-full object-cover"
                                src={`${imageBaseUrl}/${rider.image}`}
                                alt={rider.name}
                              />
                            ) : (
                              <div className="h-8 w-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                                <FaMotorcycle className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white/90">
                              {rider.name}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {rider.mobile}
                            </div>
                          </div>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="max-w-full overflow-x-auto">
          <table className="w-full">
            {/* Table Header */}
            <thead className="border-b border-gray-100 dark:border-gray-800">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                  Transaction ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                  User Type
                </th>
                <th
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 cursor-pointer hover:text-gray-700 dark:hover:text-gray-200"
                  onClick={() => handleSort("amount")}
                >
                  <div className="flex items-center">
                    Amount
                    {getSortIcon("amount")}
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                  Type
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                  Order ID
                </th>
                <th
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 cursor-pointer hover:text-gray-700 dark:hover:text-gray-200"
                  onClick={() => handleSort("createdAt")}
                >
                  <div className="flex items-center">
                    Date
                    {getSortIcon("createdAt")}
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
                  <td colSpan={7} className="p-12 text-center">
                    <div className="text-gray-400 text-lg">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                      Loading transactions...
                    </div>
                  </td>
                </tr>
              ) : filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center">
                    <div className="text-gray-400 text-lg">
                      <FaCreditCard className="mx-auto text-4xl mb-4" />
                      No transactions found matching your criteria
                    </div>
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((transaction) => (
                  <tr
                    key={transaction._id}
                    className="hover:bg-gray-50 dark:hover:bg-white/[0.02]"
                  >
                    <td className="px-4 py-3">
                      <div className="font-mono text-sm text-gray-800 dark:text-white/90">
                        {transaction._id?.substring(0, 8)}...
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          transaction.userType === "customer"
                            ? "bg-blue-100 text-blue-800 dark:bg-blue-500/10 dark:text-blue-400"
                            : transaction.userType === "rider"
                            ? "bg-green-100 text-green-800 dark:bg-green-500/10 dark:text-green-400"
                            : "bg-purple-100 text-purple-800 dark:bg-purple-500/10 dark:text-purple-400"
                        }`}
                      >
                        <FaUser className="w-2 h-2 mr-1" />
                        {transaction.userType.charAt(0).toUpperCase() + transaction.userType.slice(1)}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <div className="font-semibold text-gray-800 dark:text-white/90 text-sm">
                        {formatAmount(transaction.amount)}
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          transaction.transactionType === "credit"
                            ? "bg-green-100 text-green-800 dark:bg-green-500/10 dark:text-green-400"
                            : "bg-red-100 text-red-800 dark:bg-red-500/10 dark:text-red-400"
                        }`}
                      >
                        {transaction.transactionType === "credit" ? (
                          <FaArrowUp className="w-2 h-2 mr-1" />
                        ) : (
                          <FaArrowDown className="w-2 h-2 mr-1" />
                        )}
                        {transaction.transactionType.charAt(0).toUpperCase() + transaction.transactionType.slice(1)}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <div className="text-gray-600 dark:text-gray-400 text-sm">
                        {transaction.orderId ? (
                          <span className="font-mono text-xs">
                            {transaction.orderId.substring(0, 8)}...
                          </span>
                        ) : (
                          <span className="text-gray-400 text-xs">N/A</span>
                        )}
                      </div>
                    </td>

                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400 text-sm">
                      <div className="flex items-center">
                        <FaCalendarAlt className="w-3 h-3 mr-1" />
                        {transaction.createdAt ? formatDate(transaction.createdAt) : "N/A"}
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleViewTransaction(transaction)}
                          className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded"
                          title="View Details"
                        >
                          <FaEye className="w-3 h-3" />
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
            Showing {transactions.length} of {totalDocs} transactions
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

      {/* Transaction Modal */}
      <TransactionModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        transaction={selectedTransaction}
      />
    </div>
  );
}

export default Transactions;
