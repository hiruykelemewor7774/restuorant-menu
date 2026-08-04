'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useCart } from '../context/CartContext'

type DbMenuItem = {
  id: string
  type: string
  category: string
  name: string
  price: string
  image: string
  features: string | null
}

export default function RoomMenu() {
  const [rooms, setRooms] = useState<DbMenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const { addToCart } = useCart()

  useEffect(() => {
    fetch('/api/menu', { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          const roomItems: DbMenuItem[] = data.items.filter(
            (i: DbMenuItem) => i.type === 'Room'
          )
          setRooms(roomItems)
        }
        setLoading(false)
      })
  }, [])

  function handleAdd(room: DbMenuItem) {
    addToCart({
      name: room.name,
      price: room.price,
      image: room.image,
      category: 'Room',
    })
  }

  return (
    <main className="max-w-6xl mx-auto px-6 py-2">
      <h1 className="text-4xl font-bold mb-2 pt-25">Rooms</h1>
      <p className="text-amber-400 mb-3">Choose the room that fits your stay.</p>

      {loading ? (
        <p className="text-gray-400">Loading...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {rooms.map((room) => {
            const features: string[] = room.features ? JSON.parse(room.features) : []

            return (
              <div
                key={room.id}
                className="flex flex-col rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                <div className="relative h-48 w-full">
                  <Image src={room.image} alt={room.name} fill className="object-cover" />
                </div>

                <div className="flex flex-1 flex-col p-4">
                  <h3 className="text-lg font-semibold">{room.name}</h3>
                  <p className="text-amber-500 font-bold mt-1">{room.price}</p>

                  <ul className="mt-3 space-y-1 text-sm text-gray-600">
                    {features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2">
                        <span className="text-amber-500">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => handleAdd(room)}
                    className="mt-4 inline-block rounded-full bg-amber-500 px-5 py-2 text-center font-semibold text-black transition-colors hover:bg-amber-600"
                  >
                    🛒 Add to Cart
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </main>
  )
}