"use client";

import { useEffect, useState } from "react";

type StaffMember = {
  id: string;
  username: string;
  fullName: string | null;
  isActive: boolean;
  createdAt: string;
};

type StaffType = "waiter" | "kitchen";

export default function ManageStaffPage() {
  const [staffType, setStaffType] = useState<StaffType>("waiter");
  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");

  const [resetTarget, setResetTarget] = useState<string | null>(null);
  const [resetPassword, setResetPassword] = useState("");

  const apiBase = staffType === "waiter" ? "/api/admin/staff" : "/api/admin/kitchen-staff";
  const listKey = staffType === "waiter" ? "waiters" : "kitchenStaff";

  async function loadStaff() {
    setLoading(true);
    const res = await fetch(apiBase, { cache: "no-store" });
    const data = await res.json();
    if (data.success) setStaffList(data[listKey]);
    setLoading(false);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadStaff();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [staffType]);

  function switchTab(type: StaffType) {
    setStaffType(type);
    setMessage("");
    setUsername("");
    setPassword("");
    setFullName("");
    setResetTarget(null);
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");

    const res = await fetch(apiBase, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password, fullName }),
    });
    const data = await res.json();

    if (!data.success) {
      setMessage(data.message || "ስህተት ተፈጥሯል");
      return;
    }

    setMessage(`✅ አዲስ ${staffType === "waiter" ? "waiter" : "kitchen staff"} ተፈጥሯል`);
    setUsername("");
    setPassword("");
    setFullName("");
    loadStaff();
  }

  async function toggleActive(member: StaffMember) {
    await fetch(`${apiBase}/${member.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !member.isActive }),
    });
    loadStaff();
  }

  async function handleDelete(id: string) {
    if (!confirm("እርግጠኛ ነህ ማጥፋት ትፈልጋለህ?")) return;
    const res = await fetch(`${apiBase}/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (data.success) loadStaff();
    else alert(data.message);
  }

  async function handleResetPassword(id: string) {
    if (!resetPassword.trim()) return;
    await fetch(`${apiBase}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ newPassword: resetPassword }),
    });
    setResetTarget(null);
    setResetPassword("");
    setMessage("✅ Password ተቀይሯል");
  }

  return (
    <div className="text-white pt-7">
      <h1 className="text-3xl font-bold mb-6 text-yellow-500">Manage Staff Auth</h1>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => switchTab("waiter")}
          className={`px-5 py-2 rounded-full font-semibold transition ${
            staffType === "waiter"
              ? "bg-yellow-500 text-black"
              : "bg-gray-900 border border-gray-700 hover:bg-gray-800"
          }`}
        >
          🍽️ Waiters
        </button>
        <button
          onClick={() => switchTab("kitchen")}
          className={`px-5 py-2 rounded-full font-semibold transition ${
            staffType === "kitchen"
              ? "bg-yellow-500 text-black"
              : "bg-gray-900 border border-gray-700 hover:bg-gray-800"
          }`}
        >
          🍳 Kitchen Staff
        </button>
      </div>

      {/* Create Form */}
      <form
        onSubmit={handleCreate}
        className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-8 max-w-xl"
      >
        <h2 className="text-lg font-bold mb-4 text-yellow-400">
          አዲስ {staffType === "waiter" ? "Waiter" : "Kitchen Staff"} ጨምር
        </h2>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Password</label>
            <input
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm text-gray-400 mb-1">ሙሉ ስም (አማራጭ)</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg"
          />
        </div>

        {message && <p className="text-sm text-amber-400 mb-3">{message}</p>}

        <button
          type="submit"
          className="bg-yellow-500 text-black font-bold px-6 py-2 rounded-xl hover:bg-yellow-400 transition"
        >
          ጨምር
        </button>
      </form>

      {/* Staff List */}
      {loading ? (
        <p className="text-gray-400">እየጫነ ነው...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {staffList.map((member) => (
            <div
              key={member.id}
              className="bg-gray-900 border border-gray-800 rounded-xl p-4"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-semibold">{member.fullName || member.username}</p>
                  <p className="text-xs text-gray-400">@{member.username}</p>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    member.isActive
                      ? "bg-green-900/50 text-green-400"
                      : "bg-red-900/50 text-red-400"
                  }`}
                >
                  {member.isActive ? "Active" : "Disabled"}
                </span>
              </div>

              {resetTarget === member.id ? (
                <div className="flex gap-2 mt-3">
                  <input
                    type="text"
                    value={resetPassword}
                    onChange={(e) => setResetPassword(e.target.value)}
                    placeholder="አዲስ password"
                    className="flex-1 text-sm px-2 py-1.5 bg-gray-800 border border-gray-700 rounded-lg"
                  />
                  <button
                    onClick={() => handleResetPassword(member.id)}
                    className="text-sm bg-yellow-500 text-black px-3 py-1.5 rounded-lg font-semibold"
                  >
                    አስቀምጥ
                  </button>
                </div>
              ) : (
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => toggleActive(member)}
                    className="flex-1 text-sm bg-gray-800 hover:bg-gray-700 py-1.5 rounded-lg transition"
                  >
                    {member.isActive ? "አሰናክል" : "አንቃ"}
                  </button>
                  <button
                    onClick={() => setResetTarget(member.id)}
                    className="flex-1 text-sm bg-gray-800 hover:bg-gray-700 py-1.5 rounded-lg transition"
                  >
                    Password ቀይር
                  </button>
                  <button
                    onClick={() => handleDelete(member.id)}
                    className="flex-1 text-sm bg-red-900/50 hover:bg-red-900 text-red-300 py-1.5 rounded-lg transition"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}

          {staffList.length === 0 && (
            <p className="text-gray-400 col-span-full text-center py-10">
              ምንም {staffType === "waiter" ? "waiter" : "kitchen staff"} የለም
            </p>
          )}
        </div>
      )}
    </div>
  );
}