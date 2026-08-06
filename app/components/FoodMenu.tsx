'use client'

import { useEffect, useState } from 'react'
import MenuCard, { MenuItem } from './MenuCard'
import { useLanguage } from '../context/LanguageContext'

type DbItem = {
  id: string
  type: string
  category: string
  name: string
  price: string
  image: string
}

export default function FoodMenu() {
  const [allItems, setAllItems] = useState<DbItem[]>([])
  const [loading, setLoading] = useState(true)
  const [active, setActive] = useState<string>('')
  const { t } = useLanguage()

  useEffect(() => {
    fetch('/api/menu', { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          const foodItems: DbItem[] = data.items.filter((i: DbItem) => i.type === 'Food')
          setAllItems(foodItems)
          const firstCategory = foodItems[0]?.category || ''
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
      href: `/food/${i.name.toLowerCase().replace(/\s+/g, '-')}`,
    }))

  return (
    <main className="max-w-6xl mx-auto px-6 py-2 mt-35">
      <h1 className="text-4xl font-bold mb-2 pt-25">{t("food")}</h1>
      <p className="mb-3">{t("foodSubtitle")}</p>

      {loading ? (
        <p className="text-gray-400">Loading...</p>
      ) : (
        <>
          <div className="flex flex-wrap gap-4 mb-8 rounded-2xl
        border
        border-white/10
        bg-white/5
        backdrop-blur-xl
        p-6
        transition-all
        duration-300
        hover:scale-105
        hover:bg-white/10">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActive(category)}
                className={`rounded-full px-5 py-2 font-semibold transition-colors ${
                  active === category
                    ? 'bg-amber-500 text-black'
                    : 'border hover:bg-gray-100 hover:text-black'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {itemsForActiveCategory.map((item) => (
              <MenuCard key={item.name} item={item} category="Food" />            
              ))}
          </div>
        </>
      )}
    </main>
  )
}