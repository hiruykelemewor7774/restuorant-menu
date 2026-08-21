
"use client";

import { useEffect, useState } from "react";

type Stats = {
  totalItems: number;
  lowStock: number;
  expiringSoon: number;
  expired: number;
  todayPurchasesTotal: number;
  issuedToKitchen: number;
  returned: number;
  todayWaste: number;
  pendingRequests: number;
};

type ActivityItem = {
  name: string;
  type: string;
  amount: string;
  date: string;
};

export default function StoreDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [activity, setActivity] = useState<ActivityItem[]>([]);

  useEffect(() => {
    fetch("/api/store/dashboard", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setStats(data.stats);
          setActivity(data.activity);
        }
      });
  }, []);

  if (!stats) return <p className="text-gray-500">Loading...</p>;

  const cards = [
    { label: "Inventory Items", value: stats.totalItems },
    { label: "Low Stock", value: stats.lowStock },
    { label: "Expiring Soon", value: stats.expiringSoon },
    { label: "Expired", value: stats.expired },
    {
      label: "Today's Purchases",
      value: `${stats.todayPurchasesTotal.toFixed(2)} ETB`,
    },
    { label: "Issued to Kitchen", value: stats.issuedToKitchen },
    { label: "Returned", value: stats.returned },
    { label: "Today's Waste", value: stats.todayWaste },
    { label: "Pending Requests", value: stats.pendingRequests },
  ];

  return (
    <div className="text-gray-800">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        {cards.map((c) => (
          <div
            key={c.label}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-5"
          >
            <p className="text-2xl font-bold text-amber-600">{c.value}</p>
            <p className="text-sm text-gray-500 mt-1">{c.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <h2 className="font-semibold text-gray-800 mb-4">
          🕐 Recent Activity
        </h2>
        <div className="space-y-2">
          {activity.length === 0 && (
            <p className="text-gray-400 text-sm">No activity yet</p>
          )}
          {activity.map((a, idx) => (
            <div
              key={idx}
              className="flex justify-between items-center border-b border-gray-50 pb-2 text-sm"
            >
              <span>
                {a.name} <span className="text-gray-400">({a.type})</span>
              </span>
              <span
                className={
                  a.amount.startsWith("+")
                    ? "text-green-600 font-medium"
                    : "text-red-500 font-medium"
                }
              >
                {a.amount}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}



// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";

// type StoreItem = {
//   id: string;
//   name: string;
//   unit: string;
//   quantity: number;
//   minThreshold: number;
//   notes: string | null;
// };

// export default function StoreDashboard() {
//   const router = useRouter();
//   const [items, setItems] = useState<StoreItem[]>([]);
//   const [loading, setLoading] = useState(true);

//   const [name, setName] = useState("");
//   const [unit, setUnit] = useState("");
//   const [quantity, setQuantity] = useState("");
//   const [minThreshold, setMinThreshold] = useState("");
//   const [editingId, setEditingId] = useState<string | null>(null);

//   async function loadItems() {
//     const res = await fetch("/api/store/items", { cache: "no-store" });
//     const data = await res.json();
//     if (data.success) setItems(data.items);
//     setLoading(false);
//   }

//   useEffect(() => {
//    // eslint-disable-next-line react-hooks/set-state-in-effect
//     loadItems();
//   }, []);

//   function resetForm() {
//     setName("");
//     setUnit("");
//     setQuantity("");
//     setMinThreshold("");
//     setEditingId(null);
//   }

//   async function handleSubmit(e: React.FormEvent) {
//     e.preventDefault();
//     if (!name.trim() || !unit.trim()) return;

//     const payload = {
//       name,
//       unit,
//       quantity: parseFloat(quantity) || 0,
//       minThreshold: parseFloat(minThreshold) || 0,
//     };

//     if (editingId) {
//       await fetch(`/api/store/items/${editingId}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });
//     } else {
//       await fetch("/api/store/items", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });
//     }

//     resetForm();
//     loadItems();
//   }

//   function startEdit(item: StoreItem) {
//     setEditingId(item.id);
//     setName(item.name);
//     setUnit(item.unit);
//     setQuantity(String(item.quantity));
//     setMinThreshold(String(item.minThreshold));
//   }

//   async function handleDelete(id: string) {
//     if (!confirm("ይህን ግብዓት ማጥፋት ትፈልጋለህ?")) return;
//     await fetch(`/api/store/items/${id}`, { method: "DELETE" });
//     loadItems();
//   }

//   async function quickAdjust(id: string, delta: number) {
//     const item = items.find((i) => i.id === id);
//     if (!item) return;
//     const newQty = Math.max(0, item.quantity + delta);
//     await fetch(`/api/store/items/${id}`, {
//       method: "PUT",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ quantity: newQty }),
//     });
//     loadItems();
//   }

//   async function handleLogout() {
//     await fetch("/api/store/logout", { method: "POST" });
//     router.replace("/store/login");
//     router.refresh();
//   }

//   return (
//     <div className="min-h-screen text-white p-6 pt-15">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold text-amber-400">🏪 የግምጃ ቤት አስተዳደር</h1>
//         <button
//           onClick={handleLogout}
//           className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-sm"
//         >
//           ውጣ
//         </button>
//       </div>

//       {/* Add/Edit Form */}
//       <form
//         onSubmit={handleSubmit}
//         className="bg-slate-900 border border-slate-800 rounded-xl p-4 mb-6 grid grid-cols-1 md:grid-cols-5 gap-3"
//       >
//         <input
//           placeholder="ስም"
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//           className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm"
//         />
//         <input
//           placeholder="መለኪያ (ኪሎ, ሊትር...)"
//           value={unit}
//           onChange={(e) => setUnit(e.target.value)}
//           className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm"
//         />
//         <input
//           type="number"
//           placeholder="ብዛት"
//           value={quantity}
//           onChange={(e) => setQuantity(e.target.value)}
//           className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm"
//         />
//         <input
//           type="number"
//           placeholder="ዝቅተኛ ገደብ"
//           value={minThreshold}
//           onChange={(e) => setMinThreshold(e.target.value)}
//           className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm"
//         />
//         <button
//           type="submit"
//           className="bg-amber-500 hover:bg-amber-600 text-black font-semibold rounded-lg text-sm"
//         >
//           {editingId ? "አዘምን" : "ጨምር"}
//         </button>
//       </form>

//       {/* Items Table */}
//       {loading ? (
//         <p className="text-gray-400">እየጫነ ነው...</p>
//       ) : (
//         <div className="overflow-x-auto">
//           <table className="w-full text-sm">
//             <thead>
//               <tr className="text-left text-gray-400 border-b border-slate-800">
//                 <th className="py-2">ስም</th>
//                 <th className="py-2">መለኪያ</th>
//                 <th className="py-2">ብዛት</th>
//                 <th className="py-2">ዝቅተኛ ገደብ</th>
//                 <th className="py-2">ሁኔታ</th>
//                 <th className="py-2">ተግባር</th>
//               </tr>
//             </thead>
//             <tbody>
//               {items.map((item) => {
//                 const low = item.quantity <= item.minThreshold;
//                 return (
//                   <tr
//                     key={item.id}
//                     className={`border-b border-slate-900 ${
//                       low ? "bg-red-950/30" : ""
//                     }`}
//                   >
//                     <td className="py-2 font-medium">{item.name}</td>
//                     <td className="py-2 text-gray-400">{item.unit}</td>
//                     <td className="py-2">
//                       <div className="flex items-center gap-2">
//                         <button
//                           onClick={() => quickAdjust(item.id, -1)}
//                           className="w-6 h-6 rounded-full bg-slate-800 hover:bg-slate-700"
//                         >
//                           −
//                         </button>
//                         <span className="w-12 text-center">
//                           {item.quantity}
//                         </span>
//                         <button
//                           onClick={() => quickAdjust(item.id, 1)}
//                           className="w-6 h-6 rounded-full bg-slate-800 hover:bg-slate-700"
//                         >
//                           +
//                         </button>
//                       </div>
//                     </td>
//                     <td className="py-2 text-gray-400">{item.minThreshold}</td>
//                     <td className="py-2">
//                       {low ? (
//                         <span className="text-red-400 text-xs font-semibold">
//                           ⚠️ አልቋል
//                         </span>
//                       ) : (
//                         <span className="text-green-400 text-xs">✓ በቂ</span>
//                       )}
//                     </td>
//                     <td className="py-2 flex gap-2">
//                       <button
//                         onClick={() => startEdit(item)}
//                         className="text-blue-400 hover:underline text-xs"
//                       >
//                         አስተካክል
//                       </button>
//                       <button
//                         onClick={() => handleDelete(item.id)}
//                         className="text-red-400 hover:underline text-xs"
//                       >
//                         አጥፋ
//                       </button>
//                     </td>
//                   </tr>
//                 );
//               })}
//               {items.length === 0 && (
//                 <tr>
//                   <td colSpan={6} className="text-center py-6 text-gray-500">
//                     ምንም ግብዓት አልተመዘገበም
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// }