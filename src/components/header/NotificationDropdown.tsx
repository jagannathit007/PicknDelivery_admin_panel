import { useState, useEffect } from "react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import UserService, { Notification } from "../../services/userService";
// import toastHelper from "../utils/toastHelper";

// Audio file from a live link (Freesound.org)
const notificationSound = new Audio(
  "https://audio-previews.elements.envatousercontent.com/files/472198703/preview.mp3"
);

interface NotificationItem {
  id: string;
  category: string;
  user: string;
  action: string;
  project: string;
  time: string;
  // image: string;
  status: "success" | "error";
}

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifying, setNotifying] = useState(false);
  const [audioPermission, setAudioPermission] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);

  // Request audio permission on user interaction
  const requestAudioPermission = async () => {
    try {
      await notificationSound.play();
      setAudioPermission(true);
    } catch (error) {
      console.log("Audio permission denied or error:", error);
      setAudioPermission(false);
    }
  };

  // Fetch notifications from API
  const fetchNotifications = async (pageNum: number = 1) => {
    setLoading(true);
    try {
      const response = await UserService.getNotifications({
        page: pageNum,
        limit: 10,
        notificationType: "customer",
        sortBy: "createdAt",
        sortOrder: "desc",
      });

      if (response) {
        const mappedNotifications: NotificationItem[] = response.notifications.map(
          (notif: Notification) => ({
            id: notif._id,
            category: notif.notificationType,
            user: notif.title.split(" ")[0], // Extract user name from title
            action: notif.description,
            project: "Project - Nganter App",
            time: formatTime(notif.createdAt),
            // image: `/images/user/user-0${Math.floor(Math.random() * 5) + 2}.jpg`, // Random placeholder image
            status: "success", // Adjust based on your logic
          })
        );
        setNotifications((prev) =>
          pageNum === 1 ? mappedNotifications : [...prev, ...mappedNotifications]
        );
        setHasNextPage(response.pagination.hasNextPage);
        setNotifying(response.notifications.length > 0);
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
      // toastHelper.error("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  // Format time for display (e.g., "5 min ago")
  const formatTime = (createdAt: string): string => {
    const now = new Date();
    const created = new Date(createdAt);
    const diffInMinutes = Math.floor(
      (now.getTime() - created.getTime()) / 1000 / 60
    );
    if (diffInMinutes < 60) {
      return `${diffInMinutes} min ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)} hr ago`;
    }
    return "Just now";
  };

  // Fetch notifications on mount and page change
  useEffect(() => {
    fetchNotifications(page);
  }, [page]);

  // Play sound when a new Customer notification is added
  useEffect(() => {
    const latestNotification = notifications[0];
    if (
      audioPermission &&
      latestNotification &&
      latestNotification.category === "customer"
    ) {
      notificationSound.play().catch((error) => {
        console.log("Failed to play notification sound:", error);
      });
    }
  }, [notifications, audioPermission]);

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  const handleClick = () => {
    toggleDropdown();
    setNotifying(false);
    if (!audioPermission) {
      requestAudioPermission();
    }
  };

  // Load more notifications
  const loadMore = () => {
    if (hasNextPage && !loading) {
      setPage((prev) => prev + 1);
    }
  };

  return (
    <div className="relative">
      <button
        className="relative flex items-center justify-center text-gray-500 transition-colors bg-white border border-gray-200 rounded-full dropdown-toggle hover:text-gray-700 h-11 w-11 hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
        onClick={handleClick}
      >
        <span
          className={`absolute right-0 top-0.5 z-10 h-2 w-2 rounded-full bg-orange-400 ${
            !notifying ? "hidden" : "flex"
          }`}
        >
          <span className="absolute inline-flex w-full h-full bg-orange-400 rounded-full opacity-75 animate-ping"></span>
        </span>
        <svg
          className="fill-current"
          width="20"
          height="20"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M10.75 2.29248C10.75 1.87827 10.4143 1.54248 10 1.54248C9.58583 1.54248 9.25004 1.87827 9.25004 2.29248V2.83613C6.08266 3.20733 3.62504 5.9004 3.62504 9.16748V14.4591H3.33337C2.91916 14.4591 2.58337 14.7949 2.58337 15.2091C2.58337 15.6234 2.91916 15.9591 3.33337 15.9591H4.37504H15.625H16.6667C17.0809 15.9591 17.4167 15.6234 17.4167 15.2091C17.4167 14.7949 17.0809 14.4591 16.6667 14.4591H16.375V9.16748C16.375 5.9004 13.9174 3.20733 10.75 2.83613V2.29248ZM14.875 14.4591V9.16748C14.875 6.47509 12.6924 4.29248 10 4.29248C7.30765 4.29248 5.12504 6.47509 5.12504 9.16748V14.4591H14.875ZM8.00004 17.7085C8.00004 18.1228 8.33583 18.4585 8.75004 18.4585H11.25C11.6643 18.4585 12 18.1228 12 17.7085C12 17.2943 11.6643 16.9585 11.25 16.9585H8.75004C8.33583 16.9585 8.00004 17.2943 8.00004 17.7085Z"
            fill="currentColor"
          />
        </svg>
      </button>
      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="absolute -right-[240px] mt-[17px] flex w-[350px] flex-col rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800 sm:w-[361px] lg:right-0"
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
          <h5 className="text-sm font-semibold text-gray-900 dark:text-white">
            Notifications
          </h5>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleDropdown}
              className="text-gray-400 transition dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
              title="Close"
            >
              <svg
                className="fill-current"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M6.21967 7.28131C5.92678 6.98841 5.92678 6.51354 6.21967 6.22065C6.51256 5.92775 6.98744 5.92775 7.28033 6.22065L11.999 10.9393L16.7176 6.22078C17.0105 5.92789 17.4854 5.92788 17.7782 6.22078C18.0711 6.51367 18.0711 6.98855 17.7782 7.28144L13.0597 12L17.7782 16.7186C18.0711 17.0115 18.0711 17.4863 17.7782 17.7792C17.4854 18.0721 17.0105 18.0721 16.7176 17.7792L11.999 13.0607L7.28033 17.7794C6.98744 18.0722 6.51256 18.0722 6.21967 17.7794C5.92678 17.4865 5.92678 17.0116 6.21967 16.7187L10.9384 12L6.21967 7.28131Z"
                  fill="currentColor"
                />
              </svg>
            </button>
          </div>
        </div>
        <div className="max-h-80 overflow-y-auto">
          <ul className="flex flex-col">
            {loading && notifications.length === 0 ? (
              <li className="px-4 py-3 text-center text-sm text-gray-500 dark:text-gray-400">
                Loading notifications...
              </li>
            ) : notifications.length === 0 ? (
              <li className="px-4 py-3 text-center text-sm text-gray-500 dark:text-gray-400">
                No notifications available
              </li>
            ) : (
              notifications.map((notification) => (
                <li key={notification.id}>
                  <DropdownItem
                    onItemClick={closeDropdown}
                    className="flex gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                  >
                    <div className="flex-shrink-0 w-2 h-2 mt-2 bg-gray-400 dark:bg-gray-500 rounded-full"></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900 dark:text-white line-clamp-2">
                        <span className="font-medium">{notification.user}</span> {notification.action}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {notification.time}
                        </span>
                        <span className="text-xs text-gray-400 dark:text-gray-500">•</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                          {notification.category}
                        </span>
                      </div>
                    </div>
                  </DropdownItem>
                </li>
              ))
            )}
          </ul>
        </div>
        {hasNextPage && (
          <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={loadMore}
              disabled={loading}
              className="w-full px-3 py-2 text-sm font-medium text-center text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Loading..." : "Load More"}
            </button>
          </div>
        )}
        {/* <Link
          to="/notifications"
          className="block px-4 py-2 mt-3 text-sm font-medium text-center text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
        >
          View All Notifications
        </Link> */}
      </Dropdown>
    </div>
  );
}