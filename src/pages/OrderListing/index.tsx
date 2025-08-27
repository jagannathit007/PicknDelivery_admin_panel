// import { useState } from "react";

// // Define interfaces
// interface Order {
//   id: string;
//   customerName: string;
//   rider: {
//     status: "non-assigned" | "assigned";
//     name?: string;
//     phone?: string;
//     avatar?: string;
//   };
//   orderType: "now" | "scheduled";
//   scheduledDateTime?: string;
//   orderStatus: "running" | "pending" | "complete" | "cancelled";
//   orderDetails: {
//     items: string[];
//     total: number;
//     address: string;
//   };
//   createdAt: string;
// }

// // Sample data
// const sampleOrders: Order[] = [
//   {
//     id: "ORD-2025-001",
//     customerName: "John Smith",
//     rider: {
//       status: "assigned",
//       name: "Mike Johnson",
//       phone: "+1 234-567-8901",
//       avatar: "/api/placeholder/32/32",
//     },
//     orderType: "now",
//     orderStatus: "running",
//     orderDetails: {
//       items: ["Pizza Margherita", "Coca Cola 500ml"],
//       total: 24.99,
//       address: "123 Main St, Downtown",
//     },
//     createdAt: "2025-08-23T14:30:00Z",
//   },
//   {
//     id: "ORD-2025-002",
//     customerName: "Sarah Wilson",
//     rider: { status: "non-assigned" },
//     orderType: "scheduled",
//     scheduledDateTime: "2025-08-24T18:00:00Z",
//     orderStatus: "pending",
//     orderDetails: {
//       items: ["Burger Combo", "French Fries", "Milkshake"],
//       total: 18.5,
//       address: "456 Oak Avenue, Suburb",
//     },
//     createdAt: "2025-08-23T13:15:00Z",
//   },
//   {
//     id: "ORD-2025-003",
//     customerName: "David Brown",
//     rider: {
//       status: "assigned",
//       name: "Alex Chen",
//       phone: "+1 234-567-8902",
//       avatar: "/api/placeholder/32/32",
//     },
//     orderType: "now",
//     orderStatus: "complete",
//     orderDetails: {
//       items: ["Sushi Platter", "Miso Soup"],
//       total: 32.75,
//       address: "789 Pine Street, City Center",
//     },
//     createdAt: "2025-08-23T12:45:00Z",
//   },
//   {
//     id: "ORD-2025-004",
//     customerName: "Emma Davis",
//     rider: {
//       status: "assigned",
//       name: "Lisa Rodriguez",
//       phone: "+1 234-567-8903",
//       avatar: "/api/placeholder/32/32",
//     },
//     orderType: "scheduled",
//     scheduledDateTime: "2025-08-24T19:30:00Z",
//     orderStatus: "cancelled",
//     orderDetails: {
//       items: ["Pasta Carbonara", "Garlic Bread"],
//       total: 16.25,
//       address: "321 Elm Road, Uptown",
//     },
//     createdAt: "2025-08-23T11:20:00Z",
//   },
//   {
//     id: "ORD-2025-005",
//     customerName: "Michael Chen",
//     rider: { status: "non-assigned" },
//     orderType: "now",
//     orderStatus: "pending",
//     orderDetails: {
//       items: ["Chicken Biryani", "Raita", "Naan"],
//       total: 22.5,
//       address: "555 Broadway, Central District",
//     },
//     createdAt: "2025-08-23T15:45:00Z",
//   },
// ];

// export default function OrderListingUI() {
//   const [orders, setOrders] = useState<Order[]>(sampleOrders);
//   const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
//   const [filterStatus, setFilterStatus] = useState<string>("all");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [showScheduleModal, setShowScheduleModal] = useState(false);
//   const [scheduleOrderId, setScheduleOrderId] = useState<string>("");

//   // Helper functions
//   const formatDateTime = (dateString: string) => {
//     return new Date(dateString).toLocaleString("en-US", {
//       month: "short",
//       day: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     });
//   };

//   const getStatusConfig = (status: string) => {
//     switch (status) {
//       case "running":
//         return {
//           bg: "bg-blue-100",
//           text: "text-blue-800",
//           border: "border-blue-200",
//           dot: "bg-blue-500",
//         };
//       case "pending":
//         return {
//           bg: "bg-amber-100",
//           text: "text-amber-800",
//           border: "border-amber-200",
//           dot: "bg-amber-500",
//         };
//       case "complete":
//         return {
//           bg: "bg-emerald-100",
//           text: "text-emerald-800",
//           border: "border-emerald-200",
//           dot: "bg-emerald-500",
//         };
//       case "cancelled":
//         return {
//           bg: "bg-red-100",
//           text: "text-red-800",
//           border: "border-red-200",
//           dot: "bg-red-500",
//         };
//       default:
//         return {
//           bg: "bg-slate-100",
//           text: "text-slate-800",
//           border: "border-slate-200",
//           dot: "bg-slate-500",
//         };
//     }
//   };

//   const getRiderStatusConfig = (status: string) => {
//     return status === "assigned"
//       ? {
//           bg: "bg-emerald-100",
//           text: "text-emerald-800",
//           border: "border-emerald-200",
//         }
//       : {
//           bg: "bg-orange-100",
//           text: "text-orange-800",
//           border: "border-orange-200",
//         };
//   };

//   // Filter orders
//   const filteredOrders = orders.filter((order) => {
//     const matchesSearch =
//       order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       order.id.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesStatus =
//       filterStatus === "all" || order.orderStatus === filterStatus;
//     return matchesSearch && matchesStatus;
//   });

//   const handleScheduleOrder = (orderId: string, scheduledDateTime: string) => {
//     setOrders((prev) =>
//       prev.map((order) =>
//         order.id === orderId
//           ? { ...order, orderType: "scheduled", scheduledDateTime }
//           : order
//       )
//     );
//     setShowScheduleModal(false);
//     setScheduleOrderId("");
//   };

//   return (
//     <div className="space-y-6">
//       {/* Professional Header */}
//       <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 rounded-2xl shadow-xl overflow-hidden">
//         <div className="relative p-8">
//           <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-transparent"></div>
//           <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
//             <div className="flex items-center gap-6">
//               <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/20">
//                 <svg
//                   className="w-8 h-8 text-white"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth="2"
//                     d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
//                   />
//                 </svg>
//               </div>
//               <div className="text-white">
//                 <h1 className="text-3xl font-bold mb-2">
//                   Order Management Dashboard
//                 </h1>
//                 <p className="text-blue-100 text-lg">
//                   Monitor, track and manage all customer orders
//                 </p>
//               </div>
//             </div>

//             <div className="flex items-center gap-6 text-white">
//               <div className="text-center">
//                 <div className="text-3xl font-bold">{orders.length}</div>
//                 <div className="text-blue-200 text-sm">Total Orders</div>
//               </div>
//               <div className="w-px h-12 bg-white/30"></div>
//               <div className="text-center">
//                 <div className="text-3xl font-bold">
//                   {orders.filter((o) => o.orderStatus === "running").length}
//                 </div>
//                 <div className="text-blue-200 text-sm">Active Now</div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Enhanced Search and Controls */}
//       <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
//         <div className="flex flex-col lg:flex-row lg:items-center gap-4">
//           <div className="flex-1">
//             <div className="relative">
//               <input
//                 type="text"
//                 placeholder="🔍 Search by Order ID, Customer Name, or Phone..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:bg-white transition-all text-sm font-medium"
//               />
//               <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
//                 <svg
//                   className="w-5 h-5 text-slate-400"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth="2"
//                     d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
//                   />
//                 </svg>
//               </div>
//             </div>
//           </div>

//           <div className="flex flex-col sm:flex-row gap-3">
//             <select
//               value={filterStatus}
//               onChange={(e) => setFilterStatus(e.target.value)}
//               className="px-4 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:bg-white transition-all text-sm font-medium"
//             >
//               <option value="all">📋 All Status</option>
//               <option value="pending">⏳ Pending Orders</option>
//               <option value="running">🚀 Running Orders</option>
//               <option value="complete">✅ Completed</option>
//               <option value="cancelled">❌ Cancelled</option>
//             </select>

//             <button className="px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg shadow-blue-200 font-semibold">
//               <div className="flex items-center gap-2">
//                 <svg
//                   className="w-4 h-4"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth="2"
//                     d="M12 6v6m0 0v6m0-6h6m-6 0H6"
//                   />
//                 </svg>
//                 Add Order
//               </div>
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Professional Data Table */}
//       <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead className="bg-gradient-to-r from-slate-50 to-slate-100 border-b-2 border-slate-200">
//               <tr>
//                 <th className="px-6 py-5 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
//                   <div className="flex items-center gap-2">
//                     <svg
//                       className="w-4 h-4"
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth="2"
//                         d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a1.994 1.994 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
//                       />
//                     </svg>
//                     Order ID
//                   </div>
//                 </th>
//                 <th className="px-6 py-5 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
//                   <div className="flex items-center gap-2">
//                     <svg
//                       className="w-4 h-4"
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth="2"
//                         d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
//                       />
//                     </svg>
//                     Customer
//                   </div>
//                 </th>
//                 <th className="px-6 py-5 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
//                   <div className="flex items-center gap-2">
//                     <svg
//                       className="w-4 h-4"
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth="2"
//                         d="M12 14l9-5-9-5-9 5 9 5z"
//                       />
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth="2"
//                         d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
//                       />
//                     </svg>
//                     Rider
//                   </div>
//                 </th>
//                 <th className="px-6 py-5 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
//                   <div className="flex items-center gap-2">
//                     <svg
//                       className="w-4 h-4"
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth="2"
//                         d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
//                       />
//                     </svg>
//                     Order Type
//                   </div>
//                 </th>
//                 <th className="px-6 py-5 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
//                   <div className="flex items-center gap-2">
//                     <svg
//                       className="w-4 h-4"
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth="2"
//                         d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
//                       />
//                     </svg>
//                     Status
//                   </div>
//                 </th>
//                 <th className="px-6 py-5 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
//                   <div className="flex items-center gap-2">
//                     <svg
//                       className="w-4 h-4"
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth="2"
//                         d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
//                       />
//                     </svg>
//                     Actions
//                   </div>
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-slate-200">
//               {filteredOrders.map((order, index) => {
//                 const statusConfig = getStatusConfig(order.orderStatus);
//                 const riderConfig = getRiderStatusConfig(order.rider.status);

//                 return (
//                   <tr
//                     key={order.id}
//                     className="hover:bg-blue-50/50 transition-all duration-200 group"
//                   >
//                     {/* Order ID */}
//                     <td className="px-6 py-5">
//                       <div className="space-y-1">
//                         <div className="font-bold text-slate-800 text-sm">
//                           {order.id}
//                         </div>
//                         <div className="text-xs text-slate-500 flex items-center gap-1">
//                           <svg
//                             className="w-3 h-3"
//                             fill="none"
//                             stroke="currentColor"
//                             viewBox="0 0 24 24"
//                           >
//                             <path
//                               strokeLinecap="round"
//                               strokeLinejoin="round"
//                               strokeWidth="2"
//                               d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
//                             />
//                           </svg>
//                           {formatDateTime(order.createdAt)}
//                         </div>
//                       </div>
//                     </td>

//                     {/* Customer */}
//                     <td className="px-6 py-5">
//                       <div className="flex items-center gap-3">
//                         <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center shadow-sm">
//                           <span className="text-sm font-bold text-blue-700">
//                             {order.customerName
//                               .split(" ")
//                               .map((n) => n[0])
//                               .join("")}
//                           </span>
//                         </div>
//                         <div>
//                           <div className="font-semibold text-slate-800 text-sm">
//                             {order.customerName}
//                           </div>
//                           <div className="text-xs text-green-600 font-bold">
//                             ${order.orderDetails.total}
//                           </div>
//                           <div className="text-xs text-slate-500 max-w-32 truncate">
//                             {order.orderDetails.address}
//                           </div>
//                         </div>
//                       </div>
//                     </td>

//                     {/* Rider */}
//                     <td className="px-6 py-5">
//                       <div className="space-y-2">
//                         <span
//                           className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold border ${riderConfig.bg} ${riderConfig.text} ${riderConfig.border}`}
//                         >
//                           {order.rider.status === "assigned" ? "✅" : "⚠️"}{" "}
//                           {order.rider.status === "assigned"
//                             ? "Assigned"
//                             : "Unassigned"}
//                         </span>

//                         {order.rider.status === "assigned" &&
//                         order.rider.name ? (
//                           <div className="bg-emerald-50 p-2 rounded-lg border border-emerald-200">
//                             <div className="flex items-center gap-2">
//                               <div className="w-6 h-6 bg-emerald-200 rounded-full flex items-center justify-center">
//                                 <span className="text-xs font-bold text-emerald-700">
//                                   {order.rider.name
//                                     .split(" ")
//                                     .map((n) => n[0])
//                                     .join("")}
//                                 </span>
//                               </div>
//                               <div>
//                                 <div className="text-xs font-semibold text-emerald-800">
//                                   {order.rider.name}
//                                 </div>
//                                 <div className="text-xs text-emerald-600">
//                                   {order.rider.phone}
//                                 </div>
//                               </div>
//                             </div>
//                           </div>
//                         ) : (
//                           <button className="w-full px-2 py-1.5 text-xs text-orange-600 hover:text-orange-700 hover:bg-orange-50 rounded-lg transition-all border border-orange-200 font-medium">
//                             🚴 Assign Rider
//                           </button>
//                         )}
//                       </div>
//                     </td>

//                     {/* Order Type */}
//                     <td className="px-6 py-5">
//                       <div className="space-y-2">
//                         <span
//                           className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold border shadow-sm ${
//                             order.orderType === "now"
//                               ? "bg-blue-100 text-blue-800 border-blue-200"
//                               : "bg-purple-100 text-purple-800 border-purple-200"
//                           }`}
//                         >
//                           {order.orderType === "now" ? "⚡" : "📅"}{" "}
//                           {order.orderType === "now"
//                             ? "Immediate"
//                             : "Scheduled"}
//                         </span>

//                         {order.orderType === "scheduled" &&
//                         order.scheduledDateTime ? (
//                           <div className="bg-purple-50 p-2 rounded-lg border border-purple-200">
//                             <div className="text-xs text-purple-600 font-medium">
//                               Delivery Time:
//                             </div>
//                             <div className="text-sm font-bold text-purple-800">
//                               {formatDateTime(order.scheduledDateTime)}
//                             </div>
//                           </div>
//                         ) : order.orderType === "now" ? (
//                           <button
//                             onClick={() => {
//                               setScheduleOrderId(order.id);
//                               setShowScheduleModal(true);
//                             }}
//                             className="w-full px-2 py-1.5 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all border border-blue-200 font-medium"
//                           >
//                             📅 Schedule
//                           </button>
//                         ) : null}
//                       </div>
//                     </td>

//                     {/* Order Status */}
//                     <td className="px-6 py-5">
//                       <span
//                         className={`inline-flex items-center px-4 py-2 rounded-xl text-sm font-bold border shadow-sm ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}
//                       >
//                         {order.orderStatus === "running"}
//                         {order.orderStatus === "pending"}
//                         {order.orderStatus === "complete"}
//                         {order.orderStatus === "cancelled"}
//                         <span className="ml-1">
//                           {order.orderStatus.charAt(0).toUpperCase() +
//                             order.orderStatus.slice(1)}
//                         </span>
//                       </span>
//                     </td>

//                     {/* Actions */}
//                     <td className="px-6 py-5">
//                       <div className="flex items-center gap-2">
//                         <button
//                           onClick={() => setSelectedOrder(order)}
//                           className="p-2.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all border border-transparent hover:border-blue-200 shadow-sm"
//                           title="View Order Details"
//                         >
//                           <svg
//                             className="w-4 h-4"
//                             fill="none"
//                             stroke="currentColor"
//                             viewBox="0 0 24 24"
//                           >
//                             <path
//                               strokeLinecap="round"
//                               strokeLinejoin="round"
//                               strokeWidth="2"
//                               d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
//                             />
//                             <path
//                               strokeLinecap="round"
//                               strokeLinejoin="round"
//                               strokeWidth="2"
//                               d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
//                             />
//                           </svg>
//                         </button>

//                         <button
//                           className="p-2.5 text-slate-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all border border-transparent hover:border-green-200 shadow-sm"
//                           title="Edit Order"
//                         >
//                           <svg
//                             className="w-4 h-4"
//                             fill="none"
//                             stroke="currentColor"
//                             viewBox="0 0 24 24"
//                           >
//                             <path
//                               strokeLinecap="round"
//                               strokeLinejoin="round"
//                               strokeWidth="2"
//                               d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
//                             />
//                           </svg>
//                         </button>

//                         <button
//                           className="p-2.5 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-all border border-transparent hover:border-slate-200 shadow-sm"
//                           title="More Options"
//                         >
//                           <svg
//                             className="w-4 h-4"
//                             fill="none"
//                             stroke="currentColor"
//                             viewBox="0 0 24 24"
//                           >
//                             <path
//                               strokeLinecap="round"
//                               strokeLinejoin="round"
//                               strokeWidth="2"
//                               d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
//                             />
//                           </svg>
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//         </div>

//         {/* Professional Pagination */}
//         <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100">
//           <div className="flex items-center gap-2 text-sm text-slate-600">
//             <svg
//               className="w-4 h-4"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth="2"
//                 d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
//               />
//             </svg>
//             Showing{" "}
//             <span className="font-semibold">{filteredOrders.length}</span> of{" "}
//             <span className="font-semibold">{orders.length}</span> orders
//           </div>

//           <div className="flex items-center gap-1">
//             <button className="px-3 py-2 text-slate-500 hover:text-slate-700 hover:bg-white rounded-lg transition-all shadow-sm">
//               <svg
//                 className="w-4 h-4"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="2"
//                   d="M15 19l-7-7 7-7"
//                 />
//               </svg>
//             </button>
//             <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold shadow-lg">
//               1
//             </button>
//             <button className="px-4 py-2 text-slate-500 hover:text-slate-700 hover:bg-white rounded-lg transition-all">
//               2
//             </button>
//             <button className="px-4 py-2 text-slate-500 hover:text-slate-700 hover:bg-white rounded-lg transition-all">
//               3
//             </button>
//             <button className="px-3 py-2 text-slate-500 hover:text-slate-700 hover:bg-white rounded-lg transition-all shadow-sm">
//               <svg
//                 className="w-4 h-4"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="2"
//                   d="M9 5l7 7-7 7"
//                 />
//               </svg>
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Quick Stats Cards */}
//       <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
//         <div className="bg-gradient-to-br from-amber-50 to-yellow-100 p-6 rounded-2xl border border-amber-200 shadow-sm hover:shadow-md transition-all">
//           <div className="flex items-center justify-between mb-3">
//             <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center text-xl">
//               ⏳
//             </div>
//             <div className="text-3xl font-bold text-amber-700">
//               {orders.filter((o) => o.orderStatus === "pending").length}
//             </div>
//           </div>
//           <div className="text-sm font-semibold text-amber-800">
//             Pending Orders
//           </div>
//         </div>

//         <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-6 rounded-2xl border border-blue-200 shadow-sm hover:shadow-md transition-all">
//           <div className="flex items-center justify-between mb-3">
//             <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-xl">
//               🚀
//             </div>
//             <div className="text-3xl font-bold text-blue-700">
//               {orders.filter((o) => o.orderStatus === "running").length}
//             </div>
//           </div>
//           <div className="text-sm font-semibold text-blue-800">
//             Active Orders
//           </div>
//         </div>

//         <div className="bg-gradient-to-br from-emerald-50 to-green-100 p-6 rounded-2xl border border-emerald-200 shadow-sm hover:shadow-md transition-all">
//           <div className="flex items-center justify-between mb-3">
//             <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-xl">
//               ✅
//             </div>
//             <div className="text-3xl font-bold text-emerald-700">
//               {orders.filter((o) => o.orderStatus === "complete").length}
//             </div>
//           </div>
//           <div className="text-sm font-semibold text-emerald-800">
//             Completed
//           </div>
//         </div>

//         <div className="bg-gradient-to-br from-red-50 to-rose-100 p-6 rounded-2xl border border-red-200 shadow-sm hover:shadow-md transition-all">
//           <div className="flex items-center justify-between mb-3">
//             <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center text-xl">
//               ❌
//             </div>
//             <div className="text-3xl font-bold text-red-700">
//               {orders.filter((o) => o.orderStatus === "cancelled").length}
//             </div>
//           </div>
//           <div className="text-sm font-semibold text-red-800">Cancelled</div>
//         </div>
//       </div>

//       {/* Schedule Order Modal */}
//       {showScheduleModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//           <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
//             <div className="p-6 border-b border-slate-200">
//               <div className="flex items-center justify-between">
//                 <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
//                   📅 Schedule Order
//                 </h2>
//                 <button
//                   onClick={() => setShowScheduleModal(false)}
//                   className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-all"
//                 >
//                   <svg
//                     className="w-5 h-5"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth="2"
//                       d="M6 18L18 6M6 6l12 12"
//                     />
//                   </svg>
//                 </button>
//               </div>
//             </div>

//             <div className="p-6 space-y-4">
//               <div>
//                 <label className="block text-sm font-semibold text-slate-700 mb-3">
//                   📋 Order ID:{" "}
//                   <span className="text-blue-600">{scheduleOrderId}</span>
//                 </label>
//                 <label className="block text-sm font-semibold text-slate-700 mb-2">
//                   🕐 Select Delivery Date & Time
//                 </label>
//                 <input
//                   type="datetime-local"
//                   className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
//                   min={new Date().toISOString().slice(0, 16)}
//                   onChange={(e) => {
//                     if (e.target.value) {
//                       handleScheduleOrder(
//                         scheduleOrderId,
//                         new Date(e.target.value).toISOString()
//                       );
//                     }
//                   }}
//                 />
//                 <p className="text-xs text-slate-500 mt-2">
//                   ⚠️ Minimum 1 hour from now
//                 </p>
//               </div>

//               <div className="flex gap-3 pt-4">
//                 <button
//                   onClick={() => setShowScheduleModal(false)}
//                   className="flex-1 px-4 py-3 border-2 border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-all font-medium"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={() => setShowScheduleModal(false)}
//                   className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg font-semibold"
//                 >
//                   ✅ Schedule Order
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Enhanced Order Details Modal */}
//       {selectedOrder && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//           <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
//             {/* Modal Header */}
//             <div className="relative bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white">
//               <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-transparent"></div>
//               <div className="relative flex items-center justify-between">
//                 <div className="flex items-center gap-4">
//                   <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
//                     <svg
//                       className="w-7 h-7"
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth="2"
//                         d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
//                       />
//                     </svg>
//                   </div>
//                   <div>
//                     <h2 className="text-2xl font-bold">📋 Order Details</h2>
//                     <p className="text-blue-100 text-lg">{selectedOrder.id}</p>
//                   </div>
//                 </div>
//                 <button
//                   onClick={() => setSelectedOrder(null)}
//                   className="p-3 text-white/80 hover:text-white hover:bg-white/20 rounded-xl transition-all"
//                 >
//                   <svg
//                     className="w-6 h-6"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth="2"
//                       d="M6 18L18 6M6 6l12 12"
//                     />
//                   </svg>
//                 </button>
//               </div>
//             </div>

//             <div className="p-8 space-y-8">
//               {/* Customer & Order Info */}
//               <div className="grid md:grid-cols-2 gap-8">
//                 <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
//                   <h3 className="flex items-center gap-2 font-bold text-slate-800 mb-6 text-lg">
//                     <svg
//                       className="w-5 h-5 text-blue-600"
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth="2"
//                         d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
//                       />
//                     </svg>
//                     👤 Customer Information
//                   </h3>
//                   <div className="space-y-4">
//                     <div className="flex items-center justify-between p-3 bg-white rounded-xl">
//                       <span className="text-slate-500 text-sm font-medium">
//                         Customer Name:
//                       </span>
//                       <span className="font-bold text-slate-800">
//                         {selectedOrder.customerName}
//                       </span>
//                     </div>
//                     <div className="flex items-center justify-between p-3 bg-white rounded-xl">
//                       <span className="text-slate-500 text-sm font-medium">
//                         Order Total:
//                       </span>
//                       <span className="font-bold text-green-600 text-lg">
//                         ${selectedOrder.orderDetails.total}
//                       </span>
//                     </div>
//                     <div className="p-3 bg-white rounded-xl">
//                       <span className="text-slate-500 text-sm font-medium block mb-2">
//                         📍 Delivery Address:
//                       </span>
//                       <span className="font-semibold text-slate-800">
//                         {selectedOrder.orderDetails.address}
//                       </span>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
//                   <h3 className="flex items-center gap-2 font-bold text-slate-800 mb-6 text-lg">
//                     <svg
//                       className="w-5 h-5 text-blue-600"
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth="2"
//                         d="M12 14l9-5-9-5-9 5 9 5z"
//                       />
//                     </svg>
//                     🚴 Rider Information
//                   </h3>
//                   <div className="space-y-4">
//                     <div className="flex items-center justify-between p-3 bg-white rounded-xl">
//                       <span className="text-slate-500 text-sm font-medium">
//                         Status:
//                       </span>
//                       <span
//                         className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${
//                           getRiderStatusConfig(selectedOrder.rider.status).bg
//                         } ${
//                           getRiderStatusConfig(selectedOrder.rider.status).text
//                         } ${
//                           getRiderStatusConfig(selectedOrder.rider.status)
//                             .border
//                         }`}
//                       >
//                         {selectedOrder.rider.status === "assigned"
//                           ? "✅ Assigned"
//                           : "⚠️ Unassigned"}
//                       </span>
//                     </div>
//                     {selectedOrder.rider.status === "assigned" ? (
//                       <>
//                         <div className="flex items-center justify-between p-3 bg-white rounded-xl">
//                           <span className="text-slate-500 text-sm font-medium">
//                             Rider Name:
//                           </span>
//                           <span className="font-bold text-slate-800">
//                             {selectedOrder.rider.name}
//                           </span>
//                         </div>
//                         <div className="flex items-center justify-between p-3 bg-white rounded-xl">
//                           <span className="text-slate-500 text-sm font-medium">
//                             📞 Contact:
//                           </span>
//                           <span className="font-semibold text-slate-800">
//                             {selectedOrder.rider.phone}
//                           </span>
//                         </div>
//                       </>
//                     ) : (
//                       <div className="p-4 bg-orange-50 border border-orange-200 rounded-xl text-center">
//                         <p className="text-orange-700 font-medium mb-3">
//                           ⚠️ No rider assigned
//                         </p>
//                         <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-all font-semibold">
//                           🚴 Assign Rider Now
//                         </button>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </div>

//               {/* Order Items */}
//               <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
//                 <h3 className="flex items-center gap-2 font-bold text-slate-800 mb-6 text-lg">
//                   <svg
//                     className="w-5 h-5 text-blue-600"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth="2"
//                       d="M16 11V7a4 4 0 00-8 0v4M8 11v6h8v-6M8 11h8"
//                     />
//                   </svg>
//                   🛍️ Order Items ({selectedOrder.orderDetails.items.length})
//                 </h3>
//                 <div className="grid gap-3">
//                   {selectedOrder.orderDetails.items.map((item, index) => (
//                     <div
//                       key={index}
//                       className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all"
//                     >
//                       <div className="flex items-center gap-3">
//                         <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
//                           <span className="text-sm font-bold text-blue-600">
//                             {index + 1}
//                           </span>
//                         </div>
//                         <span className="font-semibold text-slate-700">
//                           {item}
//                         </span>
//                       </div>
//                       <div className="text-lg">🍽️</div>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               {/* Action Buttons */}
//               <div className="flex flex-col sm:flex-row gap-4 pt-4">
//                 <button
//                   onClick={() => setSelectedOrder(null)}
//                   className="flex-1 px-6 py-4 border-2 border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-all font-semibold"
//                 >
//                   ❌ Close
//                 </button>
//                 <button className="flex-1 px-6 py-4 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all shadow-lg font-semibold">
//                   🖨️ Print Receipt
//                 </button>
//                 <button className="flex-1 px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg font-semibold">
//                   ✏️ Edit Order
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// ==============================================================================================

// ==============================================================================================

import { useState } from "react";
import OrderList from "./OrderList";
import OrderDetails from "./OrderDetails";

// Define interfaces
interface Order {
  id: string;
  customerName: string;
  rider: {
    status: "non-assigned" | "assigned";
    name?: string;
    phone?: string;
    avatar?: string;
  };
  orderType: "now" | "scheduled";
  scheduledDateTime?: string;
  orderStatus: "running" | "pending" | "complete" | "cancelled";
  orderDetails: {
    items: string[];
    total: number;
    address: string;
  };
  createdAt: string;
}

// Sample data
const sampleOrders: Order[] = [
  {
    id: "ORD-2025-001",
    customerName: "John Smith",
    rider: {
      status: "assigned",
      name: "Mike Johnson",
      phone: "+1 234-567-8901",
      avatar: "/api/placeholder/32/32",
    },
    orderType: "now",
    orderStatus: "running",
    orderDetails: {
      items: ["Pizza Margherita", "Coca Cola 500ml"],
      total: 24.99,
      address: "123 Main St, Downtown",
    },
    createdAt: "2025-08-23T14:30:00Z",
  },
  {
    id: "ORD-2025-002",
    customerName: "Sarah Wilson",
    rider: { status: "non-assigned" },
    orderType: "scheduled",
    scheduledDateTime: "2025-08-24T18:00:00Z",
    orderStatus: "pending",
    orderDetails: {
      items: ["Burger Combo", "French Fries", "Milkshake"],
      total: 18.5,
      address: "456 Oak Avenue, Suburb",
    },
    createdAt: "2025-08-23T13:15:00Z",
  },
  {
    id: "ORD-2025-003",
    customerName: "David Brown",
    rider: {
      status: "assigned",
      name: "Alex Chen",
      phone: "+1 234-567-8902",
      avatar: "/api/placeholder/32/32",
    },
    orderType: "now",
    orderStatus: "complete",
    orderDetails: {
      items: ["Sushi Platter", "Miso Soup"],
      total: 32.75,
      address: "789 Pine Street, City Center",
    },
    createdAt: "2025-08-23T12:45:00Z",
  },
  {
    id: "ORD-2025-004",
    customerName: "Emma Davis",
    rider: {
      status: "assigned",
      name: "Lisa Rodriguez",
      phone: "+1 234-567-8903",
      avatar: "/api/placeholder/32/32",
    },
    orderType: "scheduled",
    scheduledDateTime: "2025-08-24T19:30:00Z",
    orderStatus: "cancelled",
    orderDetails: {
      items: ["Pasta Carbonara", "Garlic Bread"],
      total: 16.25,
      address: "321 Elm Road, Uptown",
    },
    createdAt: "2025-08-23T11:20:00Z",
  },
  {
    id: "ORD-2025-005",
    customerName: "Michael Chen",
    rider: { status: "non-assigned" },
    orderType: "now",
    orderStatus: "pending",
    orderDetails: {
      items: ["Chicken Biryani", "Raita", "Naan"],
      total: 22.5,
      address: "555 Broadway, Central District",
    },
    createdAt: "2025-08-23T15:45:00Z",
  },
  {
    id: "ORD-2025-006",
    customerName: "Lisa Wang",
    rider: {
      status: "assigned",
      name: "Tom Wilson",
      phone: "+1 234-567-8904",
      avatar: "/api/placeholder/32/32",
    },
    orderType: "scheduled",
    scheduledDateTime: "2025-08-25T12:30:00Z",
    orderStatus: "pending",
    orderDetails: {
      items: ["Caesar Salad", "Grilled Chicken", "Iced Tea"],
      total: 19.75,
      address: "888 Oak Street, Business District",
    },
    createdAt: "2025-08-23T10:15:00Z",
  },
];

export default function OrderListingUI() {
  const [orders, setOrders] = useState<Order[]>(sampleOrders);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Helper function
  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get selected order
  const selectedOrder = selectedOrderId
    ? orders.find((order) => order.id === selectedOrderId)
    : null;

  return (
    <div className="space-y-6">
      {/* Header with Title and Search Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Order Listing Title */}
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-blue-800 rounded-2xl flex items-center justify-center">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          </div>
          <div className="text-blue-800">
            <h1 className="text-3xl font-bold">Order Listing</h1>
          </div>
        </div>

        {/* Enhanced Search and Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="🔍 Search by Order ID, Customer Name, or Phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:bg-white transition-all text-sm font-medium"
              />
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                <svg
                  className="w-5 h-5 text-slate-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:bg-white transition-all text-sm font-medium"
            >
              <option value="all">📋 All Status</option>
              <option value="pending"> Pending Orders</option>
              <option value="running"> Running Orders</option>
              <option value="complete"> Completed</option>
              <option value="cancelled"> Cancelled</option>
            </select>

            <button className="px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg shadow-blue-200 font-semibold">
              <div className="flex items-center gap-2">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                Add Order
              </div>
            </button>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Orders Table */}
        <div className="lg:col-span-2">
          <OrderList
            orders={orders}
            filterStatus={filterStatus}
            searchTerm={searchTerm}
            selectedOrderId={selectedOrderId}
            setSelectedOrderId={setSelectedOrderId}
            formatDateTime={formatDateTime}
          />
        </div>

        {/* Order Details Panel */}
        <div className="lg:col-span-1">
          <OrderDetails
            selectedOrder={selectedOrder}
            formatDateTime={formatDateTime}
          />
        </div>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-amber-50 to-yellow-100 p-6 rounded-2xl border border-amber-200 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center text-xl">
              ⏳
            </div>
            <div className="text-3xl font-bold text-amber-700">
              {orders.filter((o) => o.orderStatus === "pending").length}
            </div>
          </div>
          <div className="text-sm font-semibold text-amber-800">
            Pending Orders
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-6 rounded-2xl border border-emerald-200 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-xl">
              🚀
            </div>
            <div className="text-3xl font-bold text-blue-700">
              {orders.filter((o) => o.orderStatus === "running").length}
            </div>
          </div>
          <div className="text-sm font-semibold text-blue-800">
            Active Orders
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-50 to-green-100 p-6 rounded-2xl border border-emerald-200 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-xl">
              ✅
            </div>
            <div className="text-3xl font-bold text-emerald-700">
              {orders.filter((o) => o.orderStatus === "complete").length}
            </div>
          </div>
          <div className="text-sm font-semibold text-emerald-800">
            Completed
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-rose-100 p-6 rounded-2xl border border-red-200 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center text-xl">
              ❌
            </div>
            <div className="text-3xl font-bold text-red-700">
              {orders.filter((o) => o.orderStatus === "cancelled").length}
            </div>
          </div>
          <div className="text-sm font-semibold text-red-800">Cancelled</div>
        </div>
      </div>
    </div>
  );
}
