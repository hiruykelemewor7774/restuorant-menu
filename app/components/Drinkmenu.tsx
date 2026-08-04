'use client'

import { useEffect, useState } from 'react'
import MenuCard, { MenuItem } from '../components/MenuCard'

type DbItem = {
  id: string
  type: string
  category: string
  name: string
  price: string
  image: string
}

export default function DrinkPage() {
  const [allItems, setAllItems] = useState<DbItem[]>([])
  const [loading, setLoading] = useState(true)
  const [active, setActive] = useState<string>('')

  useEffect(() => {
    fetch('/api/menu', { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          const drinkItems: DbItem[] = data.items.filter((i: DbItem) => i.type === 'Drink')
          setAllItems(drinkItems)
          const firstCategory = drinkItems[0]?.category || ''
          setActive(firstCategory)
        }
        setLoading(false)
      })
  }, [])

  const categories = Array.from(new Set(allItems.map((i) => i.category)))
  const itemsForActiveCategory: MenuItem[] = allItems
    .filter((i) => i.category === active)
    .map((i) => ({
      name: i.name,
      price: i.price,
      image: i.image,
      href: `/drink/${i.name.toLowerCase().replace(/\s+/g, '-')}`,
    }))

  return (
    <main className="max-w-6xl mx-auto px-6 py-0">
      <h1 className="text-4xl font-bold mb-3 pt-25">Drinks</h1>

      {loading ? (
        <p className="text-gray-400">Loading...</p>
      ) : (
        <>
          <div className="flex gap-4 mb-8 ">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActive(category)}
                className={`rounded-full px-5 py-2 font-semibold transition-colors  ${
                  active === category
                    ? 'bg-amber-500 text-black'
                    : 'border hover:bg-gray-100 hover:text-black '
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 ">
            {itemsForActiveCategory.map((item) => (
              <MenuCard key={item.name} item={item} category="Food" />
            ))}
          </div>
        </>
      )}
    </main>
  )
}