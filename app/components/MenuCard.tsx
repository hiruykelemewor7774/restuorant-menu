"use client";

import { useState } from "react";
import Image from 'next/image'
import { useCart } from '../context/CartContext'
import { useLanguage } from '../context/LanguageContext';

export type MenuItem = {
  name: string
  price: string
  image: string
  href: string
}

export default function MenuCard({
  item,
  category = "Food",
}: {
  item: MenuItem
  category?: string
}) {
  const { addToCart } = useCart()
  const { t } = useLanguage()
  const [showDetails, setShowDetails] = useState(false)

  function handleAdd(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    addToCart({
      name: item.name,
      price: item.price,
      image: item.image,
      category,
    })
  }

  function openDetails() {
    setShowDetails(true)
  }

  function closeDetails(e?: React.MouseEvent) {
    e?.stopPropagation()
    setShowDetails(false)
  }

  return (
    <>
      <div
        onClick={openDetails}
        className="block rounded-2xl border bg-white border-gray-200 overflow-hidden shadow-sm
         hover:shadow-lg hover:-translate-y-1 transition-all relative cursor-pointer"
      >
        <div className="bg-white relative h-48 w-full rounded-2xl
           border
           border-white/10
          
           backdrop-blur-xl
           p-6
           transition-all
           duration-300
           hover:scale-105
           hover:bg-white/10">
          <Image src={item.image} alt={item.name} fill className="object-cover" />
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold">{item.name}</h3>
          <p className="text-amber-500 font-bold mt-1">{item.price}</p>

          <button
            onClick={handleAdd}
            className="mt-3 w-full bg-amber-500 text-black font-semibold py-2 rounded-full hover:bg-amber-600 transition"
          >
            🛒 {t("addToCart")}
          </button>
        </div>
      </div>

      {/* Details Popup */}
      {showDetails && (
        <div
          onClick={closeDetails}
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl overflow-hidden shadow-2xl max-w-md w-full relative"
          >
            <button
              onClick={closeDetails}
              className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center text-lg font-bold transition"
            >
              ✕
            </button>

            <div className="relative h-64 w-full bg-gray-100">
              <Image src={item.image} alt={item.name} fill className="object-cover" />
            </div>

            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {item.name}
              </h2>
              <p className="text-amber-500 font-bold text-xl mb-4">
                {item.price}
              </p>
              <p className="text-gray-500 text-sm mb-6">
                {category}
              </p>

              <div className="flex gap-3">
                <button
                  onClick={(e) => {
                    handleAdd(e)
                    closeDetails()
                  }}
                  className="flex-1 bg-amber-500 text-black font-semibold py-3 rounded-full hover:bg-amber-600 transition"
                >
                  🛒 {t("addToCart")}
                </button>
                <button
                  onClick={closeDetails}
                  className="px-6 border border-gray-300 text-gray-700 font-semibold py-3 rounded-full hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}