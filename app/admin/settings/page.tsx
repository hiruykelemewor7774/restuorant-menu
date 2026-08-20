"use client";

export default function AdminSettingsPage() {
  return (
    <div className="h-screen text-amber-500 pt-8 pl-5 bg-gray-200">
      <h1 className="text-3xl font-bold mb-6 text-yellow-500">⚙️ System Settings</h1>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 max-w-2xl space-y-6">
        <div>
          <label className="block text-sm text-gray-800 mb-1">Restaurant Name</label>
          <input
            type="text"
            defaultValue="Kereami"
            className="w-full px-3 py-2 bg-gray-200 text-gray-500 border border-gray-700 rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-800 mb-1">Service Charge (Birr)</label>
          <input
            type="number"
            defaultValue={30}
            className="w-full px-3 py-2 bg-gray-200 text-gray-500 border border-gray-700 rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-800 mb-1">Tax Rate (%)</label>
          <input
            type="number"
            defaultValue={0}
            className="w-full px-3 py-2 bg-gray-200 border text-gray-500 border-gray-700 rounded-lg"
          />
        </div>
        <p className="text-xs text-gray-500">
          ⚠️ ይህ ገፅ UI ብቻ ነው (ገና database ጋር አልተገናኘም) - ማስቀመጥ ካስፈለገ ንገረኝ Settings model እንፈጥራለን።
        </p>
        <button className="bg-yellow-500 text-black font-bold px-6 py-2 rounded-xl hover:bg-yellow-400">
          Save Changes
        </button>
      </div>
    </div>
  );
}