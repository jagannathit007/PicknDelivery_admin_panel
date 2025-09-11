import React from "react";
import { FaTimes, FaUser, FaCreditCard, FaCalendarAlt, FaIdCard, FaArrowUp, FaArrowDown, FaMoneyBillWave } from "react-icons/fa";
import { Transaction } from "../../services/TransactionService";

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: Transaction | null;
}

const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen,
  onClose,
  transaction,
}) => {
  if (!isOpen || !transaction) return null;

  // Format amount for display
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  // Get user type color and icon
  const getUserTypeInfo = (userType: string) => {
    switch (userType) {
      case "customer":
        return {
          color: "bg-blue-100 text-blue-800 dark:bg-blue-500/10 dark:text-blue-400",
          icon: <FaUser className="w-4 h-4" />,
        };
      case "rider":
        return {
          color: "bg-green-100 text-green-800 dark:bg-green-500/10 dark:text-green-400",
          icon: <FaUser className="w-4 h-4" />,
        };
      case "admin":
        return {
          color: "bg-purple-100 text-purple-800 dark:bg-purple-500/10 dark:text-purple-400",
          icon: <FaUser className="w-4 h-4" />,
        };
      default:
        return {
          color: "bg-gray-100 text-gray-800 dark:bg-gray-500/10 dark:text-gray-400",
          icon: <FaUser className="w-4 h-4" />,
        };
    }
  };

  // Get transaction type color and icon
  const getTransactionTypeInfo = (transactionType: string) => {
    if (transactionType === "cash") {
      return {
        color: "bg-green-100 text-green-800 dark:bg-green-500/10 dark:text-green-400",
        icon: <FaArrowUp className="w-4 h-4" />,
      };
    } else {
      return {
        color: "bg-red-100 text-red-800 dark:bg-red-500/10 dark:text-red-400",
        icon: <FaArrowDown className="w-4 h-4" />,
      };
    }
  };

  const fromUserTypeInfo = getUserTypeInfo(transaction.fromUserType);
  const toUserTypeInfo = getUserTypeInfo(transaction.toUserType);
  const transactionTypeInfo = getTransactionTypeInfo(transaction.paymentMethod);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/50 bg-opacity-50 transition-opacity"
          onClick={onClose}
        ></div>

        {/* Modal */}
        <div className="relative w-full max-w-2xl bg-white dark:bg-gray-800 rounded-lg shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 dark:bg-blue-500/10 rounded-lg">
                <FaCreditCard className="text-blue-600 dark:text-blue-400 text-xl" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                  Transaction Details
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  View complete transaction information
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <FaTimes className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Transaction ID */}
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <FaIdCard className="text-gray-500 dark:text-gray-400" />
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Transaction ID
                </span>
              </div>
              <p className="font-mono text-lg text-gray-800 dark:text-white/90">
                {transaction._id}
              </p>
            </div>

            {/* Basic Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Paid User Type */}
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <FaUser className="text-gray-500 dark:text-gray-400" />
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Paid User Type
                  </span>
                </div>
                <span className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium ${fromUserTypeInfo.color}`}>
                  {fromUserTypeInfo.icon}
                  {transaction.fromUserType.charAt(0).toUpperCase() + transaction.fromUserType.slice(1)}
                </span>
              </div>

              {/* Received User Type */}
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <FaUser className="text-gray-500 dark:text-gray-400" />
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Received User Type
                  </span>
                </div>
                <span className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium ${toUserTypeInfo.color}`}>
                  {toUserTypeInfo.icon}
                  {transaction.toUserType.charAt(0).toUpperCase() + transaction.toUserType.slice(1)}
                </span>
              </div>

              {/* Transaction Type */}
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <FaMoneyBillWave className="text-gray-500 dark:text-gray-400" />
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Transaction Type
                  </span>
                </div>
                <span className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium ${transactionTypeInfo.color}`}>
                  {/* {transactionTypeInfo.icon} */}
                  {transaction.paymentMethod.charAt(0).toUpperCase() + transaction.paymentMethod.slice(1)}
                </span>
              </div>

              {/* Amount */}
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <FaMoneyBillWave className="text-gray-500 dark:text-gray-400" />
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Amount
                  </span>
                </div>
                <p className="text-2xl font-bold text-gray-800 dark:text-white/90">
                  {formatAmount(transaction.amount)}
                </p>
              </div>

              {/* Order ID */}
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <FaIdCard className="text-gray-500 dark:text-gray-400" />
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Order ID
                  </span>
                </div>
                <p className="font-mono text-sm text-gray-800 dark:text-white/90">
                  {transaction.orderId || "N/A"}
                </p>
              </div>
            </div>

            {/* Timestamps */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <FaCalendarAlt className="text-gray-500 dark:text-gray-400" />
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Created At
                  </span>
                </div>
                <p className="text-sm text-gray-800 dark:text-white/90">
                  {formatDate(transaction.createdAt)}
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <FaCalendarAlt className="text-gray-500 dark:text-gray-400" />
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Updated At
                  </span>
                </div>
                <p className="text-sm text-gray-800 dark:text-white/90">
                  {formatDate(transaction.updatedAt)}
                </p>
              </div>
            </div>

            {/* Extra Fields */}
            {transaction.extraFields && Object.keys(transaction.extraFields).length > 0 && (
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <FaCreditCard className="text-gray-500 dark:text-gray-400" />
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Additional Information
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {Object.entries(transaction.extraFields).map(([key, value]) => (
                    <div key={key} className="flex flex-col">
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                      <span className="text-sm text-gray-800 dark:text-white/90">
                        {typeof value === 'string' ? value : JSON.stringify(value)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionModal;
