import React, { useState, useRef, useEffect } from 'react';
import { FaEllipsisV, FaMapMarkerAlt, FaCompass, FaUserPlus, FaUserEdit, FaTimes } from 'react-icons/fa';
import { MdClose } from 'react-icons/md';

interface ActionsDropdownProps {
  order: any;
  onViewLocations: () => void;
  onTrackOrder?: () => void;
  onAssignRider?: () => void;
  onReassignRider?: () => void;
  onCancelOrder?: () => void;
  isCompleted: boolean;
}

const ActionsDropdown: React.FC<ActionsDropdownProps> = ({
  order,
  onViewLocations,
  onTrackOrder,
  onAssignRider,
  onReassignRider,
  onCancelOrder,
  isCompleted,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleAction = (action: () => void) => {
    action();
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
        title="Actions"
      >
        <FaEllipsisV className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50">
          <div className="py-1">
            {/* View Locations - Always available */}
            <button
              onClick={() => handleAction(onViewLocations)}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <FaMapMarkerAlt className="w-4 h-4 mr-3 text-blue-500" />
              View Locations
            </button>

            {/* Track Order - Only if rider is assigned and not completed */}
            {order.rider && order.rider._id && !isCompleted && onTrackOrder && (
              <button
                onClick={() => handleAction(onTrackOrder)}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <FaCompass className="w-4 h-4 mr-3 text-purple-500" />
                Track Order
              </button>
            )}

            {/* Assign/Reassign Rider - Only if not completed */}
            {!isCompleted && (
              <>
                {order.rider && order.rider._id ? (
                  onReassignRider && (
                    <button
                      onClick={() => handleAction(onReassignRider)}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <FaUserEdit className="w-4 h-4 mr-3 text-blue-500" />
                      Reassign Rider
                    </button>
                  )
                ) : (
                  onAssignRider && (
                    <button
                      onClick={() => handleAction(onAssignRider)}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <FaUserPlus className="w-4 h-4 mr-3 text-green-500" />
                      Assign Rider
                    </button>
                  )
                )}
              </>
            )}

            {/* Cancel Order - Only if not completed and not already cancelled */}
            {!isCompleted && order.status !== "cancelled" && onCancelOrder && (
              <>
                <div className="border-t border-gray-100 my-1"></div>
                <button
                  onClick={() => handleAction(onCancelOrder)}
                  className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <MdClose className="w-4 h-4 mr-3" />
                  Cancel Order
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ActionsDropdown;
