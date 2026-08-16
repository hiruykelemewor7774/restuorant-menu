"use client";

import { useState } from "react";
import { QRCodeCanvas } from "qrcode.react";

export default function TableManagementPage() {
  const [tableNumber, setTableNumber] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [tables, setTables] = useState([
    { id: 1, tableNumber: "Table-01" },
    { id: 2, tableNumber: "Table-02" },
  ]);

  const handleAddTable = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedInput = tableNumber.trim();
    if (!trimmedInput) return;

    // ቫሊዴሽን: ዴጂት (ቁጥር) ብቻ ወይም በ Table- የሚጀምር መሆን እንዳለበት ማረጋገጫ
    const isValidFormat = /^(Table-\d+|\d+)$/i.test(trimmedInput);
    if (!isValidFormat) {
      setErrorMsg("Please enter a valid table number (e.g. 3 or Table-03)");
      return;
    }

    setErrorMsg("");
    // ኪዳኑ ቁጥር ብቻ ከገባ በራስሰር Table- ይቀጥጥለታል
    const formattedName = /^\d+$/.test(trimmedInput) ? `Table-${trimmedInput}` : trimmedInput;

    setTables([...tables, { id: Date.now(), tableNumber: formattedName }]);
    setTableNumber("");
  };

  return (
    <div className="flex text-white ">
      <main className="flex-1 p-10 mx-auto w-full">
        <h1 className="text-2xl font-bold mb-6 ml-0 text-yellow-500">Table & QR Code Management</h1>
        <form onSubmit={handleAddTable} className="flex flex-col gap-2 mb-8 max-w-xl w-full">
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Enter Table No (e.g., 3 or Table-03)"
              value={tableNumber}
              onChange={(e) => {
                setTableNumber(e.target.value);
                setErrorMsg("");
              }}
              className="flex-1 px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-xl focus:outline-none focus:border-yellow-500 text-gray-700"/>
            <button type="submit" className="bg-yellow-500 text-black font-bold px-6 py-2.5 rounded-xl hover:bg-yellow-400 transition cursor-pointer">
              Generate QR Code
            </button>
          </div>
          {errorMsg && <span className="text-xs text-red-400 ml-1">{errorMsg}</span>}
        </form>

        <div className="grid grid-cols-1 sm:grid-cols-4 md:grid-cols-4 gap-8 width-100">
          {tables.map((t) => (
            <div key={t.id} className="bg-gray-900 border border-gray-800 p-2 rounded-2xl flex flex-col items-center justify-between shadow-xl [min-h-360px]">
              <h3 className="text-xl font-bold text-yellow-400 mb-2">{t.tableNumber}</h3>
              
              <div className="bg-white rounded-xl shadow-inner flex items-center justify-center my-2">
               <QRCodeCanvas value={`http://192.168.137.1:3000/?table=${t.tableNumber}`} size={120} />             
              </div>
              <span className="text-xs text-gray-400 text-center mt-3">Scan to order from {t.tableNumber}</span>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}