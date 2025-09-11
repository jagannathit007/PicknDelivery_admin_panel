import React from "react";
import { FaTimes, FaUser, FaCreditCard, FaCalendarAlt, FaIdCard, FaMotorcycle, FaCheck, FaTimes as FaTimesIcon, FaClock } from "react-icons/fa";
import { BalanceRequest } from "../../services/SettlementService";

interface SettlementModalProps {
  isOpen: boolean;
  onClose: () => void;
  balanceRequest: BalanceRequest | null;
  onApprove?: (balanceRequest: BalanceRequest) => void;
  isApproving?: boolean;
}

const SettlementModal: React.FC<SettlementModalProps> = ({
  isOpen,
  onClose,
  balanceRequest,
  onApprove,
  isApproving = false,
}) => {
  if (!isOpen || !balanceRequest) return null;

  const imageBaseUrl = import.meta.env.VITE_BASE_URL;

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

  // Get status color and icon
  const getStatusInfo = (isSubmitted: boolean, isApproved: boolean) => {
    if (isApproved) {
      return {
        color: "bg-green-100 text-green-800 dark:bg-green-500/10 dark:text-green-400",
        icon: <FaCheck className="w-4 h-4" />,
        text: "Approved",
      };
    } else if (isSubmitted) {
      return {
        color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-500/10 dark:text-yellow-400",
        icon: <FaClock className="w-4 h-4" />,
        text: "Pending Approval",
      };
    } else {
      return {
        color: "bg-gray-100 text-gray-800 dark:bg-gray-500/10 dark:text-gray-400",
        icon: <FaTimesIcon className="w-4 h-4" />,
        text: "Not Submitted",
      };
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/50 bg-opacity-50 transition-opacity"
          onClick={onClose}
        ></div>

        {/* Modal */}
        <div className="relative w-full max-w-4xl bg-white dark:bg-gray-800 rounded-lg shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 dark:bg-blue-500/10 rounded-lg">
                <FaCreditCard className="text-blue-600 dark:text-blue-400 text-xl" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                  Balance Request Details
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  View complete balance request information
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
            {/* Rider Information */}
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <FaUser className="text-gray-500 dark:text-gray-400" />
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Rider Information
                </span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0 h-16 w-16">
                  {balanceRequest.rider.image ? (
                    <img
                      className="h-16 w-16 rounded-full object-cover"
                      src={`${imageBaseUrl}/${balanceRequest.rider.image}`}
                      alt={balanceRequest.rider.name}
                    />
                  ) : (
                    <div className="h-16 w-16 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                      <FaMotorcycle className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                    </div>
                  )}
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                    {balanceRequest.rider.name}
                  </h4>
                  <p className="text-gray-500 dark:text-gray-400">
                    {balanceRequest.rider.mobile}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-mono">
                    ID: {balanceRequest.rider._id}
                  </p>
                </div>
              </div>
            </div>

            {/* Summary Information */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Total Balance */}
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <FaCreditCard className="text-gray-500 dark:text-gray-400" />
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Total Balance
                  </span>
                </div>
                <p className="text-2xl font-bold text-gray-800 dark:text-white/90">
                  {formatAmount(balanceRequest.totalBalance)}
                </p>
              </div>

              {/* Balance Records Count */}
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <FaIdCard className="text-gray-500 dark:text-gray-400" />
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Balance Records
                  </span>
                </div>
                <p className="text-2xl font-bold text-gray-800 dark:text-white/90">
                  {balanceRequest.balances.length}
                </p>
              </div>

              {/* Last Submitted */}
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <FaCalendarAlt className="text-gray-500 dark:text-gray-400" />
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Last Submitted
                  </span>
                </div>
                <p className="text-sm text-gray-800 dark:text-white/90">
                  {balanceRequest.latestSubmittedAt ? formatDate(balanceRequest.latestSubmittedAt) : "N/A"}
                </p>
              </div>
            </div>

            {/* Balance Records */}
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-4">
                <FaCreditCard className="text-gray-500 dark:text-gray-400" />
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Individual Balance Records
                </span>
              </div>
              
              <div className="space-y-3">
                {balanceRequest.balances.map((balance, index) => {
                  const statusInfo = getStatusInfo(balance.isSubbmitted, balance.isApproved);
                  return (
                    <div key={balance._id} className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            Record #{index + 1}
                          </span>
                          <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                            {statusInfo.icon}
                            {statusInfo.text}
                          </span>
                        </div>
                        <span className="text-lg font-bold text-gray-800 dark:text-white/90">
                          {formatAmount(balance.amount)}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-gray-500 dark:text-gray-400">Created:</span>
                          <span className="ml-2 text-gray-800 dark:text-white/90">
                            {formatDate(balance.createdAt)}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500 dark:text-gray-400">Updated:</span>
                          <span className="ml-2 text-gray-800 dark:text-white/90">
                            {formatDate(balance.updatedAt)}
                          </span>
                        </div>
                      </div>
                      
                      {balance.extraDetails && Object.keys(balance.extraDetails).length > 0 && (
                        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Extra Details:</span>
                          <div className="mt-1 text-sm text-gray-800 dark:text-white/90">
                            {JSON.stringify(balance.extraDetails, null, 2)}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Timestamps */}
            {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <FaCalendarAlt className="text-gray-500 dark:text-gray-400" />
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Request Created At
                  </span>
                </div>
                <p className="text-sm text-gray-800 dark:text-white/90">
                  {formatDate(balanceRequest.createdAt)}
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <FaCalendarAlt className="text-gray-500 dark:text-gray-400" />
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Request Updated At
                  </span>
                </div>
                <p className="text-sm text-gray-800 dark:text-white/90">
                  {formatDate(balanceRequest.updatedAt)}
                </p>
              </div>
            </div> */}
          </div>

          {/* Footer */}
          <div className="flex justify-between p-6 border-t border-gray-200 dark:border-gray-700">
            <div>
              {balanceRequest.balances.some(b => b.isSubbmitted && !b.isApproved) && onApprove && (
                <button
                  onClick={() => onApprove(balanceRequest)}
                  disabled={isApproving}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isApproving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Approving...
                    </>
                  ) : (
                    <>
                      <FaCheck className="w-4 h-4" />
                      Approve Request
                    </>
                  )}
                </button>
              )}
            </div>
            <button
              onClick={onClose}
              disabled={isApproving}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors disabled:opacity-50"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettlementModal;
